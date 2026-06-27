import re
import time
import argparse
from datetime import datetime

from database import SessionLocal
from models import Recipe, RecipeIngredientPrice, IngredientSearchTerm
from staples import is_staple
from woolworths import search_woolworths

_DESCRIPTOR_PATTERN = re.compile(
    r"\b(finely|roughly|thinly|grated|chopped|sliced|peeled|drained|rinsed|fresh|dried|ground)\b",
    re.IGNORECASE,
)


def clean_ingredient_name(name: str) -> str:
    term = name.split(",")[0].strip()
    term = _DESCRIPTOR_PATTERN.sub("", term)
    term = " ".join(term.split())
    return term


def fetch_recipe_prices(recipe, db, force=False) -> float:
    all_items = [
        item
        for group in (recipe.ingredients or [])
        for item in group.get("items", [])
    ]

    total = 0.0
    first_api_call = True

    for item in all_items:
        name = item.get("name", "").strip()
        if not name:
            continue

        if is_staple(name):
            print(f"    ↷ {name} (staple, skipped)")
            continue

        existing = db.query(RecipeIngredientPrice).filter_by(
            recipe_id=recipe.id,
            ingredient_name=name,
        ).first()

        if not force and existing and existing.woolworths_price is not None:
            print(f"    ↷ {name} — ${existing.woolworths_price:.2f} (already set)")
            total += existing.woolworths_price
            continue

        if not first_api_call:
            time.sleep(1)
        first_api_call = False

        lookup = db.query(IngredientSearchTerm).filter_by(ingredient_name=name).first()
        if lookup:
            search_term = lookup.search_term
            source = "lookup"
        else:
            search_term = clean_ingredient_name(name)
            source = "cleaned"
        print(f"    → {name!r}  (searching: {search_term!r}, {source}) ...", end=" ", flush=True)
        result = search_woolworths(search_term)

        if result is None:
            print("no result")
            continue

        print(f"${result['price']:.2f} — {result['product_name']}")

        now = datetime.utcnow()
        if existing:
            existing.woolworths_product_name = result["product_name"]
            existing.woolworths_brand = result["brand"]
            existing.woolworths_weight = result["weight"]
            existing.woolworths_price = result["price"]
            existing.woolworths_url = result["url"]
            existing.fetched_at = now
        else:
            db.add(RecipeIngredientPrice(
                recipe_id=recipe.id,
                ingredient_name=name,
                woolworths_product_name=result["product_name"],
                woolworths_brand=result["brand"],
                woolworths_weight=result["weight"],
                woolworths_price=result["price"],
                woolworths_url=result["url"],
                fetched_at=now,
            ))

        total += result["price"]

    recipe.price_total = round(total, 2)
    recipe.price_last_checked = datetime.utcnow()
    db.commit()

    print(f"  Total: ${total:.2f}")
    return total


def run(force=False):
    db = SessionLocal()
    try:
        recipes = db.query(Recipe).order_by(Recipe.id).all()
        print(f"Processing {len(recipes)} recipes...\n")
        for recipe in recipes:
            print(f"[{recipe.id}] {recipe.name}")
            fetch_recipe_prices(recipe, db, force=force)
            print()
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Overwrite existing price data")
    args = parser.parse_args()
    run(force=args.force)
