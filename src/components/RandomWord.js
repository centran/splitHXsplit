import React, { useState, useEffect, useRef } from 'react';

const RandomWord = ({ words, isRunning, setIsRunning, timer, customization }) => {
  const [randomWord, setRandomWord] = useState('');
  const [countdown, setCountdown] = useState(0);
  const timerIntervalRef = useRef(null);
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

  const pickAndDisplayWord = () => {
    const availableWords = words.filter(w => w !== randomWord);
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const newWord = availableWords[randomIndex];
    setRandomWord(newWord);
  };

  useEffect(() => {
    if (isRunning) {
      pickAndDisplayWord();
      timerIntervalRef.current = setInterval(pickAndDisplayWord, timer * 60 * 1000);
    } else {
      clearInterval(timerIntervalRef.current);
      clearInterval(countdownIntervalRef.current);
      setRandomWord('');
      setCountdown(0);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = '0%';
        progressBarRef.current.style.transition = 'none';
      }
    }
    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (randomWord) {
      const durationInSeconds = timer * 60;
      let remainingTime = Math.ceil(durationInSeconds);
      setCountdown(remainingTime);

      if (progressBarRef.current) {
        progressBarRef.current.style.transition = 'none';
        if (customization.progressDirection === 'drain') {
          progressBarRef.current.style.width = '100%';
          void progressBarRef.current.offsetWidth; // Reflow
          progressBarRef.current.style.transition = `width ${durationInSeconds}s linear`;
          progressBarRef.current.style.width = '0%';
        } else {
          progressBarRef.current.style.width = '0%';
          void progressBarRef.current.offsetWidth; // Reflow
          progressBarRef.current.style.transition = `width ${durationInSeconds}s linear`;
          progressBarRef.current.style.width = '100%';
        }
      }

      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
        });
      }, 1000);
    }
  }, [randomWord, timer, customization.progressDirection]);

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
        {isRunning && <span id="countdown">{countdown}s</span>}
      </div>
      <button onClick={isRunning ? stop : start} className={isRunning ? 'stop' : 'go'}>
        {isRunning ? 'STOP' : 'GO'}
      </button>
    </div>
  );
};

export default RandomWord;
