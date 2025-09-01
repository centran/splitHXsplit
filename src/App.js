import React, { useState, useEffect } from 'react';
import './App.css';
import WordInput from './components/WordInput';
import WordList from './components/WordList';
import RandomWord from './components/RandomWord';
import Timer from './components/Timer';
import Customization from './components/Customization';

function App() {
  const [words, setWords] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0.5);
  const [showNextWord, setShowNextWord] = useState(false);
  const [excludeConfig, setExcludeConfig] = useState({
    excludeCount: 3,
    excludeCycles: 2,
    enabled: false
  });
  const [excludeMap, setExcludeMap] = useState({}); // { word: remainingCycles }
  const [customization, setCustomization] = useState({
    bgColor: '#121212',
    containerBgColor: '#1e1e1e',
    wordBoxBgColor: '#2a2a2a',
    wordTextColor: '#e0e0e0',
    globalTextColor: '#e0e0e0',
    wordBoxBorderColor: '#bb86fc',
    progressColor: '#03dac6',
    progressDirection: 'drain',
    textSize: 2,
    textCase: 'as-is',
  });

  const addWords = (newWords) => {
    const wordsToAdd = newWords
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0 && !words.includes(word));
    if (wordsToAdd.length > 0) {
      setWords([...words, ...wordsToAdd]);
    }
  };

  const removeWord = (wordToRemove) => {
    setWords(words.filter(word => word !== wordToRemove));
  };

  const handleCustomizationChange = (newCustomization) => {
    setCustomization({ ...customization, ...newCustomization });
  };

  useEffect(() => {
    document.body.style.backgroundColor = customization.bgColor;
    document.body.style.color = customization.globalTextColor;
  }, [customization.bgColor, customization.globalTextColor]);

  return (
    <div className="container" style={{ backgroundColor: customization.containerBgColor }}>
      <h1 style={{ color: customization.globalTextColor }}>Random Word Picker</h1>
      <RandomWord
        words={words}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        timer={timer}
        customization={customization}
        showNextWord={showNextWord}
        excludeConfig={excludeConfig}
        excludeMap={excludeMap}
        setExcludeMap={setExcludeMap}
      />
      <WordInput addWords={addWords} isRunning={isRunning} />
      <WordList words={words} removeWord={removeWord} excludeMap={excludeMap} excludeConfig={excludeConfig} />
      <Timer 
        timer={timer} 
        setTimer={setTimer} 
        isRunning={isRunning}
        excludeConfig={excludeConfig}
        setExcludeConfig={setExcludeConfig}
        customization={customization}
        onCustomizationChange={handleCustomizationChange}
        showNextWord={showNextWord}
        setShowNextWord={setShowNextWord}
      />
      <Customization
        customization={customization}
        onCustomizationChange={handleCustomizationChange}
      />
    </div>
  );
}

export default App;
