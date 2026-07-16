import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useParams, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Filters from './components/Filters';
import RecipeRow from './components/RecipeRow';
import RecipeDetail from './components/RecipeDetail';
import CookMode from './components/CookMode';
import Loading from './components/Loading';
import About from './components/About';
import Contact from './components/Contact';
import t from './translations';
import { useInView } from './hooks/useInView';
import './styles/main.css';
import API_URL from './config';

function HomePage({ recipes, lang }) {
  const [mealFilter, setMealFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const tr = t[lang];
  const [teaserRef, teaserInView] = useInView({ threshold: 0.2 });

  const filtered = recipes.filter(r => {
    const mealOk = mealFilter === 'all' || r.meal_type === mealFilter;
    const cuisineOk = cuisineFilter === 'all' || r.cuisine === cuisineFilter;
    return mealOk && cuisineOk;
  });

  return (
    <div className="page-fade-in">
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
        <div className="recipe-list">
          {filtered.map((recipe) => (
            <RecipeRow
              key={recipe.id}
              recipe={recipe}
              lang={lang}
            />
          ))}
        </div>
      </section>
      <section ref={teaserRef} className={`about-section about-reveal${teaserInView ? ' is-visible' : ''}`}>
        <div className="about-inner">
          <div className="about-script">{tr.about_script}</div>
          <h2 className="about-title">{tr.about_title}</h2>
          <p className="about-text">{tr.about_teaser_text}</p>
          <Link to="/about" className="about-teaser-link">{tr.about_teaser_link}</Link>
        </div>
      </section>
    </div>
  );
}


function RecipeDetailPage({ recipes, lang }) {
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === Number(id));
  if (!recipe) return <Navigate to="/" replace />;
  return <RecipeDetail recipe={recipe} lang={lang} />;
}

function CookModePage({ recipes, lang }) {
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === Number(id));
  if (!recipe) return <Navigate to="/" replace />;
  return <CookMode recipe={recipe} lang={lang} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <Loading lang={lang} />;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout lang={lang} setLang={setLang} />}>
          <Route path="/" element={<HomePage recipes={recipes} lang={lang} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/contact" element={<Contact lang={lang} />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage recipes={recipes} lang={lang} />} />
        </Route>
        <Route path="/recipe/:id/cook" element={<CookModePage recipes={recipes} lang={lang} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
