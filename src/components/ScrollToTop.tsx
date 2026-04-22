import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      try {
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
      } catch (e) {
        // Ignore
      }
    };

    scrollToTop();
    const timeout1 = setTimeout(scrollToTop, 10);
    const timeout2 = setTimeout(scrollToTop, 50);
    const timeout3 = setTimeout(scrollToTop, 100);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [pathname]);

  return null;
}
