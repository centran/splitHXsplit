import React from 'react';

const Customization = ({ customization, onCustomizationChange }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace(/-input$/, '').replace(/-select$/, '').replace(/-slider$/, '');
    // camelCase the key
    const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    onCustomizationChange({ [camelCaseKey]: value });
  };

  return (
    <div className="customization-area">
      <h2>Customization</h2>
      <div className="control-group">
        <label htmlFor="bg-color-input">Page Background:</label>
        <input
          type="color"
          id="bg-color-input"
          value={customization.bgColor}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="container-bg-color-input">Container Background:</label>
        <input
          type="color"
          id="container-bg-color-input"
          value={customization.containerBgColor}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="word-box-bg-color-input">Word Box Background:</label>
        <input
          type="color"
          id="word-box-bg-color-input"
          value={customization.wordBoxBgColor}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="word-text-color-input">Word Text Color:</label>
        <input
          type="color"
          id="word-text-color-input"
          value={customization.wordTextColor}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="global-text-color-input">Global Text Color:</label>
        <input
          type="color"
          id="global-text-color-input"
          value={customization.globalTextColor}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="word-box-border-color-input">Word Box Border Color:</label>
        <input
          type="color"
          id="word-box-border-color-input"
          value={customization.wordBoxBorderColor}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="progress-color-input">Progress Bar Color:</label>
        <input
          type="color"
          id="progress-color-input"
          value={customization.progressColor}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label htmlFor="progress-direction-select">Progress Bar Mode:</label>
        <select
          id="progress-direction-select"
          value={customization.progressDirection}
          onChange={handleChange}
        >
          <option value="drain">Drain</option>
          <option value="fill">Fill</option>
        </select>
      </div>
      <div className="control-group">
        <label htmlFor="text-size-slider">Text Size:</label>
        <input
          type="range"
          id="text-size-slider"
          min="1"
          max="5"
          step="0.1"
          value={customization.textSize}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Customization;
