import { useInView } from '../hooks/useInView';
import { Link } from 'react-router-dom';
import t from '../translations';
import logo from '../assets/logo_detailed.png';

function About({ lang }) {
  const tr = t[lang];

  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [pillarsRef, pillarsInView] = useInView({ threshold: 0.15 });
  const [bilingualRef, bilingualInView] = useInView({ threshold: 0.15 });
  const [contactRef, contactInView] = useInView({ threshold: 0.15 });

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
          <div className="about-pillars-list">

            <div className="about-pillar-entry">
              <span className="about-pillar-numeral">01</span>
              <h3 className="about-pillar-title">{tr.about_how_card1_title}</h3>
              <p className="about-pillar-body">{tr.about_how_card1_body}</p>
            </div>

            <hr className="about-pillar-rule" />

            <div className="about-pillar-entry">
              <span className="about-pillar-numeral">02</span>
              <h3 className="about-pillar-title">{tr.about_how_card2_title}</h3>
              <p className="about-pillar-body">{tr.about_how_card2_body}</p>
            </div>

            <hr className="about-pillar-rule" />

            <div className="about-pillar-entry">
              <span className="about-pillar-numeral">03</span>
              <h3 className="about-pillar-title">{tr.about_how_card3_title}</h3>
              <p className="about-pillar-body">{tr.about_how_card3_body}</p>
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
            <span className="about-bilingual-phrase-en">{tr.about_bilingual_phrase_en}</span>
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

      {/* 4 — Get in Touch */}
      <section
        ref={contactRef}
        className={`about-contact about-reveal${contactInView ? ' is-visible' : ''}`}
      >
        <div className="about-section-inner about-section-inner--center">
          <h2 className="about-section-heading">{tr.about_contact_title}</h2>
          <p className="about-contact-lead">{tr.about_contact_lead}</p>
          <p className="about-contact-close">{tr.about_contact_close}</p>
        </div>
      </section>

    </div>
  );
}

export default About;
