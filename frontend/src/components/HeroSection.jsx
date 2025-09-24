// components/HeroSection.jsx
import React from "react";

const HeroSection = ({ featuredPost, dappUrl }) => {
  if (!featuredPost) return null;
  return (
    <div className="relative max-w-6xl mx-auto mt-10 rounded-2xl overflow-hidden">
      <img
        src={featuredPost.image}
        alt={featuredPost.title}
        className="w-full h-72 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      <div className="absolute bottom-6 left-6">
        <h2 className="text-3xl md:text-4xl font-bold">{featuredPost.title}</h2>
        <p className="mt-2 text-slate-300 max-w-lg">{featuredPost.excerpt}</p>
        <div className="flex gap-3 mt-4">
          <a
            href={`/post/${featuredPost.id}`}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600"
          >
            Read more →
          </a>
          <a
            href={dappUrl}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500"
          >
            Launch dApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
