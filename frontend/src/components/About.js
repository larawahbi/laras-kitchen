import t from '../translations';
import logo from '../assets/logo_detailed.png';

function About({ lang }) {
  const tr = t[lang];
  return (
    <div className="about-page page-fade-in">
      {/* Logo — replace logo.svg with final file */}
      <div className="about-page-logo-wrap">
        <img src={logo} alt="Lara's Kitchen" className="about-page-logo" />
      </div>

      <div className="about-page-content">
        <div className="about-script">{tr.about_script}</div>
        <h1 className="about-page-title">{tr.about_title}</h1>
        <p className="about-page-body">{tr.about_text}</p>

        {/* PLACEHOLDER section — replace with final copy */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">{tr.about_how_title}</h2>
          <p className="about-page-body">{tr.about_how_text}</p>
        </div>

        {/* PLACEHOLDER section — replace with final copy */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">{tr.about_bilingual_title}</h2>
          <p className="about-page-body">{tr.about_bilingual_text}</p>
        </div>

        {/* PLACEHOLDER section — replace with final copy */}
        <div className="about-page-section">
          <h2 className="about-page-section-title">{tr.about_contact_title}</h2>
          <p className="about-page-body">{tr.about_contact_text}</p>
        </div>
      </div>
    </div>
  );
}

export default About;
