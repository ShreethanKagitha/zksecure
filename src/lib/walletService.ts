import { PeraWalletConnect } from '@perawallet/connect';

export const peraWallet = new PeraWalletConnect({
  chainId: 416002 // Testnet chain ID
});

export const connectWallet = async (): Promise<string> => {
  const accounts = await peraWallet.connect();
  if (accounts.length > 0) {
    localStorage.setItem("walletAddress", accounts[0]);
    return accounts[0];
  }
  throw new Error("No accounts found from Pera Wallet");
};

export const reconnectWallet = async (): Promise<string | null> => {
  try {
    const accounts = await peraWallet.reconnectSession();
    if (accounts.length > 0) {
      localStorage.setItem("walletAddress", accounts[0]);
      return accounts[0];
    }
  } catch (error) {
    console.error("Failed to reconnect Pera Wallet:", error);
  }
  localStorage.removeItem("walletAddress");
  return null;
};

export const disconnectWallet = () => {
  peraWallet.disconnect();
  localStorage.removeItem("walletAddress");
};

export const getStoredWalletAddress = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("walletAddress");
  }
  return null;
};
