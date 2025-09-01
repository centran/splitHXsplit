import React, { useState, useEffect, useRef, useCallback } from 'react';

const RandomWord = ({ words, isRunning, setIsRunning, timer, customization, showNextWord, excludeConfig, excludeMap, setExcludeMap }) => {
  const [randomWord, setRandomWord] = useState('');
  const [nextRandomWord, setNextRandomWord] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const countdownIntervalRef = useRef(null);
  const progressBarRef = useRef(null);
  const excludeMapRef = useRef(excludeMap || {});
  const excludeConfigRef = useRef(excludeConfig);
  const randomWordRef = useRef('');
  const nextRandomWordRef = useRef('');
  const remainingTimeRef = useRef(0);

  useEffect(() => {
    excludeMapRef.current = excludeMap || {};
  }, [excludeMap]);

  useEffect(() => {
    excludeConfigRef.current = excludeConfig;
  }, [excludeConfig]);

  useEffect(() => {
    randomWordRef.current = randomWord;
  }, [randomWord]);

  useEffect(() => {
    nextRandomWordRef.current = nextRandomWord;
  }, [nextRandomWord]);

  const start = () => {
    if (words.length < 2) {
      alert('Please add at least two words to the list.');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const cleanupTimer = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const stop = () => {
    cleanupTimer();
    setIsRunning(false);
    setIsPaused(false);
    setRandomWord('');
    setNextRandomWord('');
    setCountdown(0);
    remainingTimeRef.current = 0;
    
    // Reset progress bar to 0% regardless of mode
    if (progressBarRef.current) {
      const bar = progressBarRef.current;
      bar.style.transition = 'none';
      bar.style.width = '0%';
    }
  };

  const togglePause = () => {
    setIsPaused(prev => {
      const newPaused = !prev;
      const bar = progressBarRef.current;
      
      if (bar) {
        if (newPaused) {
          // Store the current computed width when pausing
          const computedStyle = window.getComputedStyle(bar);
          const currentWidth = computedStyle.width;
          bar.style.transition = 'none';
          bar.style.width = currentWidth;
          // Store current countdown
          remainingTimeRef.current = countdown;
          cleanupTimer();
        } else if (isRunning) { // Only resume if still running
          // Resume the animation from current position
          const remainingTime = remainingTimeRef.current;
          
          bar.style.transition = `width ${remainingTime}s linear`;
          bar.style.width = customization.progressDirection === 'drain' ? '0%' : '100%';
          
          // Restart countdown from stored time
          setCountdown(Math.ceil(remainingTime));
          cleanupTimer(); // Ensure no existing interval
          countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                if (isRunning) { // Only proceed if still running
                  pickAndDisplayWord();
                  const durationInSeconds = timer * 60;
                  return durationInSeconds;
                }
                return prev;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
      return newPaused;
    });
  };

  const skip = () => {
    if (!isRunning) return; // Don't skip if not running
    
    cleanupTimer();
    pickAndDisplayWord();
    const durationInSeconds = timer * 60;
    setCountdown(Math.ceil(durationInSeconds));
    
    if (progressBarRef.current) {
      const bar = progressBarRef.current;
      bar.style.transition = 'none';
      bar.style.width = customization.progressDirection === 'drain' ? '100%' : '0%';
      void bar.offsetWidth;
      bar.style.transition = `width ${durationInSeconds}s linear`;
      bar.style.width = customization.progressDirection === 'drain' ? '0%' : '100%';
    }

    // Restart the countdown timer
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (isRunning) {
            pickAndDisplayWord();
            return durationInSeconds;
          }
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const selectWord = useCallback((wordsToExclude = []) => {
    const eConfig = excludeConfigRef.current;
    const currentExcludeMap = excludeMapRef.current;
    
    const excludedByConfig = eConfig?.enabled ? new Set(Object.keys(currentExcludeMap || {})) : new Set();
    const wordsToAvoid = new Set(wordsToExclude);

    const availableWords = words.filter(w => !excludedByConfig.has(w) && !wordsToAvoid.has(w));

    let wordPool = availableWords;

    if (wordPool.length === 0 && eConfig?.enabled) {
      const cyclesMap = new Map();
      words.forEach(w => {
        if (!wordsToAvoid.has(w)) {
          cyclesMap.set(w, currentExcludeMap[w] || 0);
        }
      });
      
      if (cyclesMap.size > 0) {
        const minCycles = Math.min(...cyclesMap.values());
        wordPool = [...cyclesMap.entries()]
          .filter(([_, cycles]) => cycles === minCycles)
          .map(([word]) => word);
      }
    }

    if (wordPool.length === 0) {
      wordPool = words.filter(w => !wordsToAvoid.has(w));
    }

    if (wordPool.length === 0 && words.length > 0) {
      wordPool = words;
    }

    if (wordPool.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * wordPool.length);
    return wordPool[randomIndex];
  }, [words]);

  const pickAndDisplayWord = useCallback(() => {
    if (showNextWord) {
      const currentNextWord = nextRandomWordRef.current;
      setRandomWord(currentNextWord);
      const newNextWord = selectWord([currentNextWord]);
      setNextRandomWord(newNextWord);
    } else {
      const newWord = selectWord([randomWordRef.current]);
      setRandomWord(newWord);
    }
  }, [selectWord, showNextWord]);

  // After randomWord updates, adjust excludeMap: decrement existing cycles and add the selected word
  useEffect(() => {
    const eConfig = excludeConfigRef.current || {};
    if (!eConfig.enabled || !isRunning || typeof setExcludeMap !== 'function' || !randomWord) return;

    // Decrement existing excluded words and add the new one
    setExcludeMap(prev => {
      const next = {};
      Object.keys(prev).forEach(w => {
        const remaining = prev[w] - 1;
        if (remaining > 0) next[w] = remaining;
      });
      next[randomWord] = eConfig.excludeCycles;
      return next;
    });
  }, [randomWord, setExcludeMap, isRunning]);

  // Handle the timer cycle
  useEffect(() => {
    const startNewCycle = () => {
      const durationInSeconds = timer * 60;
      setCountdown(Math.ceil(durationInSeconds));

      if (progressBarRef.current) {
        const bar = progressBarRef.current;
        bar.style.transition = 'none';
        bar.style.width = customization.progressDirection === 'drain' ? '100%' : '0%';
        void bar.offsetWidth;
        bar.style.transition = `width ${durationInSeconds}s linear`;
        bar.style.width = customization.progressDirection === 'drain' ? '0%' : '100%';
      }
    };

    const cleanup = () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };

    if (!isRunning) {
      cleanup();
      setRandomWord('');
      setNextRandomWord('');
      setCountdown(0);
      return;
    }

    if (isRunning && !isPaused) {
      // Initial setup
      if (countdown === 0) {
        if (showNextWord) {
          if (words.length < 2) {
            alert('Please add at least two words to use the "Show next word" feature.');
            setIsRunning(false);
            return;
          }
          const initialWord = selectWord();
          const initialNextWord = selectWord([initialWord]);
          setRandomWord(initialWord);
          setNextRandomWord(initialNextWord);
        } else {
          const initialWord = selectWord();
          setRandomWord(initialWord);
        }
        startNewCycle();
      }

      cleanup(); // Ensure no existing interval
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (!isRunning || isPaused) {
            return prev;
          }
          if (prev <= 1) {
            pickAndDisplayWord();
            startNewCycle();
            return timer * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return cleanup;
  }, [isRunning, isPaused, timer, customization.progressDirection, pickAndDisplayWord, showNextWord, words, selectWord, setIsRunning]);

  return (
    <div className="random-word-area">
      <div
        id="random-word-box"
        style={{
          backgroundColor: customization.wordBoxBgColor,
          borderColor: customization.wordBoxBorderColor,
        }}
      >
        <div
          id="progress-bar"
          ref={progressBarRef}
          style={{ backgroundColor: customization.progressColor }}
        ></div>
        <span
          id="random-word"
          style={{
            color: customization.wordTextColor,
            fontSize: `${customization.textSize}rem`,
          }}
        >
          {customization.textCase === 'uppercase' ? randomWord?.toUpperCase() :
           customization.textCase === 'lowercase' ? randomWord?.toLowerCase() :
           randomWord}
        </span>
        {showNextWord && nextRandomWord && (
          <div id="next-random-word">
            next: {customization.textCase === 'uppercase' ? nextRandomWord?.toUpperCase() :
                   customization.textCase === 'lowercase' ? nextRandomWord?.toLowerCase() :
                   nextRandomWord}
          </div>
        )}
        {isRunning && randomWord && <span id="countdown">{countdown}s</span>}
      </div>
      <div className="button-group">
        <button onClick={isRunning ? stop : start} className={isRunning ? 'stop' : 'go'}>
          {isRunning ? 'STOP' : 'GO'}
        </button>
        {isRunning && (
          <>
            <button onClick={togglePause} className="pause-play">
              {isPaused ? 'PLAY' : 'PAUSE'}
            </button>
            <button onClick={skip} className="skip">
              SKIP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RandomWord;
