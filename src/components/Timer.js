import React from 'react';

const Timer = ({ timer, setTimer, isRunning, excludeConfig, setExcludeConfig, customization, onCustomizationChange, showNextWord, setShowNextWord }) => {
  return (
    <div className="timer-area">
      <div className="timer-input-section">
        <div className="timer-control">
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
        <div className="show-next-word-control">
          <input
            type="checkbox"
            id="show-next-word-checkbox"
            checked={showNextWord}
            onChange={(e) => setShowNextWord(e.target.checked)}
            disabled={isRunning}
          />
          <label htmlFor="show-next-word-checkbox">Show next word</label>
        </div>
        <div className="text-case-group">
          <label>Text Case:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="text-case"
                id="text-case-as-is"
                value="as-is"
                checked={customization.textCase === 'as-is'}
                onChange={(e) => onCustomizationChange({ textCase: e.target.value })}
                disabled={isRunning}
              />
              As-is
            </label>
            <label>
              <input
                type="radio"
                name="text-case"
                id="text-case-uppercase"
                value="uppercase"
                checked={customization.textCase === 'uppercase'}
                onChange={(e) => onCustomizationChange({ textCase: e.target.value })}
                disabled={isRunning}
              />
              UPPERCASE
            </label>
            <label>
              <input
                type="radio"
                name="text-case"
                id="text-case-lowercase"
                value="lowercase"
                checked={customization.textCase === 'lowercase'}
                onChange={(e) => onCustomizationChange({ textCase: e.target.value })}
                disabled={isRunning}
              />
              lowercase
            </label>
          </div>
        </div>
      </div>
      <div className="cool-down-section">
        <div>
          <input
            type="checkbox"
            id="exclude-toggle"
            checked={excludeConfig.enabled}
            onChange={(e) => setExcludeConfig({ ...excludeConfig, enabled: e.target.checked })}
            disabled={isRunning}
          />
          <label htmlFor="exclude-toggle">Cooldown settings</label>
        </div>
        <div>
          <label htmlFor="words-count">Exclude X words:</label>
          <input
            type="number"
            id="words-count"
            min="1"
            value={excludeConfig.excludeCount}
            onChange={(e) => setExcludeConfig({ ...excludeConfig, excludeCount: parseInt(e.target.value) })}
            disabled={isRunning || !excludeConfig.enabled}
          />
        </div>
        <div>
          <label htmlFor="cycles-count">For Y cycles (selections):</label>
          <input
            type="number"
            id="cycles-count"
            min="1"
            value={excludeConfig.excludeCycles}
            onChange={(e) => setExcludeConfig({ ...excludeConfig, excludeCycles: parseInt(e.target.value) })}
            disabled={isRunning || !excludeConfig.enabled}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
