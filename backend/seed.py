from database import engine, SessionLocal, Base
from models import Recipe
from recipes_data import RECIPES

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    existing = db.query(Recipe).count()
    if existing > 0:
        print(f"Database already has {existing} recipes. Skipping seed.")
        db.close()
        return

    for r in RECIPES:
        recipe = Recipe(
            id=r["id"],
            name=r["name"],
            name_ar=r.get("name_ar"),
            cuisine=r["cuisine"],
            meal_type=r["meal_type"],
            prep_time=r["prep_time"],
            cook_time=r["cook_time"],
            total_time=r["total_time"],
            serves=r["serves"],
            rating=r["rating"],
            calories=r["calories"],
            estimated_cost=r["estimated_cost"],
            tags=r["tags"],
            side_dishes=r.get("side_dishes"),
            my_notes=r.get("my_notes"),
            source_link=r.get("source_link"),
            source_type=r.get("source_type"),
            youtube_id=r.get("youtube_id"),
            is_side=r["is_side"],
            cover_img=r["cover_img"],
            desc=r["desc"],
            ingredients=r["ingredients"],
            steps=r["steps"]
        )
        db.add(recipe)

    db.commit()
    db.close()
    print(f"Seeded {len(RECIPES)} recipes successfully.")

if __name__ == "__main__":
    seed()