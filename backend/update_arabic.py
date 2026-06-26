import json
import argparse
from sqlalchemy import text
from database import engine
from recipes_data import RECIPES

def update(force=False):
    with engine.connect() as conn:
        updated = 0
        skipped = 0
        for r in RECIPES:
            row = conn.execute(
                text("SELECT ingredients_ar, steps_ar FROM recipes WHERE id = :id"),
                {"id": r["id"]}
            ).mappings().fetchone()

            if row is None:
                print(f"  Recipe id={r['id']} not found in DB, skipping.")
                continue

            needs_ingredients = force or row["ingredients_ar"] is None
            needs_steps = force or row["steps_ar"] is None

            if not needs_ingredients and not needs_steps:
                print(f"  Skipped id={r['id']}: {r['name']} (already set)")
                skipped += 1
                continue

            set_parts = []
            params = {"id": r["id"]}
            if needs_ingredients:
                set_parts.append("ingredients_ar = CAST(:ingredients_ar AS JSON)")
                params["ingredients_ar"] = json.dumps(r.get("ingredients_ar"), ensure_ascii=False)
            if needs_steps:
                set_parts.append("steps_ar = CAST(:steps_ar AS JSON)")
                params["steps_ar"] = json.dumps(r.get("steps_ar"), ensure_ascii=False)

            conn.execute(text(f"UPDATE recipes SET {', '.join(set_parts)} WHERE id = :id"), params)
            print(f"  Updated id={r['id']}: {r['name']}")
            updated += 1

        conn.commit()
    print(f"\nDone — {updated} updated, {skipped} skipped (already set).")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Overwrite existing Arabic fields")
    args = parser.parse_args()
    update(force=args.force)
