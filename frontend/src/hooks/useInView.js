import { useRef, useState, useEffect } from 'react';

export function useInView({ threshold = 0.1, rootMargin = '0px' } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ref = useRef(null);
  const [inView, setInView] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduced]);

  return [ref, inView];
}
