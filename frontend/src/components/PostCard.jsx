import React from "react";

const PostCard = ({ post, setView }) => {
  const truncateAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const content = post.content || {};
  const snippet = content.content
    ? content.content.split(" ").slice(0, 25).join(" ") + "..."
    : "";

  const tags = content.tags ? content.tags.split(",").map(t => t.trim()) : [];
  const imageUrl = content.imageHash ? `https://ipfs.io/ipfs/${content.imageHash}` : null;
  const timestamp = post.timestamp ? new Date(Number(post.timestamp) * 1000) : null;

  return (
    <div
      className="group bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => setView({ name: "post", data: post })}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
        />
      )}
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-slate-700 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
          {post.title || content.title}
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          By{" "}
          <span className="font-mono bg-slate-700 px-1.5 py-0.5 rounded-sm">
            {post.author}
          </span>
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">{snippet}</p>
        <div className="flex justify-between items-center">
          <span className="text-cyan-400 font-semibold flex items-center">
            Read More
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-1">
              &rarr;
            </span>
          </span>
          {timestamp && (
            <span className="text-xs text-slate-500">{timestamp.toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
