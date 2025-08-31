import React, { useState, useEffect, useRef, useCallback } from 'react';

const RandomWord = ({ words, isRunning, setIsRunning, timer, customization }) => {
  const [randomWord, setRandomWord] = useState('');
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef(null);
  const progressBarRef = useRef(null);

  const start = () => {
    if (words.length < 2) {
      alert('Please add at least two words to the list.');
      return;
    }
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const pickAndDisplayWord = useCallback(() => {
    setRandomWord(prevRandomWord => {
      if (words.length === 0) {
        setIsRunning(false);
        return '';
      }
      const availableWords = words.filter(w => w !== prevRandomWord);
      const wordPool = availableWords.length > 0 ? availableWords : words;
      const randomIndex = Math.floor(Math.random() * wordPool.length);
      return wordPool[randomIndex];
    });
  }, [words, setIsRunning]);

  useEffect(() => {
    if (isRunning) {
      pickAndDisplayWord();
    } else {
      clearInterval(countdownIntervalRef.current);
      setRandomWord('');
      setCountdown(0);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = '0%';
        progressBarRef.current.style.transition = 'none';
      }
    }
  }, [isRunning, pickAndDisplayWord]);

  useEffect(() => {
    clearInterval(countdownIntervalRef.current);

    if (isRunning && randomWord) {
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

      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(countdownIntervalRef.current);
            pickAndDisplayWord();
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdownIntervalRef.current);
    };
  }, [isRunning, randomWord, timer, customization.progressDirection, pickAndDisplayWord]);

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
          {randomWord}
        </span>
        {isRunning && randomWord && <span id="countdown">{countdown}s</span>}
      </div>
      <button onClick={isRunning ? stop : start} className={isRunning ? 'stop' : 'go'}>
        {isRunning ? 'STOP' : 'GO'}
      </button>
    </div>
  );
};

export default RandomWord;
