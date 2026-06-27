import re

STAPLES = [
    "water",
    "salt", "sea salt", "kosher salt", "flaky salt",
    "pepper", "black pepper", "white pepper",
    "sugar", "brown sugar", "caster sugar", "icing sugar", "raw sugar",
    "flour", "plain flour", "self-raising flour", "bread flour", "cornflour", "corn flour",
    "oil", "olive oil", "vegetable oil", "canola oil", "sunflower oil", "coconut oil",
    "butter",
    "egg", "eggs",
    "garlic",
    "onion", "onions",
    "cumin", "ground cumin",
    "paprika", "smoked paprika",
    "turmeric", "ground turmeric",
    "cinnamon", "ground cinnamon",
    "yeast", "dried yeast", "instant yeast",
    "baking powder", "baking soda", "bicarbonate of soda",
    "vinegar", "white vinegar", "apple cider vinegar", "red wine vinegar", "balsamic vinegar",
    "bay leaf", "bay leaves",
    "oregano", "dried oregano",
    "thyme", "dried thyme",
    "rosemary", "dried rosemary",
    "basil", "dried basil",
    "parsley", "dried parsley",
    "chilli flakes", "chili flakes", "red chilli flakes",
    "cayenne", "cayenne pepper",
    "allspice",
    "cardamom", "ground cardamom",
    "nutmeg", "ground nutmeg",
    "cloves", "ground cloves",
    "coriander", "ground coriander", "dried coriander",
    "ginger powder", "ground ginger",
    "garlic powder",
    "onion powder",
    "mixed spice",
    "five spice",
    "curry powder",
    "saffron",
    "mint", "dried mint",
    "sumac",
    "za'atar",
]

_PATTERNS = [re.compile(r'\b' + re.escape(s) + r'\b') for s in STAPLES]


def is_staple(ingredient_name: str) -> bool:
    name = ingredient_name.lower().strip()
    return any(p.search(name) for p in _PATTERNS)
