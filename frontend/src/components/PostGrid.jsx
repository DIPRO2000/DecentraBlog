// components/PostGrid.jsx
import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";

const PostGrid = ({ onLoadMore, hasMore }) => {
  const [posts, setPosts] = useState([]);

  // Example: fetch posts if needed
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getallpost`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("Fetched data:", data); // shows your array
        setPosts(data); // <-- set the array directly
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 mx-5">
        {posts.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={onLoadMore}
          className="block mx-auto mt-8 px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
        >
          Load more
        </button>
      )}
    </>
  );
};

export default PostGrid;
