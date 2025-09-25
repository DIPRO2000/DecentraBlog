import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    // State variables to store wallet connection info
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    // useCallback ensures this function's identity is stable across re-renders
    const updateWalletState = useCallback(async () => {
        if (window.ethereum) {
            try {
                // Use the modern Ethers v6 provider
                const _provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(_provider);
                
                const accounts = await _provider.listAccounts();
                
                // If accounts are found, it means the wallet is connected
                if (accounts.length > 0) {
                    const _signer = await _provider.getSigner();
                    setSigner(_signer);
                    setAccount(_signer.address);
                    setIsConnected(true);
                } else {
                    // No accounts found, reset state
                    setAccount(null);
                    setSigner(null);
                    setIsConnected(false);
                }
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error("Error updating wallet state:", err);
                setError("Failed to update wallet state. Please check your wallet connection.");
                // Reset state on error
                setAccount(null);
                setSigner(null);
                setIsConnected(false);
            }
        }
        // No else block needed; if window.ethereum doesn't exist, state remains null/false
    }, []);

    // Function to be called by a "Connect Wallet" button
    const connectWallet = async () => {
        if (!window.ethereum) {
            setError("Please install MetaMask!");
            return;
        }
        try {
            // This prompts the user to connect their wallet
            await window.ethereum.request({ method: "eth_requestAccounts" });
            // After connecting, update the state
            await updateWalletState();
        } catch (err) {
            console.error("Wallet connection failed:", err);
            setError("Wallet connection was rejected.");
        }
    };
    
    // Function to disconnect
    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setIsConnected(false);
        setError(null);
        // Note: This does not disconnect from MetaMask itself, just from the dApp's state.
    };

    // This effect runs once on component mount to set up listeners
    useEffect(() => {
        if (window.ethereum) {
            // Listen for account changes
            window.ethereum.on("accountsChanged", updateWalletState);
            // Listen for network/chain changes
            window.ethereum.on("chainChanged", updateWalletState);

            // Check for initial connection on page load
            updateWalletState();
        }
        
        // Cleanup function to remove listeners when the component unmounts
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", updateWalletState);
                window.ethereum.removeListener("chainChanged", updateWalletState);
            }
        };
    }, [updateWalletState]); // Dependency array includes the stable update function

    const value = {
        account,
        provider,
        signer,
        isConnected,
        error,
        connectWallet,
        disconnectWallet,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

// Custom hook for easy access to the wallet context
export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};
