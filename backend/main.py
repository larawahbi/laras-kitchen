from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models import Recipe

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lara's Kitchen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://helpful-eclair-c9ce27.netlify.app"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _recipe_to_dict(r):
    return {c.name: getattr(r, c.name) for c in r.__table__.columns}


@app.get("/")
def root():
    return {"message": "Lara's Kitchen API is running"}

@app.get("/api/recipes")
def get_recipes(db: Session = Depends(get_db)):
    recipes = db.query(Recipe).all()
    return {"recipes": [_recipe_to_dict(r) for r in recipes]}

@app.get("/api/recipes/{recipe_id}")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return _recipe_to_dict(recipe)
