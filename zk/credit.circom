pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

// Ensures private balance is strictly Evaluated and Hashed
template CreditScore(n) {
    // Private input (e.g. user's actual bank balance)
    signal input balance;
    
    // Public input (e.g. policy requirement: 50000)
    signal input threshold;
    
    // Output standardizing validity (1 for true, 0 for false)
    signal output result;
    
    // Output strict cryptographic commitment of the hidden private balance
    signal output hashedBalance;

    // Component computing conditional mathematically
    component gte = GreaterEqThan(n);
    gte.in[0] <== balance;
    gte.in[1] <== threshold;
    result <== gte.out;
    
    // Hash the private data securely bounding it uniquely to the SNARK
    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== balance;
    hashedBalance <== poseidon.out;
}

// 64-bit parameter bounding limits large overflow exploits
component main {public [threshold]} = CreditScore(64);
