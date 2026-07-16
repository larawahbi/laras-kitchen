import t from '../translations';

function Hero({ totalRecipes, lang }) {
  const tr = t[lang];

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <span className="hero-eyebrow">{tr.hero_eyebrow}</span>
        <h1 className="hero-title">
          {t.en.hero_title_line1}<br /><em>{t.en.hero_title_em}</em>
        </h1>
        <h1 className="hero-title-ar">
          {t.ar.hero_title_line1} <em>{t.ar.hero_title_em}</em>
        </h1>
        <p className="hero-sub">{tr.hero_sub}</p>
        <a href="#recipes" className="hero-cta">
          {tr.hero_cta}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-num">{totalRecipes}</span>
          <span className="hero-stat-label">{tr.hero_stat_recipes}</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">4</span>
          <span className="hero-stat-label">{tr.hero_stat_cuisines}</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
