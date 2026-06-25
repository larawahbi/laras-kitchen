function RecipeCard({ recipe, onClick }) {
  return (
    <article className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="card-img-wrap">
        <img src={recipe.cover_img} alt={recipe.name} loading="lazy" />
        <span className="card-cuisine-badge">{recipe.cuisine}</span>
        <span className="card-rating">{recipe.rating}</span>
      </div>
      <div className="card-body">
        <div className="card-meal-type">{recipe.meal_type}</div>
        <h3 className="card-title">{recipe.name}</h3>
        <div className="card-tags">
          {recipe.tags.map(tag => (
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>
        <div className="card-meta">
          <span className="card-meta-item">⏱ {recipe.total_time}m</span>
          <span className="card-meta-item">👤 {recipe.serves}</span>
          <span className="card-meta-item">~{recipe.calories} kcal</span>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;
