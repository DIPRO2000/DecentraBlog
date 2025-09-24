// components/NewsletterSection.jsx
import React from "react";

const NewsletterSection = () => (
  <div className="max-w-xl mx-auto mt-16 text-center">
    <h3 className="text-2xl font-bold">Stay updated</h3>
    <p className="mt-2 text-slate-400">
      Get the latest posts & dApp updates right in your inbox.
    </p>
    <form className="mt-4 flex">
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 px-4 py-2 rounded-l-xl bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:outline-none"
      />
      <button
        type="submit"
        className="px-6 py-2 rounded-r-xl bg-slate-700 hover:bg-slate-600"
      >
        Subscribe
      </button>
    </form>
  </div>
);

export default NewsletterSection;
