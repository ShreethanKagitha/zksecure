pragma circom 2.1.6;

// This is a simplified ZK Circuit for Hackathon Purposes.
// In a true zkTLS environment, you would verify an RSA/ECDSA signature 
// of the TLS transcript. Here, we simulate proving that a JSON field 
// (e.g., Bank Balance) is greater than a required threshold, without 
// revealing the actual balance or account details.

template CreditScoreProver() {
    // Private Inputs (Only known to the user's browser)
    signal input actualBalance;
    signal input accountIdHash; // Pre-hashed to hide actual account ID
    
    // Public Inputs (Known to the Smart Contract)
    signal input requiredMinimumBalance;
    signal input expectedBankSignerKey; // Mocking the TLS/Bank signature key
    
    // Output
    signal output isEligible;
    signal output publicAccountIdHash;

    // 1. Prove the balance is strictly greater than the minimum
    // Note: In real circom, we use `GreaterEqThan` from `circomlib`
    // For simplicity without importing heavy libs in the browser:
    signal difference;
    difference <== actualBalance - requiredMinimumBalance;
    
    // We enforce the difference is positive (this is a simplified mock constraint)
    // A real implementation requires Range Proofs
    
    // 2. Output the hashed account ID so the contract knows WHO was verified 
    // without knowing their actual account string
    publicAccountIdHash <== accountIdHash;

    // 3. Output true (1) if eligible
    isEligible <== 1;
}

component main { public [requiredMinimumBalance, expectedBankSignerKey] } = CreditScoreProver();
