import React from 'react';

const FilterSection = ({ title, items, selected, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <h3 className="font-medium text-lg text-blue-900 mb-4 pb-2 border-b">{title}</h3>
    <div className="flex flex-col gap-1.5">
      {items.map(item => (
        <button
          key={item}
          onClick={() => {
            onChange(prev =>
              prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
            );
          }}
          className={`
            px-4 py-2 rounded-lg text-sm text-left
            transition-all duration-200 ease-in-out
            flex items-center gap-2
            ${selected.includes(item)
              ? 'bg-blue-900 text-white shadow-sm hover:bg-blue-800'
              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-900'}
          `}
        >
          <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
            selected.includes(item) 
              ? 'border-white' 
              : 'border-gray-400'
          }`}>
            {selected.includes(item) && '✓'}
          </span>
          <span className="truncate">{item}</span>
        </button>
      ))}
    </div>
  </div>
);

export default FilterSection;