import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // 1. Get the saved theme or default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'light';
  });

  // 2. This effect runs when the 'theme' state changes
  useEffect(() => {
    // 2a. Save the new theme to localStorage
    localStorage.setItem('theme', theme);
    
    // 2b. Update the <body> tag class
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]); // Re-run only when 'theme' changes

  // 3. Create a function to toggle the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 4. Return the current theme and the toggle function
  return { theme, toggleTheme };
}