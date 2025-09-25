// components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

const Header = () => {
  const navigate = useNavigate();
  const { account,connectWallet} = useWallet();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800 shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / title */}
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-white cursor-pointer hover:text-cyan-400 transition-colors duration-300"
          >
            DecentraBlog
          </h1>

          {/* Right buttons */}
          <div className="flex items-center space-x-4">
            {/* Show Write Post only if wallet connected */}
            {account && (
              <Link
                to="/createpost"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-all transform hover:scale-105"
              >
                Write Post
              </Link>
            )}

            {/* Connect Wallet */}
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-sm font-medium rounded-md text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors"
            >
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
