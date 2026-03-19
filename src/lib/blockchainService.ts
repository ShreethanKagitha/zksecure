import { walletManager } from './walletService';

export interface BlockchainResult {
  txId: string;
  status: 'SUCCESS' | 'FAILED';
  blockNumber: number;
}

const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = '';
const ALGOD_TOKEN = '';

/**
 * Anchors a ZK-Proof to the Algorand blockchain via Pera Wallet.
 */
export const anchorProofOnChain = async (
  walletAddress: string,
  proof: any,
  publicSignals: any[]
): Promise<BlockchainResult> => {
  // 1. Dynamic import for algosdk to remove it from initial bundle
  const algosdk = await import('algosdk');
  const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

  console.log("Anchoring proof with wallet:", walletAddress);
  
  if (!walletAddress || walletAddress === "null" || walletAddress === "undefined") {
    throw new Error("Please connect your Pera Wallet before anchoring the proof.");
  }

  console.log(`[BlockchainService] Proof Payload Size: ${JSON.stringify(proof).length} bytes`);
  
  try {
    const encoder = new TextEncoder();
    const noteContent = JSON.stringify({ 
      action: "VERIFY_ZKTLS", 
      proofSignature: proof.pi_a?.[0] || "mock_sig",
      signals: publicSignals 
    });

    // Fetch suggested transaction parameters
    const params = await algodClient.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: walletAddress,
      receiver: walletAddress,
      amount: 0,
      note: encoder.encode(noteContent),
      suggestedParams: params
    });

    console.log(`[BlockchainService] Transaction built: ${txn.type}`);

    // 2. Fetch active connected transactions from WalletManager
    const encodedTxn = algosdk.encodeUnsignedTransaction(txn);
    console.log(`[BlockchainService] Requesting signature from active wallet...`);
    const signedTxns = await walletManager.signTransactions([encodedTxn]);

    console.log(`[BlockchainService] Broadcasting transaction...`);
    const validSignedTxns = (Array.isArray(signedTxns) ? signedTxns : [signedTxns]).filter(t => t !== null) as Uint8Array[];
    // Broadcast the first valid signed transaction payload
    const response = await algodClient.sendRawTransaction(validSignedTxns[0]).do() as any;
    
    // Safely extract transaction ID (Pera response vs. local computation fallback)
    const txId = response.txId || txn.txID().toString();
    console.log(`[BlockchainService] Transaction broadcasted successfully. Computed TxID: ${txId}`, response);

    // Wait for confirmation (increased to 20 rounds to gracefully handle TestNet variance)
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 20);
    
    return {
      txId: txId,
      status: 'SUCCESS',
      blockNumber: confirmedTxn.confirmedRound || (confirmedTxn as any)['confirmed-round']
    };
  } catch (error: any) {
    console.error("[BlockchainService] Error anchoring proof:", error);
    const errorMsg = error.message?.toLowerCase() || "";
    
    // Expose explicit bad formatting if the wallet address string was corrupted
    if (errorMsg.includes("address") || errorMsg.includes("base32")) {
       throw new Error(`The provided wallet address is incorrectly formatted: ${walletAddress}`);
    }

    // Explicitly handle 0-balance overspend (can't pay 0.001 ALGO transaction fee)
    if (errorMsg.includes("overspend")) {
       throw new Error("Your Testnet wallet has 0 ALGO and cannot pay the 0.001 ALGO transaction fee. Please fund it using the Algorand Testnet Dispenser (https://bank.testnet.algorand.network) and try again.");
    }

    // Handle user rejection explicitly if it comes from Pera Wallet
    if (errorMsg.includes("reject") || errorMsg.includes("cancel")) {
       throw new Error("Transaction signature was declined by the user in Pera Wallet.");
    }
    throw new Error(error.message || "Failed to anchor proof on chain.");
  }
};

