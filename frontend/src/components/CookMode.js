import { useState, useEffect, useRef } from 'react';

function CookMode({ recipe, onClose }) {
  const [phase, setPhase] = useState('ingredients');
  const [stepIndex, setStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  if (!recipe) return null;

  const allIngredients = recipe.ingredients.flatMap(g => g.items);
  const totalSteps = recipe.steps.length;
  const progress = phase === 'ingredients' ? 0
    : phase === 'done' ? 100
    : ((stepIndex + 1) / totalSteps) * 100;

  function toggleIngredient(i) {
    setCheckedIngredients(prev => ({ ...prev, [i]: !prev[i] }));
  }

  function startTimer(mins) {
    clearInterval(timerRef.current);
    setTimerSeconds(mins * 60);
    setTimerRunning(true);
  }

  function stopTimer() {
    clearInterval(timerRef.current);
    setTimerRunning(false);
  }

  function formatTimer(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function nextStep() {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerSeconds(null);
    if (stepIndex + 1 >= totalSteps) {
      setPhase('done');
    } else {
      setStepIndex(i => i + 1);
    }
  }

  function prevStep() {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerSeconds(null);
    if (stepIndex === 0) {
      setPhase('ingredients');
    } else {
      setStepIndex(i => i - 1);
    }
  }

  return (
    <div className="cook-overlay open">
      <div className="cook-top-bar">
        <button className="cook-overlay-back" onClick={onClose}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
        <div className="cook-progress-bar-wrap">
          <div
            className="cook-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="cook-progress-text">
          {phase === 'ingredients' ? 'Ingredients'
            : phase === 'done' ? 'Done!'
            : `${stepIndex + 1} / ${totalSteps}`}
        </span>
      </div>

      <div className="cook-body">

        {/* PHASE 1 — INGREDIENTS */}
        {phase === 'ingredients' && (
          <>
            <div className="cook-phase-title">Gather your ingredients</div>
            <p className="cook-phase-subtitle">
              Check off each ingredient as you gather it.
              When you're ready, move on to the steps.
            </p>
            {allIngredients.map((item, i) => (
              <div
                key={i}
                className={`cook-ingredient ${checkedIngredients[i] ? 'checked' : ''}`}
                onClick={() => toggleIngredient(i)}
              >
                <div className="cook-ingredient-check">
                  {checkedIngredients[i] && (
                    <svg width="11" height="11" viewBox="0 0 24 24"
                      fill="none" stroke="white" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="cook-ingredient-text">
                  <span className="cook-ingredient-amount">{item.amount}</span>
                  {item.amount ? ' ' : ''}{item.name}
                </span>
              </div>
            ))}
            <div className="cook-nav" style={{ justifyContent: 'flex-end' }}>
              <button
                className="cook-nav-btn next"
                onClick={() => setPhase('steps')}
              >
                Start cooking →
              </button>
            </div>
          </>
        )}

        {/* PHASE 2 — STEPS */}
        {phase === 'steps' && (
          <>
            <div className="cook-step-num">
              Step {stepIndex + 1} of {totalSteps}
            </div>
            <div className="cook-step-card">
              <div className="cook-step-title">
                {recipe.steps[stepIndex].title}
              </div>
              <div className="cook-step-text">
                {recipe.steps[stepIndex].text}
              </div>

              {recipe.steps[stepIndex].wait_mins > 0 && (
                <div className="cook-timer">
                  <div>
                    <div className="timer-display">
                      {timerSeconds !== null
                        ? formatTimer(timerSeconds)
                        : `${String(recipe.steps[stepIndex].wait_mins).padStart(2,'0')}:00`}
                    </div>
                    <div className="timer-label">
                      {recipe.steps[stepIndex].wait_mins} min
                    </div>
                  </div>
                  {!timerRunning ? (
                    <button
                      className="timer-btn"
                      onClick={() => startTimer(recipe.steps[stepIndex].wait_mins)}
                    >
                      Start timer
                    </button>
                  ) : (
                    <button className="timer-btn active" onClick={stopTimer}>
                      Stop
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="cook-nav">
              <button className="cook-nav-btn prev" onClick={prevStep}>
                ← Previous
              </button>
              <button
                className={`cook-nav-btn ${stepIndex + 1 >= totalSteps ? 'done' : 'next'}`}
                onClick={nextStep}
              >
                {stepIndex + 1 >= totalSteps ? '✓ All done' : 'Next step →'}
              </button>
            </div>
          </>
        )}

        {/* PHASE 3 — DONE */}
        {phase === 'done' && (
          <div className="cook-done">
            <div className="cook-done-icon">🍽️</div>
            <div className="cook-done-title">Bon appétit!</div>
            <p className="cook-done-sub">
              Your dish is ready. Enjoy every bite.
            </p>
            <button className="cook-done-btn" onClick={onClose}>
              Back to recipes
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CookMode;