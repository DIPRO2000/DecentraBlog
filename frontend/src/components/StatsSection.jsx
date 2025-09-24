// components/StatsSection.jsx
import React from "react";

const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="bg-slate-800/40 rounded-2xl p-6 text-center"
        >
          <div className="text-3xl font-bold">{stat.value}</div>
          <div className="text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
