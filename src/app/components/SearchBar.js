import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => (
    <div className="flex gap-4 mb-4">
  <input
    type="text"
    placeholder="Search events..."
    onChange={(e) => onSearch(e.target.value)}
    className="flex-1 px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none shadow-sm hover:shadow"
  />
  <button className="bg-blue-900 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm hover:shadow">
    <Search size={20} />
    <span>Search</span>
  </button>
</div>
);

export default SearchBar;