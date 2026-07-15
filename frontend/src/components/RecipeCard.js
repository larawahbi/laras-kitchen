import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import t from '../translations';

function RecipeCard({ recipe, onClick, lang, index = 0 }) {
  const tr = t[lang];
  const name = lang === 'ar' && recipe.name_ar ? recipe.name_ar : recipe.name;
  const displayCuisine = lang === 'ar' ? (tr.cuisine_labels?.[recipe.cuisine] || recipe.cuisine) : recipe.cuisine;
  const displayMealType = lang === 'ar' ? (tr.meal_type_labels?.[recipe.meal_type] || recipe.meal_type) : recipe.meal_type;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <article
      ref={ref}
      className={`recipe-card${inView ? ' card-visible' : ''}`}
      style={{ transitionDelay: inView ? '0ms' : `${index * 60}ms` }}
      onClick={() => onClick(recipe)}
    >
      <div className="card-img-wrap">
        <img
          src={recipe.cover_img}
          alt={recipe.name}
          loading="lazy"
          className={imgLoaded ? 'img-loaded' : ''}
          onLoad={() => setImgLoaded(true)}
        />
        <span className="card-cuisine-badge">{displayCuisine}</span>
        <span className="card-rating">{recipe.rating}</span>
      </div>
      <div className="card-body">
        <div className="card-meal-type">{displayMealType}</div>
        <h3 className="card-title">{name}</h3>
        <div className="card-tags">
          {recipe.tags.map(tag => (
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>
        <div className="card-meta">
          <span className="card-meta-item">⏱ {recipe.total_time}{tr.time_min}</span>
          <span className="card-meta-item">👤 {recipe.serves}</span>
          <span className="card-meta-item">~{recipe.calories} {tr.kcal}</span>
        </div>
        {recipe.price_total != null && (
          <div className="card-price-line">
            {tr.price_est_cost}: ${recipe.price_total.toFixed(2)}
          </div>
        )}
      </div>
    </article>
  );
}

export default RecipeCard;
