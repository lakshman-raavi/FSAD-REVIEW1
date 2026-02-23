import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <button
            className={`scroll-top ${visible ? 'visible' : ''}`}
            onClick={scrollUp}
            aria-label="Scroll to top"
        >
            <ChevronUp size={20} />
        </button>
    );
};

export default ScrollToTop;
