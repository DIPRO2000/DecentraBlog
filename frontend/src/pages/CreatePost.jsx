import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ethers } from "ethers";
import MyBlogAbi from "../../../blockchain/build/contracts/MyBlogApp.json";
import { useWallet } from "../context/WalletContext"; // import your context

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

const CreatePost = ({ setPosts, setView }) => {
  const { account, signer } = useWallet(); // get account & signer from context
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signer) {
      alert("Wallet not connected or signer unavailable!");
      console.error("No signer available. Connect wallet first.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare form data for image upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("author", anonymous ? "Anonymous" : (author || account));
      formData.append("tags", tags);
      if (imageFile) formData.append("image", imageFile);

      // Upload to backend which will store on IPFS
      const res = await fetch("http://localhost:3000/api/uploadPostToIPFS", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload to IPFS");

      const ipfsHash = data.ipfsHash; // backend should return ipfsHash

      // Contract instance using signer
      const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, MyBlogAbi.abi, signer);

      // Send transaction to blockchain
      const tx = await contract.createPost(anonymous ? "Anonymous" : (author || account), title, ipfsHash, { gasLimit: 3000000 });
      await tx.wait();

      // Optionally, add locally
      const newPost = {
        id: Date.now(),
        title,
        author: anonymous ? "Anonymous" : (author || account),
        content: { title, content, tags, author: anonymous ? "Anonymous" : (author || account), imageHash: ipfsHash },
        timestamp: Date.now(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      setPosts((prev) => [newPost, ...prev]);

      setView({ name: "home" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-slate-900 min-h-screen text-slate-200 font-sans">
      <Header />

      <div className="max-w-3xl mx-auto p-4">
        <button
          onClick={() => setView({ name: "home" })}
          className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-cyan-400 mb-8 transition-colors"
        >
          <BackArrowIcon />
          Back to All Posts
        </button>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Create a New Post</h2>

          {/* Title */}
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500"
          />

          {/* Author */}
          <div>
            <input
              type="text"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={anonymous}
              className="w-full p-3 rounded-md bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            />
            <label className="flex items-center mt-2 text-sm text-slate-300">
              <input type="checkbox" checked={anonymous} onChange={() => setAnonymous(!anonymous)} className="mr-2" />
              Post as Anonymous
            </label>
          </div>

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500"
          />

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-white"
          />

          {/* Content */}
          <textarea
            placeholder="Write your story..."
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500"
          />

          {error && <p className="text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-md text-white font-medium hover:from-cyan-600 hover:to-teal-600 transition-all"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
};

export default CreatePost;
