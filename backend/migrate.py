from sqlalchemy import text
from database import engine

def run():
    with engine.connect() as conn:
        conn.execute(text(
            "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS ingredients_ar JSON;"
        ))
        conn.execute(text(
            "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS steps_ar JSON;"
        ))
        conn.commit()
    print("Migration complete: ingredients_ar and steps_ar columns added.")

if __name__ == "__main__":
    run()
