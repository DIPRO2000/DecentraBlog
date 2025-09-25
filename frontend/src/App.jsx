// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import FullPost from "./pages/FullPost";

function App() {
  const [posts, setPosts] = useState([]);
  // const [account, setAccount] = useState(null);

  // real MetaMask connect
  // const connectWallet = async () => {
  //   try {
  //     if (!window.ethereum) {
  //       alert("Please install MetaMask!");
  //       return;
  //     }
  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     setAccount(accounts[0]);

  //     // watch account changes
  //     window.ethereum.on("accountsChanged", (accs) => {
  //       setAccount(accs[0] || null);
  //     });
  //   } catch (err) {
  //     console.error("Wallet connection failed:", err);
  //   }
  // };

  // optional fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/getallpost`
        );
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <BrowserRouter>
      {/* Header shown on all pages */}
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/createpost" element={<CreatePost/>} />
        <Route path="/post/:postId" element={<FullPost/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
