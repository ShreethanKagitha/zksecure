// Integrate 'connect-wallet-starter-v2' universal capabilities
import { NetworkId, WalletId, WalletManager } from '@txnlab/use-wallet-react';

export const walletManager = new WalletManager({
  wallets: [WalletId.PERA, WalletId.DEFLY, WalletId.LUTE],
  defaultNetwork: NetworkId.TESTNET,
});

// Backward compatibility or custom utility methods if needed
export const getStoredWalletAddress = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("@txnlab/use-wallet:active_account");
  }
  return null;
};
