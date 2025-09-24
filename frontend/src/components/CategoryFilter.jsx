// components/CategoryFilter.jsx
import React from "react";

const CategoryFilter = ({ categories, active, onSelect }) => (
  <div className="flex space-x-4 overflow-x-auto mt-6 px-5">
    {categories.map(cat => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`px-4 py-2 rounded-full border border-slate-700 whitespace-nowrap transition-colors duration-200 ${
          active === cat
            ? "bg-slate-800 text-slate-100"
            : "hover:bg-slate-800/50"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
