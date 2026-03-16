<div align="center">
  <img src="https://img.shields.io/badge/Blockchain-Algorand-black?style=for-the-badge&logo=algorand" alt="Algorand" />
  <img src="https://img.shields.io/badge/Tech_Stack-React_%7C_Vite-black?style=for-the-badge&logo=react" alt="React Vite" />
  <img src="https://img.shields.io/badge/Cryptography-zkTLS-black?style=for-the-badge&logo=web3.js" alt="zkTLS" />
  
  <br />
  
  <h1>🛡️ ZK SECURE 🛡️</h1>
  <p><h3>The Global Standard for Private Web2 Data Notarization on Web3</h3></p>
  
  <p>
    ZK Secure is a next-generation decentralized application bridging highly sensitive off-chain data (Web2)
    directly into blockchain smart contracts via fully verifiable Zero-Knowledge proofs (zkTLS).
  </p>
</div>

---

## ⚡ Overview

In the modern Web3 ecosystem, bringing real-world identity and financial data on-chain requires massive trust assumptions. Users traditionally have to hand over their unredacted banking credentials or PII (Personally Identifiable Information) to centralized Oracle APIs. 

**ZK Secure changes this paradigm.**

By utilizing **zkTLS**, users establish a secure connection with a Web2 host (like their bank or digital ID portal) inside a multiparty computation sandbox. An ephemeral zero-knowledge circuit locally evaluates a claim (e.g., *"Does this user have more than $50k in liquidity?"*) and generates a cryptographic proof. The original data is never exposed—only the cryptographic truth is anchored to the Algorand blockchain.

---

## 🚀 Key Features

* **Zero-Knowledge Oracles:** Extract JSON/HTML from Web2 TLS channels and prove assertions locally without leaking the underlying raw text.
* **Algorand L1 Anchoring:** Instantaneous, low-cost verifiable transactions pushed securely using Pera Wallet.
* **Decentralized Verification Modes:**
  * 🏦 **Financial Assets:** Confirm bank liquidity minimums for DeFi whitelist tiering.
  * 🆔 **Digital Identity:** Prove 18+ adulthood via Aadhaar zero-knowledge parsing.
  * 💼 **Professional Tier:** Assert job titles (e.g., "Senior Developer") on LinkedIn.
  * 🌐 **Social Influence:** Verify minimum baseline Twitter/X network follower counts.
* **Cinematic UI/UX:** An immersive, dark-mode cyber-aesthetic built with Framer Motion, customized glassmorphism, and responsive CSS grids.

---

## 🏛️ System Architecture Workflow

1. **Discovery:** The user connects their primary Algorand Web3 Wallet (`@perawallet/connect`).
2. **TLS Fetch:** The pipeline initializes a secure multiparty proxy handshake to communicate with generic Web2 endpoints.
3. **Local Prover:** The retrieved payload undergoes client-side Zero-Knowledge evaluation (`snarkjs` / `circom`), filtering out noise and maintaining only the logical cryptographic constraint.
4. **Blockchain Anchor:** A signed payload confirming the truth threshold is dispatched directly to the Algorand blockchain as an immutable verification block.

---

## 🛠️ Tech Stack

| Domain | Technology |
| --- | --- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Blockchain/Web3** | Algorand SDK (`algosdk`), Pera Wallet Connect API |
| **Animation Engine** | Framer Motion |
| **Styling** | Vanilla CSS, Tailwind CSS Utility Concepts, Glassmorphic overlays |
| **Cryptography (Simulated)** | Circom, SnarkJS |

---

## 💻 Getting Started

### Prerequisites
* Node.js v19+
* NPM or Yarn
* [Pera Wallet Mobile App](https://perawallet.app/) for transaction signing 

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShreethanKagitha/zksecure.git
   cd zksecure
   ```

2. **Install exact dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Spin up the development server**
   ```bash
   npm run dev
   ```

4. **Web3 Setup:**
   Ensure your Pera Wallet mobile app is configured to **TestNet** (Settings > Developer Settings > Node Settings) before scanning the WalletConnect QR code.

---

## ☁️ Production Deployment

This frontend is optimized for seamless zero-configuration deployments on Vercel Edge networks.

1. Install the Vercel CLI locally (if not attached to Git workflows):
   ```bash
   npm i -g vercel
   ```
2. Build and push to production:
   ```bash
   npx vercel --prod
   ```

---

## 🔒 Security Assumptions & Roadmap

*Currently, this interface functions as a high-fidelity MVP dashboard to simulate the user experience of deploying zkTLS assertions natively. In production environments, the fetch-client relies on immutable cloud executions (such as AWS Nitro Enclaves or TEEs) combined with Multi-Party Computation nodes to completely prevent client-side data tampering before the Circom evaluation.*

<div align="center">
  <br/>
  <b>Built for the Future of Decentralized Privacy</b>
</div>
