# Migration log — all migrations applied against the live Railway PostgreSQL database.
# There is no Alembic. Future migrations should be added to this file using sqlalchemy.text().
#
# Migration 1 — Added ingredients_ar and steps_ar columns to recipes
# Migration 2 — Created recipe_ingredient_prices table with coles_* columns
# Migration 3 — Renamed coles_* columns to woolworths_* in recipe_ingredient_prices
# Migration 4 — Created ingredient_search_terms table
# Migration 5 — Added price_total and price_last_checked to recipes
# Migration 6 — Created units and ingredients lookup tables; seeded units
# Migration 7 — Created recipe_ingredients table; migrated from recipes.ingredients JSON


from sqlalchemy import text
from database import engine


UNITS_SEED = [
    # code,        name_en,       name_ar,             unit_type,  scalable
    ("tbsp",       "tablespoon",  "ملعقة كبيرة",        "volume",   True),
    ("tsp",        "teaspoon",    "ملعقة صغيرة",        "volume",   True),
    ("cup",        "cup",         "كوب",               "volume",   True),
    ("g",          "gram",        "جرام",              "weight",   True),
    ("kg",         "kilogram",    "كيلوجرام",          "weight",   True),
    ("clove",      "clove",       "فص",                "count",    True),
    ("pinch",      "pinch",       "رشة",               "informal", False),
    ("to_taste",   "to taste",    "حسب الذوق",         "informal", False),
]


