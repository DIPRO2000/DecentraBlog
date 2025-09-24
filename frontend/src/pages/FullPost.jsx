import React from "react";

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <path d="m12 19-7-7 7-7"/>
        <path d="M19 12H5"/>
    </svg>
);


const FullPost = ({ post, setView }) => {
  return (
    <article className="max-w-3xl mx-auto">
       <button 
            onClick={() => setView({ name: 'home' })}
            className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-cyan-400 mb-8 transition-colors"
        >
            <BackArrowIcon />
            Back to All Posts
        </button>
      <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg mb-8 aspect-video object-cover"/>
      <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">{post.title}</h1>
      <div className="text-slate-400 mb-8 border-b border-t border-slate-700 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p>
            By <span className="font-mono bg-slate-800 px-2 py-1 rounded-sm">{post.author}</span>
          </p>
          <p className="text-sm mt-2">
            Published on {new Date(post.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
                <span key={tag} className="bg-slate-700 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
            ))}
        </div>
      </div>
      <div className="prose prose-invert prose-lg max-w-none text-slate-300 prose-p:leading-relaxed prose-headings:text-slate-100">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
};

export default FullPost;