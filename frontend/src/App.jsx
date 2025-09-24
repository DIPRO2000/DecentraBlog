import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css';

import Home from './pages/Home';
import CreatePost from './pages/CreatePost';

function App() {

  //Mock Posts
  const MOCK_POSTS = [
    {
      id: 4,
      title: "The Rise of Layer 2: Scaling Ethereum for the Future",
      author: "0xb4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3",
      content: "Ethereum's Layer 2 solutions like Arbitrum, Optimism, and zkSync are no longer experimental concepts; they are the present and future of scaling. By processing transactions off-chain and posting summarized data back to the mainnet, L2s drastically reduce gas fees and increase throughput. This enables a new generation of dApps, from complex DeFi protocols to high-performance blockchain games, that were previously unfeasible on Layer 1. Understanding their architecture is crucial for any Web3 developer.",
      timestamp: new Date('2025-09-24T09:00:00Z').getTime(),
      imageUrl: "https://placehold.co/1200x600/0f172a/94a3b8?text=Layer+2+Scaling",
      tags: ["Ethereum", "Layer 2", "Scalability", "DeFi"]
    },
    {
      id: 3,
      title: "Exploring the Potential of Decentralized Science (DeSci)",
      author: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      content: "Decentralized Science, or DeSci, is a movement aiming to build a more open, transparent, and collaborative scientific ecosystem using Web3 technologies. By leveraging blockchain for funding, data sharing, and peer review, DeSci can potentially solve some of the biggest challenges in traditional science, such as publication bias and lack of access to research data. It's an exciting frontier where verifiable, transparent processes can accelerate discovery.",
      timestamp: new Date('2025-09-23T18:30:00Z').getTime(),
      imageUrl: "https://placehold.co/1200x600/0f172a/94a3b8?text=DeSci",
      tags: ["DeSci", "Web3", "Science", "Research"]
    },
    {
      id: 2,
      title: "A Developer's Guide to Smart Contract Security",
      author: "0x9f8e7d6c5b4a3928170123456789abcdef012345",
      content: "Smart contract security is paramount. A single vulnerability can lead to millions in losses. Key principles include following the checks-effects-interactions pattern, using battle-tested libraries like OpenZeppelin, comprehensive testing with tools like Foundry or Hardhat, and undergoing third-party audits. Remember, code is law, and that law must be airtight.",
      timestamp: new Date('2025-09-22T10:00:00Z').getTime(),
      imageUrl: "https://placehold.co/1200x600/0f172a/94a3b8?text=Security",
      tags: ["Security", "Solidity", "Audits"]
    },
    {
      id: 1,
      title: "My First Journey into the World of Web3",
      author: "0xabc123def456ghi789jkl012mno345pqr678stu901",
      content: "Getting started in Web3 can feel daunting, but the core concepts of decentralization and user ownership are revolutionary. This post documents my first steps: setting up a wallet, interacting with a simple dApp, and understanding the role of gas fees. The community is incredibly welcoming, and the potential for building a better internet is what keeps me motivated.",
      timestamp: new Date('2025-09-21T14:45:00Z').getTime(),
      imageUrl: "https://placehold.co/1200x600/0f172a/94a3b8?text=My+First+dApp",
      tags: ["Beginner", "Web3", "Wallet"]
    }
  ];


  const [posts, setPosts] = useState(MOCK_POSTS);
  const [account, setAccount] = useState(null);
  const [view, setView] = useState({ name: 'home', data: null });

  const connectWallet = () => {
    // This is a simulation. In a real dApp, you would use ethers.js or web3-react
    if (account) {
      setAccount(null);
    } else {
      setAccount("0x5aB6dF12C3e4F567a8bCd91e2f3c45d6E7f8c901");
    }
  };
    
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // useEffect(() => {
  //   console.log(posts);
  // }, []);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home posts={posts}/>} />
        <Route path="/createpost" element={<CreatePost/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
