from collections import defaultdict
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
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


# ── Amount formatting ────────────────────────────────────────────────────────

_FRAC_STR   = {0.5: '½', 0.25: '¼', 0.75: '¾', 2/3: '⅔', 1/3: '⅓'}
_PLURAL_EN  = {'cup': 'cups', 'clove': 'cloves'}
_NOTE_PLURAL = {'handful': 'handfuls', 'slice': 'slices', 'leaf': 'leaves'}
_SIZE_AR    = {
    'medium': 'متوسطة', 'large': 'كبير', 'head': '',
    'handful': 'حفنة', 'slice': 'شريحة', 'leaf': 'ورقة',
}


def _qty_str(qty):
    if qty is None:
        return None
    frac  = qty % 1
    whole = int(qty)
    if frac == 0:
        return str(whole)
    for f, s in _FRAC_STR.items():
        if abs(frac - f) < 0.001:
            return (str(whole) if whole else '') + s
    return str(round(qty, 2))


def _format_amount_en(qty, unit_code, note):
    if unit_code == 'to_taste':
        return ''
    if unit_code == 'pinch':
        return 'pinch'
    if note and note.startswith('Between '):
        range_part = note[8:]
        if unit_code:
            unit_disp = _PLURAL_EN.get(unit_code, unit_code) if (qty and qty > 1) else unit_code
            return f"{range_part} {unit_disp}"
        return range_part
    q = _qty_str(qty)
    if q is None:
        return ''
    if not unit_code:
        if note:
            note_disp = _NOTE_PLURAL.get(note, note) if (qty and qty > 1) else note
            return f"{q} {note_disp}"
        return q
    if unit_code in ('g', 'kg'):
        return f"{q}{unit_code}"
    unit_disp = _PLURAL_EN.get(unit_code, unit_code) if (qty and qty > 1) else unit_code
    return f"{q} {unit_disp}"


def _format_amount_ar(qty, unit_code, unit_name_ar, note):
    if unit_code == 'to_taste':
        return ''
    if unit_code == 'pinch':
        return 'رشة'
    q = _qty_str(qty)
    if note and note.startswith('Between '):
        if unit_code and unit_name_ar:
            return f"{q} {unit_name_ar}" if q else unit_name_ar
        return q or ''
    if q is None:
        return ''
    if not unit_code:
        if note:
            ar_desc = _SIZE_AR.get(note, '')
            return f"{q} {ar_desc}".strip() if ar_desc else q
        return q
    if unit_code in ('g', 'kg'):
        return f"{q} {unit_name_ar}"
    return f"{q} {unit_name_ar}" if unit_name_ar else q


# ── Ingredient assembly ──────────────────────────────────────────────────────

_RI_QUERY = """
    SELECT ri.recipe_id, ri.group_name, ri.sort_order,
           ri.quantity, ri.unit_code, ri.note,
           i.name_en, i.name_ar,
           u.name_ar AS unit_name_ar
    FROM recipe_ingredients ri
    JOIN ingredients i ON i.id = ri.ingredient_id
    LEFT JOIN units u ON u.code = ri.unit_code
    {where}
    ORDER BY ri.recipe_id, ri.sort_order
"""


def _ar_group_map(recipe):
    en_groups = recipe.ingredients or []
    ar_groups = recipe.ingredients_ar or []
    return {
        (eg.get('group') or ''): (ag.get('group') or '')
        for eg, ag in zip(en_groups, ar_groups)
    }


def _assemble(ri_rows, ar_map):
    """
    Build (ingredients_en, ingredients_ar) from recipe_ingredients rows.
    Returns (None, None) if rows is empty so callers can fall back to JSON columns.
    """
    if not ri_rows:
        return None, None

    en_groups, ar_groups, order = {}, {}, []
    for row in ri_rows:
        g = row.group_name or ''
        if g not in en_groups:
            en_groups[g] = []
            ar_groups[g] = []
            order.append(g)
        en_groups[g].append({
            "amount": _format_amount_en(row.quantity, row.unit_code, row.note),
            "name":   row.name_en,
        })
        ar_groups[g].append({
            "amount": _format_amount_ar(row.quantity, row.unit_code, row.unit_name_ar, row.note),
            "name":   row.name_ar,
        })

    en_list = [{"group": g,               "items": en_groups[g]} for g in order]
    ar_list = [{"group": ar_map.get(g, g), "items": ar_groups[g]} for g in order]
    return en_list, ar_list


# ── Core dict helper ─────────────────────────────────────────────────────────

def _recipe_to_dict(r):
    return {c.name: getattr(r, c.name) for c in r.__table__.columns}


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Lara's Kitchen API is running"}


@app.get("/api/recipes")
def get_recipes(db: Session = Depends(get_db)):
    recipes = db.query(Recipe).all()

    all_ri = db.execute(text(_RI_QUERY.format(where=''))).fetchall()
    ri_by_recipe = defaultdict(list)
    for row in all_ri:
        ri_by_recipe[row.recipe_id].append(row)

    result = []
    for r in recipes:
        data = _recipe_to_dict(r)
        en_ingr, ar_ingr = _assemble(ri_by_recipe[r.id], _ar_group_map(r))
        if en_ingr is not None:
            data['ingredients']    = en_ingr
            data['ingredients_ar'] = ar_ingr
        result.append(data)
    return {"recipes": result}


@app.get("/api/recipes/{recipe_id}")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    ri_rows = db.execute(
        text(_RI_QUERY.format(where='WHERE ri.recipe_id = :rid')),
        {"rid": recipe_id}
    ).fetchall()

    data = _recipe_to_dict(recipe)
    en_ingr, ar_ingr = _assemble(ri_rows, _ar_group_map(recipe))
    if en_ingr is not None:
        data['ingredients']    = en_ingr
        data['ingredients_ar'] = ar_ingr
    return data

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
