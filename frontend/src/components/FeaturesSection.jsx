// components/FeaturesSection.jsx
import React from "react";

const FeaturesSection = ({ features }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 px-5 max-w-6xl mx-auto">
      {features.map(item => (
        <div
          key={item.title}
          className="bg-slate-800/40 rounded-2xl p-6 text-center"
        >
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="mt-2 text-slate-400">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSection;
