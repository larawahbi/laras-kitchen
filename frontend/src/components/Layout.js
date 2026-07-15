import { Outlet, Link } from 'react-router-dom';
import t from '../translations';

function Layout({ lang, setLang, recipes }) {
  const tr = t[lang];
  const footerRecipes = [...recipes].sort((a, b) => a.id - b.id).slice(-6);

  return (
    <div>
      <nav className="nav">
        <Link to="/" className="nav-logo">
          Lara's Kitchen
          <span>مطبخ لارا</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">{tr.nav_recipes}</Link></li>
          <li><Link to="/about">{tr.nav_about}</Link></li>
        </ul>
        <div className="nav-right">
          <div className="lang-toggle">
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              className={`lang-btn ${lang === 'ar' ? 'active' : ''}`}
              onClick={() => setLang('ar')}
            >
              ع
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
      <footer className="footer">
        <div className="footer-photo-strip">
          {footerRecipes.map(recipe => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="footer-photo-tile"
              aria-label={recipe.name}
            >
              <img src={recipe.cover_img} alt="" loading="lazy" />
            </Link>
          ))}
        </div>
        <div className="footer-bar">
          <div className="footer-wordmark">
            <span className="footer-wordmark-en">Lara's Kitchen</span>
            <span className="footer-wordmark-ar">مطبخ لارا</span>
          </div>
          <span className="footer-tagline">{tr.footer_made}</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
