import { Outlet, Link } from 'react-router-dom';
import t from '../translations';
import { useInView } from '../hooks/useInView';
import SocialIcons from './SocialIcons';

function Layout({ lang, setLang }) {
  const tr = t[lang];
  const [sageBandRef, sageBandInView] = useInView({ threshold: 0.15 });

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
          <li><Link to="/contact">{tr.nav_contact}</Link></li>
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
      <footer className="site-footer">
        <div
          ref={sageBandRef}
          className={`footer-sage-band${sageBandInView ? ' footer-sage-band--visible' : ''}`}
        >
          <div className="footer-sage-inner">
            <h2 className="footer-sage-heading">{tr.footer_cta_heading}</h2>
            <p className="footer-sage-body">{tr.footer_cta_body}</p>
            <Link to="/contact" className="footer-sage-btn">{tr.footer_cta_btn}</Link>
          </div>
        </div>

        <div className="footer-light-bar">
          <div className="footer-wordmark">
            <span className="footer-wordmark-en">Lara's Kitchen</span>
            <span className="footer-wordmark-ar">مطبخ لارا</span>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <Link to="/" className="footer-nav-link">{tr.nav_recipes}</Link>
            <Link to="/about" className="footer-nav-link">{tr.nav_about}</Link>
            <Link to="/contact" className="footer-nav-link">{tr.nav_contact}</Link>
          </nav>
          <div className="footer-social">
            <SocialIcons />
          </div>
        </div>

        <div className="footer-strip">
          <span>{tr.footer_copyright}</span>
          <span>{tr.footer_made}</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
