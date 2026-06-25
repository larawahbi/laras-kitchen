function Filters({ recipes, mealFilter, cuisineFilter, onMealFilter, onCuisineFilter }) {
  const meals = [...new Set(recipes.map(r => r.meal_type))].sort();
  const cuisines = [...new Set(recipes.map(r => r.cuisine))].sort();

  return (
    <div className="filters-section">
      <div className="filters-header">
        <h2 className="section-title">All Recipes</h2>
        <span className="recipe-count">{recipes.length} recipes</span>
      </div>

      <div className="filter-group-label">By Meal</div>
      <div className="filter-row">
        <button
          className={`filter-chip ${mealFilter === 'all' ? 'active' : ''}`}
          onClick={() => onMealFilter('all')}
        >
          All
        </button>
        {meals.map(meal => (
          <button
            key={meal}
            className={`filter-chip ${mealFilter === meal ? 'active' : ''}`}
            onClick={() => onMealFilter(mealFilter === meal ? 'all' : meal)}
          >
            {meal}
          </button>
        ))}
      </div>

      <div className="filter-group-label">By Cuisine</div>
      <div className="filter-row">
        <button
          className={`filter-chip ${cuisineFilter === 'all' ? 'active' : ''}`}
          onClick={() => onCuisineFilter('all')}
        >
          All
        </button>
        {cuisines.map(cuisine => (
          <button
            key={cuisine}
            className={`filter-chip ${cuisineFilter === cuisine ? 'active' : ''}`}
            onClick={() => onCuisineFilter(cuisineFilter === cuisine ? 'all' : cuisine)}
          >
            {cuisine}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filters;