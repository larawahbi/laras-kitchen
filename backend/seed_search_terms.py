from sqlalchemy import text
from database import engine

MAPPINGS = [
    ("Cajun seasoning",                    "Cajun spice"),
    ("Lebanese cucumber, chopped",         "Cucumber"),
    ("Milk, enough to soak the bread",     "Full fat milk"),
    ("baby spinach",                       "baby spinach"),
    ("boneless chicken thighs",            "Chicken Thighs"),
    ("breadcrumbs",                        "breadcrumbs"),
    ("canned crushed tomatoes",            "canned tomatoes peeled"),
    ("chicken breast, sliced",             "chicken breast"),
    ("chocolate chips",                    "chocolate chips"),
    ("coarse bulgur wheat, rinsed",        "coarse bulgur"),
    ("cooked rice",                        "Short grain rice"),
    ("double cream",                       "thickened cream"),
    ("farfalle pasta",                     "farfalle pasta"),
    ("freshly grated parmesan",            "parmesan"),
    ("green peppers, blended",             "green ring peppers"),
    ("ground beef",                        "ground beef"),
    ("heavy cream",                        "thickened cream"),
    ("honey",                              "honey"),
    ("lemon juice",                        "lemon"),
    ("milk",                               "Full fat milk"),
    ("parmesan",                           "parmesan"),
    ("plain yoghurt",                      "greek yoghurt"),
    ("pomegranate molasses",               "pomegranate molasses"),
    ("potatoes, peeled and sliced",        "potatoes"),
    ("powdered milk",                      "powdered milk"),
    ("salmon fillets, skin on",            "salmon fillet"),
    ("shredded mozzarella",                "mozzarella"),
    ("soy sauce",                          "soy sauce"),
    ("sun-dried tomatoes",                 "sun-dried tomatoes"),
    ("sweet peppers, tops removed",        "bell pepper"),
    ("tomato paste",                       "tomato paste"),
    ("tomato puree",                       "canned tomatoes peeled"),
    ("tomato puree for base",              "canned tomatoes peeled"),
    ("vanilla extract",                    "vanilla extract"),
    ("white bread, crusts removed",        "bread"),
    ("yoghurt",                            "greek yoghurt"),
]


def run():
    with engine.connect() as conn:
        for ingredient_name, search_term in MAPPINGS:
            conn.execute(text("""
                INSERT INTO ingredient_search_terms (ingredient_name, search_term)
                VALUES (:ingredient_name, :search_term)
                ON CONFLICT (ingredient_name) DO NOTHING;
            """), {"ingredient_name": ingredient_name, "search_term": search_term})
        conn.commit()
    print(f"Seeded {len(MAPPINGS)} ingredient search term mappings.")


if __name__ == "__main__":
    run()
