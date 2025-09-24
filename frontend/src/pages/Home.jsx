import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import StatsSection from "../components/StatsSection";
import NewsletterSection from "../components/NewsletterSection";
import CategoryFilter from "../components/CategoryFilter";
import PostGrid from "../components/PostGrid";

const Home = ({ posts }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = ["All", ...new Set(posts.map(p => p.category || "Uncategorised"))];

  const filteredPosts = posts.filter(post => {
    const matchCategory = category === "All" || post.category === category;
    const matchQuery = post.title.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700/20 via-slate-900 to-slate-900">
      <Header />

      <HeroSection featuredPost={posts[0]} dappUrl="https://yourdapp.com" />

      <FeaturesSection
        features={[
          { title: "Secure", desc: "Your data stays on-chain" },
          { title: "Fast", desc: "Low gas fees and instant finality" },
          { title: "Open", desc: "Built on open protocols" },
          { title: "Community", desc: "Join thousands of users" },
        ]}
      />

      <StatsSection
        stats={[
          { label: "Transactions", value: "10,245" },
          { label: "Users", value: "3,560" },
          { label: "Avg. Fee", value: "0.002 ETH" },
        ]}
      />

      {/* Search */}
      <div className="max-w-4xl mx-auto mt-10 px-5">
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring focus:ring-slate-600"
        />
      </div>

      <CategoryFilter
        categories={categories}
        active={category}
        onSelect={cat => {
          setCategory(cat);
          setVisibleCount(6);
        }}
      />

      <PostGrid
        posts={visiblePosts}
        hasMore={visibleCount < filteredPosts.length}
        onLoadMore={() => setVisibleCount(c => c + 6)}
      />

      <NewsletterSection />

      <Footer />
    </div>
  );
};

export default Home;
