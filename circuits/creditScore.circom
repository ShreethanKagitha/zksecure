pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/comparators.circom";

template VerificationLogic(n) {
    // Hidden private data (from Web2 Banking API)
    // This value is mathematically hashed into the proof and never revealed directly
    signal input actualBalance;
    
    // Public data (what the smart contract and world sees)
    signal input requiredThreshold;
    
    // Output (boolean 1 for true, 0 for false)
    signal output isEligible;

    // Standard Circomlib component evaluating if actualBalance is >= requiredThreshold
    component gte = GreaterEqThan(n);
    
    gte.in[0] <== actualBalance;
    gte.in[1] <== requiredThreshold;
    
    // Bind the result cleanly to the output signal
    isEligible <== gte.out;
    
    // CRITICAL: Force the circuit to aggressively reject any proof generation where isEligible is not 1.
    // This strictly ensures our generated SNARK proofs exclusively represent passing verifications.
    isEligible === 1;
}

// Instantiate the component with max 64-bit bounds to handle huge wallet numbers
component main {public [requiredThreshold]} = VerificationLogic(64);
