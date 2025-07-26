import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const getInitialTheme = () => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) return JSON.parse(savedMode);
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

function App() {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen w-full p-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-5 right-5 z-20">
        <motion.button
          onClick={() => setDarkMode(prev => !prev)}
          className="p-3 rounded-full bg-light-card/50 dark:bg-dark-card/50 glass-effect text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg"
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={darkMode ? 'moon' : 'sun'}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {darkMode ? <FaSun size="1.5em" /> : <FaMoon size="1.5em" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      <motion.div 
        className="text-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <h1 className="text-5xl md:text-6xl font-bold font-sans tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent">
          Calculator
        </h1>
        <p className="text-light-text/60 dark:text-dark-text/60 mt-2">
          Designed with React & Tailwind
        </p>
      </motion.div>
      
      <motion.div 
        className="w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
      >
        <Calculator />
      </motion.div>
    </motion.div>
  );
}

export default App;