function RecipeDetail({ recipe, onClose, onStartCooking }) {  if (!recipe) return null;

  return (
    <div className="recipe-overlay open">
     <div className="recipe-back">
  <button className="back-btn" onClick={onClose}>
    ← Back to Recipes
  </button>
  <div className="recipe-actions">
    <button
      className="cook-mode-btn"
      onClick={() => onStartCooking(recipe)}
    >
      🍳 Start Cooking
    </button>
  </div>
</div>
      {!recipe.is_side && (
        <img
          className="recipe-hero-img"
          src={recipe.cover_img}
          alt={recipe.name}
        />
      )}

      <div className="recipe-content">
        {recipe.is_side && (
          <div style={{
            width:'100%',
            height:'260px',
            marginBottom:'28px',
            borderRadius:'16px',
            overflow:'hidden'
          }}>
            <img
              src={recipe.cover_img}
              alt={recipe.name}
              style={{width:'100%',height:'100%',objectFit:'cover'}}
            />
          </div>
        )}

        <div className="recipe-cuisine-label">
          {recipe.cuisine} · {recipe.meal_type}
        </div>
        <h1 className="recipe-title">{recipe.name}</h1>
        <p className="recipe-desc">{recipe.desc}</p>

        <div className="recipe-stats">
          <div className="recipe-stat">
            <span className="stat-value">{recipe.prep_time}m</span>
            <span className="stat-label">Prep</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">{recipe.cook_time}m</span>
            <span className="stat-label">Cook</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">{recipe.total_time}m</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">{recipe.serves}</span>
            <span className="stat-label">Serves</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">~{recipe.calories}</span>
            <span className="stat-label">kcal</span>
          </div>
        </div>

        <div className="recipe-layout">
          <div className="ingredient-box">
            <h3>Ingredients</h3>
            {recipe.ingredients.map((group, i) => (
              <div key={i} className="ingredient-group">
                {group.group && (
                  <div className="ingredient-group-title">{group.group}</div>
                )}
                {group.items.map((item, j) => (
                  <div key={j} className="ingredient-item">
                    <span className="ingredient-amount">{item.amount}</span>
                    <span className="ingredient-name">{item.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="steps-section">
            <h3>Method</h3>
            {recipe.steps.map((step, i) => (
              <div key={i} className="step">
                <div className="step-number">{i + 1}</div>
                <div className="step-body">
                  <div className="step-title">{step.title}</div>
                  <div className="step-text">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {recipe.my_notes && (
          <div className="footer-card" style={{marginTop:'28px'}}>
            <h4>My Notes</h4>
            <p>{recipe.my_notes}</p>
          </div>
        )}

        {recipe.side_dishes && (
          <div className="footer-card" style={{marginTop:'12px'}}>
            <h4>Serve With</h4>
            <p>{recipe.side_dishes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetail;