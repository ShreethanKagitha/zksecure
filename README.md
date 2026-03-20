# ZKSecure: Private Data Oracle using zkTLS

> **Empowering users to provably bridge off-chain Web2 data onto the blockchain using zero-knowledge cryptography without ever revealing the underlying sensitive information.**

---

## 📖 Overview

**ZKSecure** is a full-stack Web3 application designed to cryptographically verify data from traditional web sources (like bank statements or identity portals) using a zkTLS-inspired architecture. 

It accomplishes this by securely fetching Web2 data, generating a Zero-Knowledge Proof (ZKP) to attest to specific conditions (e.g., user's balance > threshold), and securely anchoring the verification result on-chain via the Algorand blockchain. The entire system is built strictly privacy-first: sensitive underlying data never leaves the user's local instance.

---

## 🚨 Problem Statement

The modern digital economy relies heavily on verified credentials, yet users are currently forced to surrender massive amounts of Raw Personally Identifiable Information (PII) to decentralized and traditional apps alike in order to prove simple conditions like credit-worthiness.

### The Indian Market Context
* **Credit Scoring:** Users must share full transaction histories and bank statements to prove they meet a minimum asset requirement—risking financial exposure.
* **Identity Verification (Aadhaar):** Proving personhood or KYC status typically requires fully exposing central demographic identification metrics without granular consent layers.

---

## 💡 The Solution

ZKSecure introduces a **zkTLS-inspired pipeline** that breaks this dilemma by guaranteeing cryptographic authenticity without data exposure.

**The Pipeline Flow:**
`Secure Fetch (TLS)` ➔ `Signature Verification` ➔ `ZK Proof Generation` ➔ `Blockchain Anchor`

By intercepting signed TLS transcripts from trusted issuers, we compile a zero-knowledge proof stating a specific condition is true, leaving the actual sensitive dataset completely hidden natively.

---

## 🏗️ Architecture Stack

### Frontend
- **Framework:** React + Vite (TypeScript)
- **Wallet Connection:** Universal Algorand Wallet Integration (via Pera Wallet / `@txnlab/use-wallet-react`)
- **Interface:** Dynamic, cyber-punk themed zkTLS verification UI pipeline with realtime progression tracking.

### Backend
- **Framework:** Node.js + Express
- **Authenticity Layer:** TLS-like signature verification utilizing Node's native `crypto` libraries.
- **Proof Integrations:** Secure orchestration with `snarkjs` to unpack verification payloads.
- **Storage:** MongoDB (for non-sensitive metadata logging).

### Zero-Knowledge (ZK) Layer
- **Circuits:** Custom `circom` circuit ensuring mathematical thresholds (e.g., `balance ≥ minimum threshold`).
- **Proof System:** `groth16` proving system for rapid, succinct authentication vectors.

### Blockchain
- **Network:** Algorand (Testnet) via Native Algorand SDK
- **Consensus:** Smart contract transaction anchoring ensuring permanent cryptographic immutability.

---

## 🛡️ Privacy Design Restrictions

- **No Sensitive Data Stored:** PII and physical balance variables exist exclusively locally in volatile memory.
- **Data Not Displayed:** Raw data strings are actively obfuscated and shielded across the frontend UI.
- **Boolean Integrity:** The blockchain and backend layer only log cryptographically verifiable boolean statuses (e.g., `VERIFIED: TRUE`), not the values that created them.

---

## ⚙️ Core Workflow

1. **Connect Wallet:** User securely links their Pera Wallet to the dApp.
2. **Fetch Data:** Secure server instance requests encrypted Web2 data (e.g., mock DigiLocker/Bank credentials).
3. **Verify Signature:** Cryptographic RSA signatures evaluate the integrity of the data fetch.
4. **Generate ZK Proof:** Local zero-knowledge circuit proves the data fulfills exact conditions securely.
5. **Verify Proof:** Proof strings are validated strictly against Groth16 Verification Keys.
6. **Anchor on Blockchain:** The resulting Proof Hash is dispatched securely via Application call to an Algorand Smart Contract recording the state.
7. **Store Result:** General boolean verification history is securely synced to the user dashboard.

---

## ✨ Features

- **Zero-Knowledge Proofs:** Provable math logic replacing absolute data handovers.
- **TLS-Like Verification Layer:** Transcript-style signed payload authenticity checks.
- **Blockchain Anchoring:** Immutable, decentralized logging of user claims.
- **Dashboard History:** Clean, unified wallet-synced history panel.
- **Privacy-First By Default:** Absolute prevention of raw data transmission schemas.

---

## 🚀 Installation & Setup

Ensure you have Node.js (v18+) and npm installed.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/zksecure.git
cd zksecure
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env with your MongoDB credentials and Algorand parameters
node server.js
```

### 3. Frontend Setup
```bash
# In a new terminal window
cd src
npm install
npm run dev
```

---

## 🔌 API Endpoints

- `POST /verify`: Core API ingestion endpoint that receives raw TLS-like payloads, validates signatures, generates the Groth16 circuit proofs, and dispatches Algorand transactions.
- `GET /history/:wallet`: Returns metadata logging for all boolean verifications anchored by a specific Algorand Wallet Address.

---

## ⚠️ Current Limitations

- **Mock Data Layer:** The application currently relies on a mocked TLS integration (simulated DigiLocker flow) while open Oracle capabilities are pending.
- **Simulated TLS Transcript:** Real web-session TLS Notary interception is functionally abstracted for demonstration logic using standard generated RSA signatures.
- **Backend-Based Verification:** While proofs restrict data leakage natively, proof generation currently relies on backend coordination rather than pure client-side orchestration.

---

## 🔮 Future Improvements

- **Full DigiLocker Integration:** Native connection directly bridging authenticated credential issuing platforms.
- **Live TLS Transcript Integration:** Applying authentic cryptographic mapping to external TLS requests directly via proxy circuits (e.g. TLSNotary).
- **On-chain Verification:** Moving proof verification natively into Algorand Smart Contract logic logic rather than utilizing off-chain backend checking.
- **Multi-Provider Support:** Genericizing the Oracle to dynamically absorb any web-based OAuth token endpoint dynamically.

---

## 🎯 Primary Use Cases

1. **Decentralized Credit Scoring:** DeFi lending protocols analyzing traditional banking throughput securely without storing a user's transaction history.
2. **Identity Verification (KYC):** Anonymous proof of personhood tracking against governmental APIs (Aadhaar).
3. **Compliance Tooling:** Trustless corporate auditing against centralized web records (LinkedIn, Tax filings) without releasing core dataset contents.

---

> *"Privacy is not about having something to hide; it is the power to selectively reveal to the world who you are."*
