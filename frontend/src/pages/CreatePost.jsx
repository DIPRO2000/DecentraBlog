import React from "react";
import { useState } from "react";

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <path d="m12 19-7-7 7-7"/>
        <path d="M19 12H5"/>
    </svg>
);

const CreatePost = ({ account, setPosts, setView }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }
    
    const newPost = {
      id: Date.now(),
      title,
      content,
      author: account,
      timestamp: Date.now(),
      imageUrl: imageUrl || `https://placehold.co/1200x600/0f172a/94a3b8?text=${title.replace(/\s/g, '+')}`,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setView({ name: 'home' });
  };

  return (
    <div className="max-w-3xl mx-auto">
        <button 
            onClick={() => setView({ name: 'home' })}
            className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-cyan-400 mb-8 transition-colors"
        >
            <BackArrowIcon />
            Back to All Posts
        </button>
      <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Create a New Post</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300"
            placeholder="Your amazing post title"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300"
            placeholder="https://example.com/image.png"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300"
            placeholder="e.g., Ethereum, DeFi, Tutorial"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300"
            placeholder="Write your story here..."
          ></textarea>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-all transform hover:scale-105"
          >
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;