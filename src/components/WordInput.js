import React, { useState } from 'react';

const WordInput = ({ addWords, isRunning }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddWords = () => {
    addWords(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddWords();
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a word or words separated by commas"
        disabled={isRunning}
      />
      <button onClick={handleAddWords} disabled={isRunning}>
        Add Word(s)
      </button>
    </div>
  );
};

export default WordInput;
