import React from 'react';

const Timer = ({ timer, setTimer, isRunning }) => {
  return (
    <div className="timer-area">
      <label htmlFor="timer-input">Switch time (minutes):</label>
      <input
        type="number"
        id="timer-input"
        min="0.1"
        step="0.1"
        value={timer}
        onChange={(e) => setTimer(parseFloat(e.target.value))}
        disabled={isRunning}
      />
    </div>
  );
};

export default Timer;
