function Hero({ totalRecipes }) {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <span className="hero-eyebrow">A personal collection</span>
        <h1 className="hero-title">
          Recipes from<br /><em>my kitchen</em>
        </h1>
        <p className="hero-sub">
          Family recipes, favourites found along the way, and everything
          in between — collected in one place.
        </p>
        <a href="#recipes" className="hero-cta">
          Browse recipes
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
          <span className="hero-stat-label">Recipes</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">4</span>
          <span className="hero-stat-label">Cuisines</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">★★★★★</span>
          <span className="hero-stat-label">All rated</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;