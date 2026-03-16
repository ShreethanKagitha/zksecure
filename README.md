# ZK Secure - Private Data Oracle

ZK Secure is a decentralized application bridging real-world, private Web2 data into Web3 via fully verifiable Zero-Knowledge proofs (zkTLS). It enables users to verify highly sensitive metrics—such as their personal bank balances, identity documents, and professional credentials—without ever natively revealing their passwords, login tokens, or unredacted financial information on-chain.

## The Architecture
1. **Discovery**: Authenticate and configure cryptographic constraints locally.
2. **TLS Fetch**: Secure multiparty computation handshake extracts encrypted web responses inside a local sandbox.
3. **Local Prover**: An ephemeral Circom circuit generates a snarkjs truth-proof affirming the logic constraint (e.g. Account Balance > $5,000).
4. **Blockchain Anchor**: The generated truth-value is instantly notarized as a transaction hash to the Algorand Blockchain via Pera Wallet.

## Supported Verification Modules
* **Financial Assets**: Confirm bank liquidity minimums for whitelist tiering.
* **Digital Identity**: Prove 18+ adulthood via Aadhaar zero-knowledge parsing.
* **Professional Tier**: Assert specific title classifications on LinkedIn.
* **Social Influence**: Verify minimum baseline Twitter network followers.

## Tech Stack
* **Vite + React (TypeScript)**
* **Framer Motion** - Cinematic animations & cyber-theming
* **Pera Wallet Connect** - Algorand Web3 Signatures
* **AlgoSDK** - L1 Node Connectivity (TestNet API)
* **Tailwind & Vanilla CSS** - Glassmorphic overlays

## Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Production Deployment (Vercel)
Built specifically to natively compile onto Edge services:
```bash
npx vercel --prod
```

## Security Assumptions
This UI dashboard represents a "Mock MVP" implementation of a zkTLS relay. Production implementations require an encrypted AWS Nitro Enclave running a localized proxy to genuinely derive the Web2 TLS handshakes.
