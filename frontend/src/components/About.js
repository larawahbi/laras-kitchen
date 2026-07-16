import { useInView } from '../hooks/useInView';
import { Link } from 'react-router-dom';
import t from '../translations';
import logo from '../assets/logo_detailed.png';

function About({ lang }) {
  const tr = t[lang];

  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [pillarsRef, pillarsInView] = useInView({ threshold: 0.15 });
  const [bilingualRef, bilingualInView] = useInView({ threshold: 0.15 });

  return (
    <div className="about-page">

      {/* 1 — Hero */}
      <section
        ref={heroRef}
        className={`about-hero about-reveal${heroInView ? ' is-visible' : ''}`}
      >
        <div className="about-hero-inner">
          <div className="about-hero-text">
            <h1 className="about-hero-title">{tr.about_title}</h1>
            {tr.about_text.split('\n').filter(p => p.trim()).map((para, i) => (
              <p key={i} className="about-hero-body">{para.trim()}</p>
            ))}
            <div className="about-cta-links">
              <Link to="/" className="about-cta-link about-cta-link--sage">
                {tr.about_cta_recipes}
              </Link>
              <Link to="/contact" className="about-cta-link about-cta-link--terra">
                {tr.about_cta_contact}
              </Link>
            </div>
          </div>
          <div className="about-hero-image">
            <img src={logo} alt="Lara's Kitchen" />
          </div>
        </div>
      </section>

      {/* 2 — How I Choose Recipes */}
      <section
        ref={pillarsRef}
        className={`about-pillars about-reveal${pillarsInView ? ' is-visible' : ''}`}
      >
        <div className="about-section-inner">
          <h2 className="about-section-heading">{tr.about_how_title}</h2>
          <p className="about-pillars-lead">{tr.about_how_lead}</p>
          <div className="about-arches">

            <div className="about-arch about-arch--1">
              <div className="about-arch-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21Q9 32 20 32Q31 32 31 21H9Z"/>
                  <path d="M9 21H31"/>
                  <path d="M9 21Q9 18 7 17Q5 17 5 20Q5 23 7 23"/>
                  <path d="M31 21Q31 18 33 17Q35 17 35 20Q35 23 33 23"/>
                  <path d="M16 19Q14 14 16 10"/>
                  <path d="M20 19Q18 14 20 9"/>
                  <path d="M24 19Q22 14 24 10"/>
                </svg>
              </div>
              <h3 className="about-arch-title">{tr.about_how_card1_title}</h3>
              <p className="about-arch-body">{tr.about_how_card1_body}</p>
            </div>

            <div className="about-arch about-arch--2">
              <div className="about-arch-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 36V22"/>
                  <path d="M13 7V16Q13 22 20 22"/>
                  <path d="M17 7V22"/>
                  <path d="M23 7V22"/>
                  <path d="M27 7V16Q27 22 20 22"/>
                </svg>
              </div>
              <h3 className="about-arch-title">{tr.about_how_card2_title}</h3>
              <p className="about-arch-body">{tr.about_how_card2_body}</p>
            </div>

            <div className="about-arch about-arch--3">
              <div className="about-arch-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 36V10"/>
                  <path d="M20 28Q14 24 11 19Q16 18 20 24"/>
                  <path d="M20 21Q26 17 29 12Q24 11 20 17"/>
                  <path d="M20 14Q16 11 14 6Q18 5 20 11"/>
                </svg>
              </div>
              <h3 className="about-arch-title">{tr.about_how_card3_title}</h3>
              <p className="about-arch-body">{tr.about_how_card3_body}</p>
            </div>

          </div>
          <p className="about-pillars-close">{tr.about_how_close}</p>
        </div>
      </section>

      {/* 3 — Why Arabic and English */}
      <section
        ref={bilingualRef}
        className={`about-bilingual about-reveal${bilingualInView ? ' is-visible' : ''}`}
      >
        <div className="about-section-inner">
          <h2 className="about-section-heading">{tr.about_bilingual_title}</h2>
          <p className="about-bilingual-lead">{tr.about_bilingual_lead}</p>
          <div className="about-bilingual-phrases" aria-hidden="true">
            <span className="about-bilingual-phrase-en" dir="ltr">{tr.about_bilingual_phrase_en}</span>
            <span className="about-bilingual-phrase-rule"></span>
            <span className="about-bilingual-phrase-ar">{tr.about_bilingual_phrase_ar}</span>
          </div>
          <div className="about-bilingual-cols">
            <div className="about-bilingual-col">
              <h3 className="about-bilingual-col-title">{tr.about_bilingual_col1_title}</h3>
              <p className="about-bilingual-col-body">{tr.about_bilingual_col1_body}</p>
            </div>
            <div className="about-bilingual-col">
              <h3 className="about-bilingual-col-title">{tr.about_bilingual_col2_title}</h3>
              <p className="about-bilingual-col-body">{tr.about_bilingual_col2_body}</p>
            </div>
          </div>
          <p className="about-bilingual-close">{tr.about_bilingual_close}</p>
        </div>
      </section>


    </div>
  );
}

export default About;
