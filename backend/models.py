from sqlalchemy import Column, Integer, String, Float, Boolean, JSON
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