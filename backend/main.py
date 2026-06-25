from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recipes_data import RECIPES

app = FastAPI(title="Lara's Kitchen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Lara's Kitchen API is running"}

@app.get("/api/recipes")
def get_recipes():
    return {"recipes": RECIPES}

@app.get("/api/recipes/{recipe_id}")
def get_recipe(recipe_id: int):
    recipe = next((r for r in RECIPES if r["id"] == recipe_id), None)
    if not recipe:
        return {"error": "Recipe not found"}
    return recipe