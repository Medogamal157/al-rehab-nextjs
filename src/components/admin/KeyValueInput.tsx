'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface KeyValueInputProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  label: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  hint?: string;
}

export function KeyValueInput({ 
  value, 
  onChange, 
  label, 
  keyPlaceholder = 'Key (e.g., Origin)',
  valuePlaceholder = 'Value (e.g., Egypt)',
  hint 
}: KeyValueInputProps) {
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const addEntry = () => {
    const trimmedKey = keyInput.trim();
    const trimmedValue = valueInput.trim();
    if (trimmedKey && trimmedValue) {
      onChange({ ...value, [trimmedKey]: trimmedValue });
      setKeyInput('');
      setValueInput('');
    }
  };

  const removeEntry = (key: string) => {
    const newValue = { ...value };
    delete newValue[key];
    onChange(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEntry();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {/* Existing entries */}
      {Object.keys(value).length > 0 && (
        <div className="space-y-2 mb-2">
          {Object.entries(value).map(([key, val]) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-lg"
            >
              <span className="font-medium text-gray-700 text-sm">{key}:</span>
              <span className="flex-1 text-gray-600 text-sm">{val}</span>
              <button
                type="button"
                onClick={() => removeEntry(key)}
                className="p-1 hover:bg-red-50 text-red-500 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new entry */}
      <div className="flex gap-2">
        <input
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={keyPlaceholder}
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
        />
        <input
          type="text"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={valuePlaceholder}
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
        />
        <button
          type="button"
          onClick={addEntry}
          disabled={!keyInput.trim() || !valueInput.trim()}
          className="px-3 py-2 bg-[#2d7a3e] text-white rounded-lg hover:bg-[#1d5a2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {hint && (
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      )}
    </div>
  );
}
