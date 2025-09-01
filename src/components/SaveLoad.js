import React, { useState } from 'react';
import pako from 'pako';

const SaveLoad = ({ settings, onLoad }) => {
  const [encodedString, setEncodedString] = useState('');

  const handleSave = () => {
    try {
      const jsonString = JSON.stringify(settings);
      const compressed = pako.deflate(jsonString);
      const encoded = btoa(String.fromCharCode.apply(null, compressed));
      setEncodedString(encoded);
    } catch (error) {
      console.error('Error saving state:', error);
      alert('Failed to save state.');
    }
  };

  const handleLoad = () => {
    if (!encodedString) {
      alert('Please paste a save string into the text box first.');
      return;
    }
    try {
      const decoded = atob(encodedString);
      const charData = decoded.split('').map((x) => x.charCodeAt(0));
      const decompressed = pako.inflate(new Uint8Array(charData), { to: 'string' });
      const loadedSettings = JSON.parse(decompressed);

      // Basic validation
      if (loadedSettings && typeof loadedSettings === 'object' && loadedSettings.words) {
        onLoad(loadedSettings);
        alert('State loaded successfully!');
      } else {
        throw new Error('Invalid save data format.');
      }
    } catch (error) {
      console.error('Error loading state:', error);
      alert('Failed to load state. The provided string may be invalid or corrupted.');
    }
  };

  return (
    <div className="save-load-area">
      <h2>Save/Load Settings</h2>
      <div className="control-group">
        <label htmlFor="save-load-string">Save/Load String:</label>
        <textarea
          id="save-load-string"
          value={encodedString}
          onChange={(e) => setEncodedString(e.target.value)}
          placeholder="Paste a save string here to load..."
        />
      </div>
      <div className="button-group">
        <button onClick={handleSave}>Save Current State</button>
        <button onClick={handleLoad}>Load from String</button>
      </div>
    </div>
  );
};

export default SaveLoad;
