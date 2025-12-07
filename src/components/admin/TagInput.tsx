'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  placeholder?: string;
  hint?: string;
}

export function TagInput({ value, onChange, label, placeholder, hint }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-[#2d7a3e] focus-within:border-transparent bg-white">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[#2d7a3e]/10 text-[#2d7a3e] rounded-md text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="p-0.5 hover:bg-[#2d7a3e]/20 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="flex-1 flex items-center gap-1 min-w-[150px]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : 'Add more...'}
            className="flex-1 outline-none text-sm py-1 min-w-[100px]"
          />
          {inputValue && (
            <button
              type="button"
              onClick={addTag}
              className="p-1 text-[#2d7a3e] hover:bg-[#2d7a3e]/10 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {hint && (
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      )}
    </div>
  );
}
