import { anchorProofOnChain } from './blockchainService';
import type { ZKResponse } from './zkProver';

export interface OracleRelayResult {
  success: boolean;
  onChainTxId?: string;
  error?: string;
}

/**
 * Acts as the Oracle layer that receives a ZK-Proof from the client,
 * validates its structure, and relays it to the blockchain.
 */
export const relayProofToBlockchain = async (
  walletAddress: string,
  zkData: ZKResponse
): Promise<OracleRelayResult> => {
  console.log("[OracleService] Received ZK-Proof payload. Validating proof structure...");
  
  // Simulate Oracle validation (checking if proof is valid before wasting gas)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (zkData.verificationStatus !== 'SUCCESS') {
    return { success: false, error: "Invalid Proof provided to Oracle" };
  }

  try {
    const result = await anchorProofOnChain(walletAddress, zkData.proof, zkData.publicSignals);
    return {
      success: true,
      onChainTxId: result.txId
    };
  } catch (e: any) {
    console.error("[OracleService] Relay failed with error:", e);
    return { success: false, error: e?.message || "Blockchain anchor failed" };
  }
};
