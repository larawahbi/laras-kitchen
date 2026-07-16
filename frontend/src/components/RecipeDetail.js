import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import t from '../translations';
import API_URL, { SHOW_PRICES } from '../config';

function formatPriceDate(dateStr, lang) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(
    lang === 'ar' ? 'ar-EG' : 'en-AU',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
}

function RecipeDetail({ recipe, lang }) {
  const [priceData, setPriceData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!recipe || !SHOW_PRICES) return;
    setPriceData(null);
    fetch(`${API_URL}/api/recipes/${recipe.id}/prices`)
      .then(res => {
        if (!res.ok) throw new Error('price fetch failed');
        return res.json();
      })
      .then(data => setPriceData(data))
      .catch(() => setPriceData(null));
  }, [recipe?.id]);

  if (!recipe) return null;

  const tr = t[lang];
  const name = lang === 'ar' && recipe.name_ar ? recipe.name_ar : recipe.name;
  const desc = lang === 'ar' && recipe.desc_ar ? recipe.desc_ar : recipe.desc;
  const ingredients = (lang === 'ar' && recipe.ingredients_ar?.length) ? recipe.ingredients_ar : recipe.ingredients;
  const steps = (lang === 'ar' && recipe.steps_ar?.length) ? recipe.steps_ar : recipe.steps;
  const displayCuisine = lang === 'ar' ? (tr.cuisine_labels?.[recipe.cuisine] || recipe.cuisine) : recipe.cuisine;
  const displayMealType = lang === 'ar' ? (tr.meal_type_labels?.[recipe.meal_type] || recipe.meal_type) : recipe.meal_type;

  const allIngredientItems = (recipe.ingredients || []).flatMap(g => g.items || []);
  const priceMap = new Map((priceData?.ingredients || []).map(p => [p.ingredient_name, p]));
  const formattedDate = priceData?.price_last_checked
    ? formatPriceDate(priceData.price_last_checked, lang)
    : null;

  return (
    <div className="recipe-page page-fade-in">
      <div className="recipe-back">
        <button className="back-btn" onClick={() => navigate('/')}>
          {tr.back}
        </button>
        <div className="recipe-actions">
          <button
            className="cook-mode-btn"
            onClick={() => navigate(`/recipe/${recipe.id}/cook`)}
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
          {displayCuisine} · {displayMealType}
        </div>
        <h1 className="recipe-title">{name}</h1>
        <p className="recipe-desc">{desc}</p>

        <div className="recipe-stats">
          <div className="recipe-stat">
            <span className="stat-value">{recipe.prep_time}{tr.time_min}</span>
            <span className="stat-label">{tr.prep}</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">{recipe.cook_time}{tr.time_min}</span>
            <span className="stat-label">{tr.cook}</span>
          </div>
          <div className="recipe-stat">
            <span className="stat-value">{recipe.total_time}{tr.time_min}</span>
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
          {SHOW_PRICES && recipe.price_total != null && (
            <div className="recipe-stat">
              <span className="stat-value stat-value--terra">${recipe.price_total.toFixed(2)}</span>
              <span className="stat-label">{tr.price_est_cost}</span>
            </div>
          )}
        </div>

        <div className="recipe-layout">
          <div className="ingredient-box">
            <h3>{tr.ingredients}</h3>
            {ingredients.map((group, i) => (
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
            {steps.map((step, i) => (
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

        {SHOW_PRICES && priceData && (
          <div className="grocery-estimate">
            <h3 className="grocery-estimate-title">{tr.price_grocery_estimate}</h3>
            {allIngredientItems.map((item, i) => {
              const match = priceMap.get(item.name);
              return (
                <div key={i} className="grocery-item">
                  <span className="grocery-item-name">{item.name}</span>
                  {match ? (
                    <div className="grocery-item-right">
                      <span className="grocery-product-info">
                        {match.woolworths_product_name}{match.woolworths_weight ? ` ${match.woolworths_weight}` : ''}
                      </span>
                      <span className="grocery-price">${match.woolworths_price.toFixed(2)}</span>
                      <a
                        className="grocery-shop-link"
                        href={match.woolworths_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tr.price_shop}
                      </a>
                    </div>
                  ) : (
                    <span className="grocery-pantry-label">{tr.price_pantry}</span>
                  )}
                </div>
              );
            })}
            <div className="grocery-total-row">
              <span>{tr.price_total_est}</span>
              <span className="grocery-total-price">
                ${priceData.price_total != null ? priceData.price_total.toFixed(2) : '—'} AUD
              </span>
            </div>
            {formattedDate && (
              <div className="grocery-last-checked">
                {tr.price_last_checked}: {formattedDate}
              </div>
            )}
          </div>
        )}

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
