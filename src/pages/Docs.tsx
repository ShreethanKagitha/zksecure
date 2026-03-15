import { Shield, Book, Layout, Lock, ArrowLeft, Terminal, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Docs() {
  return (
    <div className="container animate-in">
      <div style={{ marginBottom: '4rem' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={18} /> Back to Hub
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(225, 29, 72, 0.2)' }}>
            <Book size={32} color="var(--primary)" />
          </div>
          <h1 style={{ margin: 0, fontSize: '3.5rem' }}>Documentation</h1>
        </div>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', maxWidth: '700px' }}>
          Technical specifications and integration guides for the ZKSECURE zkTLS Oracle.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '4rem' }}>
        {/* Sidebar Mini-Nav */}
        <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="#overview" className="nav-link" style={{ display: 'block' }}>Overview</a>
              <a href="#architecture" className="nav-link" style={{ display: 'block' }}>Architecture</a>
              <a href="#demo-flow" className="nav-link" style={{ display: 'block' }}>Demo Flow</a>
              <a href="#tech-stack" className="nav-link" style={{ display: 'block' }}>Technology Stack</a>
              <a href="#security" className="nav-link" style={{ display: 'block' }}>Security Model</a>
            </nav>
          </div>
        </aside>

        {/* Console Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          
          <section id="overview">
            <h2 className="card-title"><Shield size={24} color="var(--primary)" /> Overview</h2>
            <div className="glass-card">
              <p>
                ZKSECURE is a generalized zkTLS oracle that enables users to prove off-chain Web2 data (banking, social, identity) to on-chain smart contracts without revealing private credentials or PII (Personally Identifiable Information).
              </p>
              <p style={{ marginTop: '1rem' }}>
                Leveraging Zero-Knowledge Proofs and Multi-Party Computation, we bridge the trust gap between legacy web protocols and decentralized networks.
              </p>
            </div>
          </section>

          <section id="architecture">
            <h2 className="card-title"><Layout size={24} color="var(--primary)" /> Architecture</h2>
            <div className="glass-card">
              <p style={{ marginBottom: '2rem' }}>The protocol operates on a three-party model involving the User, the Data Source, and a decentralized Verifier/Relay node.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
                  <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>1. MPC-TLS Handshake</h4>
                  <p style={{ fontSize: '0.9rem' }}>A distributed TLS handshake is performed between the user's browser and a relay node. This splits the session keys so neither party can decrypt the traffic alone.</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
                  <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>2. Client-Side Proving</h4>
                  <p style={{ fontSize: '0.9rem' }}>The user's device generates a Groth16 ZK-Proof locally using SnarkJS. This proof confirms that a specific string (e.g., "balance: 95000") exists within the TLS-encrypted stream.</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
                  <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>3. On-Chain Verification</h4>
                  <p style={{ fontSize: '0.9rem' }}>The concise proof is submitted to an Algorand smart contract which verifies the cryptographic signature and anchors the result.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="demo-flow">
            <h2 className="card-title"><Terminal size={24} color="var(--primary)" /> Demo Flow</h2>
            <div className="terminal">
              <div className="terminal-line info">INIT: Starting zkTLS session for "HDFC_BANK_PROBE"</div>
              <div className="terminal-line">FETCH: Connecting to hdfc.com via MPC-Relay...</div>
              <div className="terminal-line success">DONE: Encrypted response received (Length: 14kb)</div>
              <div className="terminal-line info">PROVE: Compiling constraints for balance_threshold &gt; 50k</div>
              <div className="terminal-line info">PROVE: Executing local WASM circuit...</div>
              <div className="terminal-line success">READY: Groth16 Proof Generated (0.8s)</div>
              <div className="terminal-line info">SUBMIT: Anchoring to Algorand Testnet...</div>
              <div className="terminal-line success">ANCHORED: TxId: 0x8a7f...e3b4</div>
            </div>
          </section>

          <section id="tech-stack">
            <h2 className="card-title"><Cpu size={24} color="var(--primary)" /> Technology Stack</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div className="stat-card">
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Circom 2.1</h4>
                <p style={{ fontSize: '0.85rem' }}>Arithmetic circuits for verifying TLS HMACs and padding logic.</p>
              </div>
              <div className="stat-card">
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>SnarkJS</h4>
                <p style={{ fontSize: '0.85rem' }}>Browser-based prover for high-performance proof generation.</p>
              </div>
              <div className="stat-card">
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Algorand SDK</h4>
                <p style={{ fontSize: '0.85rem' }}>Layer-1 anchoring and on-chain contract state management.</p>
              </div>
              <div className="stat-card">
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Vite + React</h4>
                <p style={{ fontSize: '0.85rem' }}>Ultra-fast frontend with cyberpunk GLSL-inspired UI.</p>
              </div>
            </div>
          </section>

          <section id="security">
            <h2 className="card-title"><Lock size={24} color="var(--primary)" /> Security Model</h2>
            <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <li style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 900 }}>[01]</div>
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>End-to-End Encryption</h4>
                    <p style={{ fontSize: '0.95rem' }}>The relay node never sees the plaintext data. The MPC protocols ensure that the decryption key is only fully assembled inside the ZK-Circuit environment.</p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 900 }}>[02]</div>
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Zero Trace</h4>
                    <p style={{ fontSize: '0.95rem' }}>No session cookies or passwords ever leave the user's browser. We only notarize the results of computation, not the raw inputs.</p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 900 }}>[03]</div>
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Auditable Provers</h4>
                    <p style={{ fontSize: '0.95rem' }}>All Circom circuits are open-source and undergo mathematical verification to ensure no backdoors exist in the proof logic.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
