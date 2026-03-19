// 1. Removed top-level import of @perawallet/connect
let peraWalletInstance: any = null;

// 2. Singleton initialization of PeraWallet
export const getPeraWallet = async () => {
  if (!peraWalletInstance) {
    const { PeraWalletConnect } = await import('@perawallet/connect');
    peraWalletInstance = new PeraWalletConnect({
      chainId: 416002 // Testnet chain ID
    });
  }
  return peraWalletInstance;
};

// 3. Proxy wrapper to satisfy existing rigid dependencies without breaking UI (e.g. App.tsx)
export const peraWallet = new Proxy({}, {
  get(target, prop) {
    if (peraWalletInstance) {
      const value = peraWalletInstance[prop];
      if (typeof value === 'function') {
        return value.bind(peraWalletInstance);
      }
      return value;
    }
    return undefined;
  }
});

export const connectWallet = async (): Promise<string> => {
  const wallet = await getPeraWallet();
  const accounts = await wallet.connect();
  if (accounts.length > 0) {
    localStorage.setItem("walletAddress", accounts[0]);
    return accounts[0];
  }
  throw new Error("No accounts found from Pera Wallet");
};

export const reconnectWallet = async (): Promise<string | null> => {
  try {
    const wallet = await getPeraWallet();
    const accounts = await wallet.reconnectSession();
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

export const disconnectWallet = async () => {
  if (peraWalletInstance) {
    peraWalletInstance.disconnect();
  }
  localStorage.removeItem("walletAddress");
};

export const getStoredWalletAddress = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("walletAddress");
  }
  return null;
};
