import t from '../translations';

function RecipeDetail({ recipe, onClose, onStartCooking, lang }) {
  if (!recipe) return null;

  const tr = t[lang];
  const name = lang === 'ar' && recipe.name_ar ? recipe.name_ar : recipe.name;

  return (
    <div className="recipe-overlay open">
      <div className="recipe-back">
        <button className="back-btn" onClick={onClose}>
          {tr.back}
        </button>
        <div className="recipe-actions">
          <button
            className="cook-mode-btn"
            onClick={() => onStartCooking(recipe)}
          >
            {tr.start_cooking}
          </button>
        </div>
      </div>

      {!recipe.is_side && (
        <img
          className="recipe-hero-img"
          src={recipe.cover_img}
          alt={name}
        />
      )}

      <div className="recipe-content">
        {recipe.is_side && (
          <div style={{
            width: '100%',
            height: '260px',
            marginBottom: '28px',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <img
              src={recipe.cover_img}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="recipe-cuisine-label">
          {recipe.cuisine} · {recipe.meal_type}
        </div>
        <h1 className="recipe-title">{name}</h1>
        <p className="recipe-desc">{recipe.desc}</p>

        <div className="recipe-stats">
          <div className="recipe-stat">
            <span className="stat-value">{recipe.prep_time}m</span>
            <span className="stat-label">{tr.prep}</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">{recipe.cook_time}m</span>
            <span className="stat-label">{tr.cook}</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">{recipe.total_time}m</span>
            <span className="stat-label">{tr.total}</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">{recipe.serves}</span>
            <span className="stat-label">{tr.serves}</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">~{recipe.calories}</span>
            <span className="stat-label">{tr.kcal}</span>
          </div>
        </div>

        <div className="recipe-layout">
          <div className="ingredient-box">
            <h3>{tr.ingredients}</h3>
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
            <h3>{tr.method}</h3>
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
          <div className="footer-card" style={{ marginTop: '28px' }}>
            <h4>{tr.my_notes}</h4>
            <p>{recipe.my_notes}</p>
          </div>
        )}

        {recipe.side_dishes && (
          <div className="footer-card" style={{ marginTop: '12px' }}>
            <h4>{tr.serve_with}</h4>
            <p>{recipe.side_dishes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetail;
