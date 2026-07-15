import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Filters from './components/Filters';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import CookMode from './components/CookMode';
import Loading from './components/Loading';
import t from './translations';
import './styles/main.css';
import API_URL from './config';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [cooking, setCooking] = useState(null);
  const [mealFilter, setMealFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    fetch(`${API_URL}/api/recipes`)
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.classList.toggle('ar', lang === 'ar');
  }, [lang]);

  const filtered = recipes.filter(r => {
    const mealOk = mealFilter === 'all' || r.meal_type === mealFilter;
    const cuisineOk = cuisineFilter === 'all' || r.cuisine === cuisineFilter;
    return mealOk && cuisineOk;
  });

  if (loading) return <Loading lang={lang} />;

  const tr = t[lang];

  return (
    <div>
      <nav className="nav">
        <div className="nav-logo">
          Lara's Kitchen
          <span>مطبخ لارا</span>
        </div>
        <ul className="nav-links">
          <li><a href="#recipes">{tr.nav_recipes}</a></li>
          <li><a href="#about">{tr.nav_about}</a></li>
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

      <Hero totalRecipes={recipes.length} lang={lang} />

      <section id="recipes" className="main">
        <Filters
          recipes={recipes}
          mealFilter={mealFilter}
          cuisineFilter={cuisineFilter}
          onMealFilter={setMealFilter}
          onCuisineFilter={setCuisineFilter}
          lang={lang}
        />
        <div className="recipe-grid">
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              lang={lang}
              onClick={setSelected}
            />
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-inner">
          <div className="about-script">{tr.about_script}</div>
          <h2 className="about-title">{tr.about_title}</h2>
          <p className="about-text">{tr.about_text}</p>
        </div>
      </section>

      <footer className="footer">
        <span className="footer-logo">Lara's Kitchen</span>
        <span>{tr.footer_made}</span>
      </footer>

      <RecipeDetail
        recipe={selected}
        lang={lang}
        onClose={() => setSelected(null)}
        onStartCooking={(recipe) => {
          setCooking(recipe);
          setSelected(null);
        }}
      />

      <CookMode
        recipe={cooking}
        lang={lang}
        onClose={() => setCooking(null)}
      />
    </div>
  );
}

export default App;
