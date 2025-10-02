import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import MyBlogAbi from "../../../blockchain/build/contracts/MyBlogApp.json";
import { useWallet } from "../context/WalletContext"; // import hook

// --- SVG Icons ---
const UpvoteIcon = ({ isActive }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
    viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
    strokeLinejoin="round">
    <path d="M7 11v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1z" />
    <path d="M12 11V3l4 4-4 4" />
  </svg>
);

const DownvoteIcon = ({ isActive }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
    viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
    strokeLinejoin="round">
    <path d="M7 13v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
    <path d="M12 13v8l4-4-4-4" />
  </svg>
);

const CommentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { isConnected, signer } = useWallet(); // get wallet state

  // Local UI state, initialized from post props
  const [upvotes, setUpvotes] = useState(post.upvote || 0);
  const [downvotes, setDownvotes] = useState(post.downvote || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [voteStatus, setVoteStatus] = useState(null); // 'up', 'down', or null
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the contract instance. It will only be created when the signer is available.
  const contract = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      MyBlogAbi.abi,
      signer
    );
  }, [signer]);

  const content = post.content || {};
  const snippet = content.content
    ? content.content.split(" ").slice(0, 25).join(" ") + "..."
    : "";
  const tags = content.tags ? content.tags.split(",").map((t) => t.trim()) : [];
  const imageUrl = content.imageHash
    ? `https://gateway.pinata.cloud/ipfs/${content.imageHash}`
    : `https://placehold.co/1200x600/0f172a/94a3b8?text=${encodeURIComponent(post.title)}`;
  const timestamp = post.timestamp ? new Date(Number(post.timestamp) * 1000) : null;
  
  // --- Wallet check wrapper ---
  const requireWallet = (action) => {
    if (!isConnected || !contract) {
      alert("Please connect your wallet to interact with posts!");
      return;
    }
    action();
  };

  // --- Helper to extract a readable error message from a transaction revert ---
  const extractRevertReason = (err) => {
    // Ethers v6 often has a clear reason
    if (err.reason) {
      return err.reason;
    }
    // Check for nested error data from providers like MetaMask
    if (err.error?.data?.message) {
      const message = err.error.data.message;
      // Extract reason from "execution reverted: reason"
      const match = message.match(/execution reverted: (.*)/);
      if (match && match[1]) {
        return match[1];
      }
    }
    // Fallback to the main error message if no specific reason is found
    return err.message || "An unknown transaction error occurred.";
  };


  // --- Handlers ---
  const handleUpvote = async (e) => {
    e.stopPropagation();
    requireWallet(async () => {
      setIsLoading(true);
      try {
        // First, simulate the transaction to catch reverts without spending gas
        await contract.upvotePost.staticCall(post.id);

        // If the simulation succeeds, send the actual transaction
        const tx = await contract.upvotePost(post.id, { gasLimit: 300000 });
        await tx.wait();
        
        // Optimistic UI update
        setUpvotes((v) => v + 1);
        if (voteStatus === 'down') setDownvotes(d => d - 1); // un-downvote if switching
        setVoteStatus("up");

      } catch (err) {
        console.error("Upvote failed:", err);
        alert(`Error: ${extractRevertReason(err)}`);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleDownvote = async (e) => {
    e.stopPropagation();
    requireWallet(async () => {
      setIsLoading(true);
      try {
        // First, simulate the transaction
        await contract.downvotePost.staticCall(post.id);

        // If the simulation succeeds, send the actual transaction
        const tx = await contract.downvotePost(post.id, { gasLimit: 300000 });
        await tx.wait();

        // Optimistic UI update
        setDownvotes((d) => d + 1);
        if (voteStatus === 'up') setUpvotes(v => v - 1); // un-upvote if switching
        setVoteStatus("down");

      } catch (err) {
        console.error("Downvote failed:", err);
        alert(`Error: ${extractRevertReason(err)}`);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id}#comments`);
  };

  return (
    <div className={`group flex flex-col bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-600 transition-all duration-300 transform hover:-translate-y-1 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Content area */}
      <div onClick={() => navigate(`/post/${post.id}`)} className="cursor-pointer flex-grow">
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
              <span key={tag} className="bg-slate-700 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full">
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

      {/* Action bar */}
      <div className="p-6 pt-4 border-t border-slate-700 flex items-center space-x-5">
        <button
          onClick={handleUpvote}
          disabled={isLoading || voteStatus === 'up'}
          className={`flex items-center space-x-2 transition-colors duration-200 ${voteStatus === "up" ? "text-cyan-400" : "text-slate-400 hover:text-white"} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <UpvoteIcon isActive={voteStatus === "up"} />
          <span className="text-sm font-medium">{upvotes}</span>
        </button>
        <button
          onClick={handleDownvote}
          disabled={isLoading || voteStatus === 'down'}
          className={`flex items-center space-x-2 transition-colors duration-200 ${voteStatus === "down" ? "text-red-400" : "text-slate-400 hover:text-white"} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <DownvoteIcon isActive={voteStatus === "down"} />
          <span className="text-sm font-medium">{downvotes}</span>
        </button>
        <button
          onClick={handleCommentClick}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
        >
          <CommentIcon />
          <span className="text-sm font-medium">{commentCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;

