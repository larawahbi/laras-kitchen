import t from '../translations';

function Filters({ recipes, mealFilter, cuisineFilter, onMealFilter, onCuisineFilter, lang }) {
  const tr = t[lang];
  const meals = [...new Set(recipes.map(r => r.meal_type))].sort();
  const cuisines = [...new Set(recipes.map(r => r.cuisine))].sort();

  return (
    <div className="filters-section">
      <div className="filters-header">
        <h2 className="section-title">{tr.filters_title}</h2>
        <span className="recipe-count">{recipes.length} {tr.filters_count}</span>
      </div>

      <div className="filter-group-label">{tr.filters_by_meal}</div>
      <div className="filter-row">
        <button
          className={`filter-chip ${mealFilter === 'all' ? 'active' : ''}`}
          onClick={() => onMealFilter('all')}
        >
          {tr.filters_all}
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

      <div className="filter-group-label">{tr.filters_by_cuisine}</div>
      <div className="filter-row">
        <button
          className={`filter-chip ${cuisineFilter === 'all' ? 'active' : ''}`}
          onClick={() => onCuisineFilter('all')}
        >
          {tr.filters_all}
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
