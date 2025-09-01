import React from 'react';

const WordList = ({ words, removeWord, excludeMap = {}, excludeConfig }) => {
  return (
    <div className="word-list-area">
      <h2>Word List</h2>
      <ul id="word-list">
        {words.map(word => (
          <li key={word}>
            {word}
            {excludeMap[word] > 0 && (
              <span className="exclusion-cycles" style={{ marginLeft: '8px', color: '#888' }}>
                ({excludeMap[word]})
              </span>
            )}
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
