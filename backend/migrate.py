from sqlalchemy import text
from database import engine

def run():
    with engine.connect() as conn:
        # migration 1: arabic content columns
        conn.execute(text(
            "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS ingredients_ar JSON;"
        ))
        conn.execute(text(
            "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS steps_ar JSON;"
        ))

        # migration 2: coles pricing
        conn.execute(text(
            "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS price_total FLOAT;"
        ))
        conn.execute(text(
            "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS price_last_checked TIMESTAMP;"
        ))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS recipe_ingredient_prices (
                id               SERIAL PRIMARY KEY,
                recipe_id        INTEGER REFERENCES recipes(id),
                ingredient_name  TEXT,
                coles_product_name TEXT,
                coles_brand      TEXT,
                coles_weight     TEXT,
                coles_price      FLOAT,
                coles_url        TEXT,
                fetched_at       TIMESTAMP,
                UNIQUE (recipe_id, ingredient_name)
            );
        """))

        # migration 3: rename coles_* columns to woolworths_*
        for old, new in [
            ("coles_product_name", "woolworths_product_name"),
            ("coles_brand",        "woolworths_brand"),
            ("coles_weight",       "woolworths_weight"),
            ("coles_price",        "woolworths_price"),
            ("coles_url",          "woolworths_url"),
        ]:
            conn.execute(text(f"""
                DO $$ BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_name = 'recipe_ingredient_prices'
                        AND column_name = '{old}'
                    ) THEN
                        ALTER TABLE recipe_ingredient_prices
                        RENAME COLUMN {old} TO {new};
                    END IF;
                END $$;
            """))

        # migration 4: ingredient search term lookup table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS ingredient_search_terms (
                ingredient_name  TEXT PRIMARY KEY,
                search_term      TEXT NOT NULL
            );
        """))

        conn.commit()
    print("Migration complete.")

if __name__ == "__main__":
    run()
