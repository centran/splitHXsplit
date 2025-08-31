import React from 'react';

const WordList = ({ words, removeWord }) => {
  return (
    <div className="word-list-area">
      <h2>Word List</h2>
      <ul id="word-list">
        {words.map(word => (
          <li key={word}>
            {word}
            <span className="remove-word" onClick={() => removeWord(word)}>
              X
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;