def migration_6():
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS units (
                code        VARCHAR PRIMARY KEY,
                name_en     VARCHAR NOT NULL,
                name_ar     VARCHAR NOT NULL,
                unit_type   VARCHAR NOT NULL,
                scalable    BOOLEAN NOT NULL DEFAULT TRUE
            )
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS ingredients (
                id                  SERIAL PRIMARY KEY,
                name_en             VARCHAR NOT NULL,
                name_ar             VARCHAR NOT NULL,
                is_staple           BOOLEAN NOT NULL DEFAULT FALSE,
                search_term         VARCHAR,
                calories_per_100g   FLOAT,
                protein_per_100g    FLOAT,
                carbs_per_100g      FLOAT,
                fat_per_100g        FLOAT,
                grams_per_cup       FLOAT,
                grams_per_tbsp      FLOAT,
                grams_per_unit      FLOAT
            )
        """))

        for code, name_en, name_ar, unit_type, scalable in UNITS_SEED:
            conn.execute(text("""
                INSERT INTO units (code, name_en, name_ar, unit_type, scalable)
                VALUES (:code, :name_en, :name_ar, :unit_type, :scalable)
                ON CONFLICT (code) DO NOTHING
            """), {
                "code": code,
                "name_en": name_en,
                "name_ar": name_ar,
                "unit_type": unit_type,
                "scalable": scalable,
            })

        conn.commit()
    print("Migration 6 complete: units and ingredients tables created, units seeded.")


def migration_7():
    """
    Creates recipe_ingredients table and migrates all ingredient rows from the
    recipes.ingredients JSON column into relational form.

    - Backs up recipes table first (recipes_backup) — leaves original intact.
    - Populates ingredients lookup table from all unique ingredient names.
    - Leaves recipes.ingredients and recipes.ingredients_ar in place as fallback.
    - Idempotent: skips seed if recipe_ingredients already has rows.
    """
    import json, re
    from staples import is_staple
    from seed_search_terms import MAPPINGS as SEARCH_TERM_MAPPINGS

    FRACTION_MAP = {'½': 0.5, '¼': 0.25, '¾': 0.75, '⅔': 2/3, '⅓': 1/3}
    UNIT_MAP = {
        'tbsp': 'tbsp', 'tbsps': 'tbsp',
        'tsp': 'tsp', 'tsps': 'tsp',
        'cup': 'cup', 'cups': 'cup',
        'clove': 'clove', 'cloves': 'clove',
        'g': 'g', 'kg': 'kg',
    }
    SIZE_WORDS = {
        'medium': 'medium', 'large': 'large', 'head': 'head',
        'handful': 'handful', 'handfuls': 'handful',
        'slice': 'slice', 'slices': 'slice',
        'leaf': 'leaf', 'leaves': 'leaf',
    }
    search_term_map = dict(SEARCH_TERM_MAPPINGS)

    def to_num(s):
        s = s.strip()
        if s in FRACTION_MAP:
            return FRACTION_MAP[s]
        try:
            return float(s)
        except ValueError:
            pass
        for frac, val in FRACTION_MAP.items():
            if frac in s:
                idx = s.index(frac)
                whole = s[:idx].strip()
                try:
                    return (float(whole) if whole else 0.0) + val
                except ValueError:
                    pass
        return None

    def parse_amount(s):
        """Returns (quantity, unit_code, note)."""
        s = s.strip()
        if not s:
            return None, 'to_taste', None
        if s.lower() == 'pinch':
            return None, 'pinch', None

        # Range: contains en-dash (–)
        if '–' in s:
            lo_raw, hi_raw = s.split('–', 1)
            lo_raw, hi_raw = lo_raw.strip(), hi_raw.strip()
            hi_parts = hi_raw.split()
            hi_qty = to_num(hi_parts[0])
            unit_word = hi_parts[1].lower() if len(hi_parts) > 1 else None
            unit_code = UNIT_MAP.get(unit_word) if unit_word else None
            if unit_code:
                note = f"Between {lo_raw}–{hi_parts[0]}"
            else:
                note = f"Between {lo_raw}–{hi_raw}"
            return hi_qty, unit_code, note

        # Weight with no space: 500g, 125g, 1kg
        m = re.match(r'^(\d+(?:\.\d+)?)(g|kg)$', s)
        if m:
            return float(m.group(1)), m.group(2), None

        parts = s.split(None, 1)
        if len(parts) == 1:
            return to_num(parts[0]), None, None

        num_str, rest = parts[0], parts[1].strip()
        qty = to_num(num_str)
        rest_lower = rest.lower()

        unit_code = UNIT_MAP.get(rest_lower)
        if unit_code:
            return qty, unit_code, None

        size_norm = SIZE_WORDS.get(rest_lower)
        if size_norm:
            return qty, None, size_norm

        return qty, None, rest or None

    with engine.connect() as conn:
        # 1. Backup recipes table (first run only; kept as-is on subsequent runs)
        table_exists = conn.execute(text("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_name = 'recipes_backup'
            )
        """)).scalar()
        if not table_exists:
            conn.execute(text("CREATE TABLE recipes_backup AS SELECT * FROM recipes"))
            bcount = conn.execute(text("SELECT COUNT(*) FROM recipes_backup")).scalar()
            conn.commit()
            print(f"Backup: created recipes_backup with {bcount} rows.")
        else:
            bcount = conn.execute(text("SELECT COUNT(*) FROM recipes_backup")).scalar()
            print(f"Backup: recipes_backup already exists ({bcount} rows) — kept as-is.")

    with engine.connect() as conn:
        # 2. Create recipe_ingredients table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS recipe_ingredients (
                id             SERIAL PRIMARY KEY,
                recipe_id      INTEGER NOT NULL REFERENCES recipes(id),
                group_name     VARCHAR,
                sort_order     INTEGER NOT NULL,
                quantity       FLOAT,
                unit_code      VARCHAR REFERENCES units(code),
                ingredient_id  INTEGER NOT NULL REFERENCES ingredients(id),
                note           VARCHAR
            )
        """))
        conn.commit()

        # 3. Guard — skip if already seeded
        existing = conn.execute(text("SELECT COUNT(*) FROM recipe_ingredients")).scalar()
        if existing > 0:
            print(f"recipe_ingredients already has {existing} rows — skipping seed.")
            return

        # 4. Load all recipes with both EN and AR ingredient JSON
        rows = conn.execute(text("""
            SELECT id, name, ingredients::text, ingredients_ar::text
            FROM recipes ORDER BY id
        """)).fetchall()

        # 5. Build en→ar name map (first occurrence wins; conflicts logged)
        en_to_ar = {}
        for _, _, ingr_json, ingr_ar_json in rows:
            if not ingr_ar_json:
                continue
            for eg, ag in zip(json.loads(ingr_json), json.loads(ingr_ar_json)):
                for ei, ai in zip(eg.get('items', []), ag.get('items', [])):
                    en = ei['name'].strip()
                    ar = ai['name'].strip()
                    if en not in en_to_ar:
                        en_to_ar[en] = ar
                    elif en_to_ar[en] != ar:
                        print(f"  AR CONFLICT '{en}': keeping '{en_to_ar[en]}', ignoring '{ar}'")

        # 6. Ingredient get-or-create (within this connection/transaction)
        ingredient_cache = {}

        def get_or_create_ingredient(name_en):
            if name_en in ingredient_cache:
                return ingredient_cache[name_en]
            row = conn.execute(text(
                "SELECT id FROM ingredients WHERE name_en = :n"
            ), {"n": name_en}).fetchone()
            if row:
                ingredient_cache[name_en] = row[0]
                return row[0]
            name_ar = en_to_ar.get(name_en, '')
            iid = conn.execute(text("""
                INSERT INTO ingredients (name_en, name_ar, is_staple, search_term)
                VALUES (:en, :ar, :staple, :sterm)
                RETURNING id
            """), {
                "en": name_en,
                "ar": name_ar,
                "staple": is_staple(name_en),
                "sterm": search_term_map.get(name_en),
            }).scalar()
            ingredient_cache[name_en] = iid
            return iid

        # 7. Migrate recipe_ingredients
        total_ri_rows = 0
        for recipe_id, recipe_name, ingr_json, _ in rows:
            sort_order = 0
            for group in json.loads(ingr_json):
                gname = group.get('group') or None
                for item in group.get('items', []):
                    name_en = item['name'].strip()
                    amount  = item.get('amount', '')
                    qty, unit_code, note = parse_amount(amount)
                    iid = get_or_create_ingredient(name_en)
                    conn.execute(text("""
                        INSERT INTO recipe_ingredients
                            (recipe_id, group_name, sort_order, quantity, unit_code, ingredient_id, note)
                        VALUES
                            (:rid, :gname, :sort, :qty, :unit, :iid, :note)
                    """), {
                        "rid":   recipe_id,
                        "gname": gname,
                        "sort":  sort_order,
                        "qty":   qty,
                        "unit":  unit_code,
                        "iid":   iid,
                        "note":  note,
                    })
                    total_ri_rows += 1
                    sort_order += 1

        conn.commit()
        print(f"Migration 7 complete: {len(ingredient_cache)} ingredient rows, "
              f"{total_ri_rows} recipe_ingredients rows across {len(rows)} recipes.")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '7':
        migration_7()
    else:
        migration_6()
