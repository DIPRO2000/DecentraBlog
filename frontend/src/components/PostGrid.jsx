// components/PostGrid.jsx
import React from "react";
import PostCard from "./PostCard";

const PostGrid = ({ posts, onLoadMore, hasMore }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 mx-5">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
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

export default PostGrid;
