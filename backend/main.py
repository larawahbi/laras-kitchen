from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models import Recipe, RecipeIngredientPrice
from fetch_prices import fetch_recipe_prices

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

@app.get("/api/recipes/{recipe_id}/prices")
def get_recipe_prices(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    prices = db.query(RecipeIngredientPrice).filter(
        RecipeIngredientPrice.recipe_id == recipe_id
    ).all()
    return {
        "recipe_id": recipe_id,
        "price_total": recipe.price_total,
        "price_last_checked": recipe.price_last_checked,
        "ingredients": [
            {
                "ingredient_name": p.ingredient_name,
                "woolworths_product_name": p.woolworths_product_name,
                "woolworths_brand": p.woolworths_brand,
                "woolworths_weight": p.woolworths_weight,
                "woolworths_price": p.woolworths_price,
                "woolworths_url": p.woolworths_url,
                "fetched_at": p.fetched_at,
            }
            for p in prices
        ],
    }

@app.get("/api/recipes/{recipe_id}/prices/refresh")
def refresh_recipe_prices(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    total = fetch_recipe_prices(recipe, db, force=True)
    return {
        "recipe_id": recipe_id,
        "price_total": total,
        "price_last_checked": recipe.price_last_checked,
    }
