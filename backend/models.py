from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime, ForeignKey
from database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    name_ar = Column(String)
    cuisine = Column(String)
    meal_type = Column(String)
    prep_time = Column(Integer)
    cook_time = Column(Integer)
    total_time = Column(Integer)
    serves = Column(Integer)
    rating = Column(String)
    calories = Column(Integer)
    estimated_cost = Column(Float)
    tags = Column(JSON)
    side_dishes = Column(String)
    my_notes = Column(String)
    source_link = Column(String)
    source_type = Column(String)
    youtube_id = Column(String)
    is_side = Column(Boolean)
    cover_img = Column(String)
    desc = Column(String)
    ingredients = Column(JSON)
    steps = Column(JSON)
    ingredients_ar = Column(JSON)
    steps_ar = Column(JSON)
    price_total = Column(Float)
    price_last_checked = Column(DateTime)
    desc_ar = Column(String)


class IngredientSearchTerm(Base):
    __tablename__ = "ingredient_search_terms"

    ingredient_name = Column(String, primary_key=True)
    search_term = Column(String, nullable=False)


class RecipeIngredientPrice(Base):
    __tablename__ = "recipe_ingredient_prices"

    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    ingredient_name = Column(String)
    woolworths_product_name = Column(String)
    woolworths_brand = Column(String)
    woolworths_weight = Column(String)
    woolworths_price = Column(Float)
    woolworths_url = Column(String)
    fetched_at = Column(DateTime)