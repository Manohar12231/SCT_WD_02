import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiDelete, FiTrash2 } from 'react-icons/fi';
import { create, all } from 'mathjs';

const math = create(all);

const evaluateExpression = (expression) => {
  try {
    const evalFriendlyExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    const result = math.evaluate(evalFriendlyExpression);
    return parseFloat(result.toFixed(10));
  } catch (error) {
    return 'Error';
  }
};

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const calculatorRef = useRef(null);

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInput = useCallback((value) => {
    if (window.navigator.vibrate) window.navigator.vibrate(20);

    if (result && !['+', '−', '×', '÷', '%'].includes(value)) {
      setInput(value);
      setResult('');
      return;
    }

    if (result && ['+', '−', '×', '÷', '%'].includes(value)) {
      setInput(result + value);
      setResult('');
      return;
    }

    const lastChar = input.slice(-1);
    if (['+', '−', '×', '÷', '.'].includes(lastChar) && ['+', '−', '×', '÷', '.'].includes(value)) return;

    setInput(prev => prev + value);
  }, [input, result]);

  const calculateResult = useCallback(() => {
    if (!input || input === result) return;
    if (window.navigator.vibrate) window.navigator.vibrate(50);

    const calculationResult = evaluateExpression(input);
    if (calculationResult !== 'Error') {
      setResult(String(calculationResult));
      setHistory(prev => [`${input} = ${calculationResult}`, ...prev].slice(0, 20));
      setInput(String(calculationResult));
    } else {
      setResult('Error');
    }
  }, [input, result]);

  const clear = useCallback(() => {
    if (window.navigator.vibrate) window.navigator.vibrate(20);
    setInput('');
    setResult('');
  }, []);

  const backspace = useCallback(() => {
    if (window.navigator.vibrate) window.navigator.vibrate(20);
    if (result) {
      clear();
    } else {
      setInput(prev => prev.slice(0, -1));
    }
  }, [result, clear]);

  const clearHistory = useCallback(() => {
    if (window.navigator.vibrate) window.navigator.vibrate([30, 20, 30]);
    setHistory([]);
  }, []);

  const handleKeyDown = useCallback((event) => {
    const keyMap = {
      '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%', '.': '.',
      'Enter': '=', '=': '=',
      'Backspace': 'Backspace',
      'Escape': 'AC'
    };

    if (/[0-9]/.test(event.key)) {
      handleInput(event.key);
    } else {
      const action = keyMap[event.key];
      if (action) {
        event.preventDefault();
        if (action === '=') calculateResult();
        else if (action === 'Backspace') backspace();
        else if (action === 'AC') clear();
        else handleInput(action);
      }
    }
  }, [handleInput, calculateResult, backspace, clear]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const displayFontSize = (text) => {
    const len = String(text).length;
    return len > 9 ? 'text-4xl' : 'text-5xl';
  };

  const getButtonStyle = (style) => ({
    operator: 'bg-light-secondary/90 dark:bg-dark-secondary/90 text-white btn-glow-secondary',
    accent: 'bg-light-accent/90 dark:bg-dark-accent/90 text-white',
    equals: 'bg-light-primary dark:bg-dark-primary text-white btn-glow-primary',
    number: 'bg-light-btn dark:bg-dark-btn text-light-btn-text dark:text-dark-text ring-1 ring-black/5'
  }[style]);

  const buttons = [
    { label: 'AC', action: clear, style: 'accent' },
    { label: <FiDelete />, action: backspace, style: 'accent' },
    { label: '%', action: () => handleInput('%'), style: 'accent' },
    { label: '÷', action: () => handleInput('÷'), style: 'operator' },
    { label: '7', style: 'number' }, { label: '8', style: 'number' }, { label: '9', style: 'number' },
    { label: '×', action: () => handleInput('×'), style: 'operator' },
    { label: '4', style: 'number' }, { label: '5', style: 'number' }, { label: '6', style: 'number' },
    { label: '−', action: () => handleInput('−'), style: 'operator' },
    { label: '1', style: 'number' }, { label: '2', style: 'number' }, { label: '3', style: 'number' },
    { label: '+', action: () => handleInput('+'), style: 'operator' },
    { label: '0', style: 'number', colSpan: 'col-span-2' },
    { label: '.', style: 'number' },
    { label: '=', action: calculateResult, style: 'equals' },
  ];

  return (
    <div ref={calculatorRef} className="relative w-full max-w-sm mx-auto">
      <motion.div className="p-4 rounded-3xl shadow-light-neumorphic dark:shadow-dark-neumorphic bg-light-card dark:bg-dark-card" layout>
        <div className="mb-4 h-36 px-4 py-2 rounded-2xl shadow-light-inset dark:shadow-dark-inset bg-light-card dark:bg-dark-bg flex flex-col items-end justify-between text-right break-all transition-colors duration-500 font-digital tracking-wider">
          <div className="w-full flex justify-between items-center text-light-text/50 dark:text-dark-text/50 font-sans text-xs">
            <span>{currentTime.toLocaleDateString()}</span>
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>

          <div className="flex-grow w-full flex flex-col items-end justify-end">
            <div className="w-full text-light-text/70 dark:text-dark-text/70 text-2xl h-1/3 overflow-hidden">
              {input || ' '}
            </div>
            <div className={`w-full h-2/3 font-bold text-light-display-text dark:text-dark-display-text transition-all duration-300 flex items-end justify-end ${displayFontSize(result || '0')}`}>
              <span>{result || '0'}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <motion.button
              key={typeof btn.label === 'string' ? btn.label : 'delete-icon'}
              onClick={btn.action || (() => handleInput(btn.label))}
              className={`relative flex items-center justify-center rounded-2xl h-16 text-2xl font-sans font-medium focus:outline-none transition-all duration-200 ${getButtonStyle(btn.style)} ${btn.colSpan || ''}`}
              whileHover={{ scale: 1.05, filter: 'brightness(1.05)' }}
              whileTap={{ scale: 0.95, filter: 'brightness(0.95)' }}
              layout
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="absolute -top-4 -right-4 z-10">
        <motion.button onClick={() => setIsHistoryOpen(p => !p)} className="p-3 rounded-full bg-light-card dark:bg-dark-card shadow-md text-light-primary dark:text-dark-primary" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FiClock size="1.5em" />
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-0 bottom-0 -right-4 w-64 p-4 bg-light-card/80 dark:bg-dark-card/80 glass-effect rounded-r-3xl history-panel overflow-y-auto flex flex-col"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text">History</h3>
              <motion.button 
                onClick={clearHistory} 
                className="p-2 rounded-full hover:bg-red-400/20 text-red-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Clear history"
              >
                <FiTrash2 size="1.2em" />
              </motion.button>
            </div>

            <AnimatePresence>
              {history.length > 0 ? (
                <ul className="flex-grow">
                  {history.map((item, index) => (
                    <motion.li
                      key={index}
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                      onClick={() => {
                        setInput(item.split(' = ')[0]);
                        setResult('');
                        setIsHistoryOpen(false);
                      }} 
                      className="p-2 mb-2 rounded-lg cursor-pointer hover:bg-light-primary/20 dark:hover:bg-dark-primary/20 text-sm text-light-text/80 dark:text-dark-text/80"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-grow flex items-center justify-center"
                >
                  <p className="text-sm text-light-text/60">No history yet.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calculator;