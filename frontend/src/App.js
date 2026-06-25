import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Filters from './components/Filters';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import CookMode from './components/CookMode';
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

  if (loading) return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      Loading...
    </div>
  );

  return (
    <div>
      <nav className="nav">
        <div className="nav-logo">
          Lara's Kitchen
          <span>مطبخ لارا</span>
        </div>
        <ul className="nav-links">
          <li><a href="#recipes">Recipes</a></li>
          <li><a href="#about">About</a></li>
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

      <Hero totalRecipes={recipes.length} />

      <section id="recipes" className="main">
        <Filters
          recipes={recipes}
          mealFilter={mealFilter}
          cuisineFilter={cuisineFilter}
          onMealFilter={setMealFilter}
          onCuisineFilter={setCuisineFilter}
        />
        <div className="recipe-grid">
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={setSelected}
            />
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-inner">
          <div className="about-script">with love,</div>
          <h2 className="about-title">About This Kitchen</h2>
          <p className="about-text">
            This is my personal recipe collection — dishes from family,
            travels, and everything I've picked up along the way.
          </p>
        </div>
      </section>

      <footer className="footer">
        <span className="footer-logo">Lara's Kitchen</span>
        <span>Made with 🌿 in Adelaide</span>
      </footer>

      <RecipeDetail
        recipe={selected}
        onClose={() => setSelected(null)}
        onStartCooking={(recipe) => {
          setCooking(recipe);
          setSelected(null);
        }}
      />

      <CookMode
        recipe={cooking}
        onClose={() => setCooking(null)}
      />
    </div>
  );
}

export default App;