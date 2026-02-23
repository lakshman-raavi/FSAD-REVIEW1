import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="btn btn-ghost btn-icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light'
                ? <Moon size={18} color="var(--text-secondary)" />
                : <Sun size={18} color="var(--accent)" />
            }
        </button>
    );
};

export default ThemeToggle;
