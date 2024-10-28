import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = ({ gameMode, onGameModeChange, timerDuration, onTimerDurationChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempGameMode, setTempGameMode] = useState(gameMode);
  const [tempTimerDuration, setTempTimerDuration] = useState(timerDuration);

  const handleSave = () => {
    onGameModeChange(tempGameMode);
    onTimerDurationChange(tempTimerDuration);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-200 rounded-full"
      >
        <SettingsIcon size={24} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Game Mode
            </label>
            <select
              value={tempGameMode}
              onChange={(e) => setTempGameMode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="classic">Classic (4 players)</option>
              <option value="duo">Duo (2 players)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Timer Duration (seconds)
            </label>
            <input
              type="number"
              value={tempTimerDuration}
              onChange={(e) => setTempTimerDuration(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;