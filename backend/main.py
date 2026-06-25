from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    return {"recipes": [], "message": "recipes endpoint ready"}