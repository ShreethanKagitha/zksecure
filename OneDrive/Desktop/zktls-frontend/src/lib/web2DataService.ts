export interface BankData {
  balance: number;
  currency: string;
  accountHolder: string;
  timestamp: string;
  institution: string;
}

/**
 * Simulates a zkTLS-style fetch where data is pulled from a Web2 API
 * via a proxy or MPC nodes to ensure integrity without trusting the client.
 */
export const fetchWeb2BankData = async (mockBalance: number): Promise<BankData> => {
  console.log("[Web2Service] Initiating TLS handshake with banking endpoint...");
  
  // Simulate network latency for TLS/MPC negotiation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real zkTLS implementation, this would return the raw transcript + signature
  return {
    balance: mockBalance,
    currency: "INR",
    accountHolder: "John Doe (Anonymized)",
    timestamp: new Date().toISOString(),
    institution: "HDFC International"
  };
};
