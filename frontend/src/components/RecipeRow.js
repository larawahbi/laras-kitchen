import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import t from '../translations';
import { SHOW_PRICES } from '../config';

function RecipeRow({ recipe, lang }) {
  const tr = t[lang];
  const [imgLoaded, setImgLoaded] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const primaryName = lang === 'ar' && recipe.name_ar ? recipe.name_ar : recipe.name;
  const secondaryName = lang === 'ar' ? recipe.name : (recipe.name_ar || null);
  const desc = (lang === 'ar' && recipe.desc_ar) ? recipe.desc_ar : recipe.desc;
  const displayMealType = lang === 'ar'
    ? (tr.meal_type_labels?.[recipe.meal_type] || recipe.meal_type)
    : recipe.meal_type;

  return (
    <article ref={ref} className={`recipe-row${inView ? ' row-visible' : ''}`}>
      <Link to={`/recipe/${recipe.id}`} className="recipe-row-inner">
        <div className="recipe-row-photo-wrap arch-top">
          <img
            src={recipe.cover_img}
            alt={recipe.name}
            loading="lazy"
            className={imgLoaded ? 'img-loaded' : ''}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
        <div className="recipe-row-text">
          <div className="recipe-row-meal-type">{displayMealType}</div>
          <h3 className="recipe-row-title">{primaryName}</h3>
          {secondaryName && (
            <div className={lang === 'ar' ? 'recipe-row-name-en' : 'recipe-row-name-ar'}>
              {secondaryName}
            </div>
          )}
          {desc && <p className="recipe-row-desc">{desc}</p>}
          <div className="recipe-row-meta">
            <span className="recipe-row-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9"/>
                <polyline points="12 7 12 12 15 15"/>
              </svg>
              {recipe.total_time}{tr.time_min}
            </span>
            <span className="recipe-row-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {recipe.serves}
            </span>
            {SHOW_PRICES && recipe.price_total != null && (
              <span className="recipe-row-meta-item recipe-row-cost">
                ${recipe.price_total.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default RecipeRow;
