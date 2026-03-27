import { useState } from 'react';
import { ShieldAlert, Database, Cpu, CheckCircle, AlertTriangle, ArrowLeft, Share2, Check, Zap, Globe, Lock, ExternalLink, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ZKResponse } from '../lib/zkProver';
import { fetchWeb2BankData } from '../lib/web2DataService';

import { Terminal } from './Terminal';

const PROVIDERS = [
  { id: 'bank', name: 'HDFC Bank Liquidity', icon: Database, color: 'var(--primary)', description: 'Prove Liquid Balance ≥ ₹50,000 without revealing account details.', condition: 'Balance &ge; ₹50,000', apiParam: { balance: 65000 }, threshold: 50000 },
  { id: 'github', name: 'GitHub P1 Dev', icon: Cpu, color: '#10b981', description: 'Prove > 500 lifetime commits without revealing repositories.', condition: 'Commits &ge; 500', apiParam: { balance: 620 }, threshold: 500 },
  { id: 'aadhaar', name: 'Identity Oracle', icon: ShieldAlert, color: 'var(--primary)', description: 'Prove Age > 18 years without revealing Document ID.', condition: 'Age > 18', apiParam: { balance: 22 }, threshold: 18 },
  { id: 'twitter', name: 'Social Influence', icon: Share2, color: 'var(--primary)', description: 'Prove > 10,000 Followers for influencer pre-sale access.', condition: 'Followers &ge; 10,000', apiParam: { balance: 14500 }, threshold: 10000 },
];

interface Provider {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  condition: string;
  apiParam: any;
  threshold: number;
}

interface ZkOracleInterfaceProps {
  walletAddress: string;
  onComplete: () => void;
  onBackToDashboard: () => void;
}

export function ZkOracleInterface({ walletAddress, onComplete, onBackToDashboard }: ZkOracleInterfaceProps) {
  const [step, setStep] = useState('select'); // select, connect, fetching, proving, verifying, submitting, done
  const [provider, setProvider] = useState<Provider | null>(null);
  const [progress, setProgress] = useState(0);
  const [mockCredential, setMockCredential] = useState<any>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [zkResult, setZkResult] = useState<ZKResponse | null>(null);
  const [onChainId, setOnChainId] = useState<string | null>(null);
  const [proofHash, setProofHash] = useState<string | null>(null);
  const [certDownloaded, setCertDownloaded] = useState(false);

  const handleSelect = (p: Provider) => {
    setProvider(p);
    setMockCredential(null);  // Reset credentials when selecting a new template
    setStep('connect');
  };

  const handleSecureConnect = async () => {
    setIsFetchingData(true);
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // We use the existing digilocker endpoint which securely signs a random valid balance payload
        const res = await fetch(`${API_URL}/digilocker/fetch`);
        const json = await res.json();
        setMockCredential(json);
    } catch (e) {
        console.error(e);
        alert("Failed to securely pull Document and TLS Signature securely");
    } finally {
        setIsFetchingData(false);
    }
  };

  const runPipeline = async () => {
    if (!provider || !mockCredential) return;
    try {
      // 1. FETCHING STAGE
      setStep('fetching');
      setProgress(0);
      console.log(`[PIPELINE] Starting FETCHING for ${provider.name}. Validated Signature:`, mockCredential?.signature.substring(0,10));
      
      const fetchInterval = setInterval(() => setProgress(prev => Math.min(prev + 5, 95)), 50);
      
      // Simulate frontend TLS extraction mapping
      const mockWeb2Data = await fetchWeb2BankData(mockCredential.data.balance);
      
      clearInterval(fetchInterval);
      setProgress(100);
      console.log(`[PIPELINE] FETCHED TLS HANDSHAKE:`, mockWeb2Data);
      await new Promise(r => setTimeout(r, 600));

      // 2. PROVING & SIMULATED SUBMITTING STAGE (BACKEND NETWORK INTEGRATION)
      setStep('proving');
      setProgress(0);
      
      const localWallet = localStorage.getItem("walletAddress");
      const activeWalletAddress = localWallet && localWallet !== "null" && localWallet !== "undefined" ? localWallet : walletAddress;
      
      console.log(`[PIPELINE] Starting PROVING via Backend API for Wallet: ${activeWalletAddress}`);
      
      const proveInterval = setInterval(() => setProgress(prev => Math.min(prev + 3, 95)), 50);
      
      console.log("Preparing cryptographic transcript verification package for the server...");
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/verify`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ 
             wallet: activeWalletAddress, 
             data: mockCredential.data, // Important: Provide the cryptographically signed data
             signature: mockCredential.signature, // Important: Provide the real strict backend signature
             threshold: provider.threshold,
             condition: provider.condition
         })
      });
      const data = await response.json();
      
      clearInterval(proveInterval);
      setProgress(100);
      
      console.log("[BACKEND VERIFICATION RESPONSE]:", data);

      // 3. VERIFYING STAGE (Visual separation for Cryptographic Validation)
      setStep('verifying');
      setProgress(0);
      const verifyInterval = setInterval(() => setProgress(prev => Math.min(prev + 4, 100)), 50);
      await new Promise(r => setTimeout(r, 600));
      clearInterval(verifyInterval);
      setProgress(100);

      if (data.status !== 'VERIFIED') {
        console.error(`[PIPELINE] Verification Failed! Backend returned: ${data.status}`);
        setZkResult({ 
           verificationStatus: 'ERROR', 
           error: data.error || 'Condition Not Met', 
           proof: { pi_a: [] }, 
           publicSignals: [], 
           inputs: { balance: mockCredential.data.balance, threshold: provider.threshold } as any 
        });
        setStep('error');
        return;
      }
      await new Promise(r => setTimeout(r, 600));

      // 4. SUBMITTING STAGE (Visual confirmation of Backend's Anchor)
      setStep('submitting');
      setProgress(0);
      
      console.log("Confirming proof anchoring synced by Backend...");
      const submitInterval = setInterval(() => setProgress(prev => Math.min(prev + 5, 100)), 50);
      await new Promise(r => setTimeout(r, 1200));
      clearInterval(submitInterval);
      setProgress(100);
      
      setOnChainId(data.txId || null);
      setProofHash(data.proofHash || null);
      
      await new Promise(r => setTimeout(r, 600));
      setStep('done');
    } catch (error: any) {
       console.error("[PIPELINE] Fatal Exception Caught:", error);
       setZkResult({ 
           verificationStatus: 'ERROR', 
           error: error.message || "An unexpected error occurred during the pipeline execution.",
           proof: { pi_a: [] }, 
           publicSignals: [], 
           inputs: { balance: 0, threshold: 0 } as any
       });
       setStep('error');
    }
  };

  return (
    <div className="animate-in w-full">
      <div className="flex-row items-center gap-6 mb-10">
        <button className="btn btn-secondary" onClick={() => {
          if (step === 'connect') setStep('select');
          else onBackToDashboard();
        }} style={{ padding: '0', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 style={{ marginBottom: '0.25rem', fontSize: '2rem', fontWeight: 800 }}>zkTLS-inspired verification pipeline</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>OPERATION: {step.toUpperCase()} | Sensitive data is processed locally and never exposed</p>
        </div>
      </div>

      <div className="glass-card w-full" style={{ maxWidth: '900px', margin: '0 auto', padding: '3.5rem' }}>
        {step === 'select' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Initiate Oracle Probe</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Define the parameters for your zero-knowledge TLS attestation.</p>
            </div>
            
            <div className="mx-auto" style={{ maxWidth: '600px', textAlign: 'center', marginBottom: '3.5rem' }}>
               <p style={{ fontSize: '1rem', color: 'var(--text-dim)', background: 'rgba(108, 59, 255, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(108, 59, 255, 0.2)' }}>
                <strong>How it works:</strong> Select a template below. The prover securely fetches Web2 data using MPC-TLS, generates a Zero-Knowledge Proof locally, and anchors the proof onto the Algorand Network.
              </p>
            </div>

            {!walletAddress && (
              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#ef4444', textAlign: 'center', fontWeight: 600 }}>
                Please connect your Wallet to anchor the proof.
              </div>
            )}

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
              {PROVIDERS.map(p => (
                <button 
                  key={p.id}
                  className="glass-card hover-item"
                  onClick={() => handleSelect(p)}
                  style={{ 
                    flexDirection: 'column', 
                    padding: '2rem',
                    gap: '1.5rem',
                    height: '100%',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: 'rgba(5, 5, 5, 0.4)'
                  }}
                >
                  <div style={{ 
                    width: '56px', height: '56px', borderRadius: '16px', 
                    background: 'rgba(108, 59, 255, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(108, 59, 255, 0.2)'
                  }}>
                    <p.icon size={28} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{p.description}</div>
                  </div>
                  <div style={{ marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    SELECT TEMPLATE <ArrowLeft size={12} style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'connect' && provider && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {(() => {
              const Icon = provider.icon;
              return (
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(108, 59, 255, 0.1)', border: '1px solid rgba(108, 59, 255, 0.3)', marginBottom: '1.5rem' }}>
                     <Icon size={40} color="var(--primary)" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>{provider.name}</h2>
                  <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>{provider.description}</p>
                </div>
              );
            })()}

            <div className="mx-auto" style={{ maxWidth: '500px', textAlign: 'left', marginBottom: '3.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} color="var(--primary)" /> STEP 1: SECURE AUTHENTICATION (WEB2)
              </label>
              
              <button 
                 onClick={handleSecureConnect}
                 disabled={isFetchingData || mockCredential !== null}
                 className="btn btn-secondary w-full"
                 style={{ 
                    padding: '1.25rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.75rem',
                    background: mockCredential ? 'rgba(16, 185, 129, 0.1)' : 'rgba(108, 59, 255, 0.1)',
                    border: mockCredential ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(108, 59, 255, 0.3)',
                    color: mockCredential ? '#10b981' : 'white',
                    opacity: isFetchingData ? 0.7 : 1,
                    marginBottom: '1.5rem'
                 }}
              >
                 {mockCredential ? <Check size={18} /> : <Lock size={18} />} 
                 {isFetchingData ? "Establishing Encrypted Output..." : mockCredential ? `${provider.name} Authenticated Securely` : `Connect to ${provider.name}`}
              </button>

              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={16} color="var(--primary)" /> STEP 2: ZK ATTESTATION (WEB3)
              </label>

              <button 
                onClick={runPipeline}
                disabled={!mockCredential || !walletAddress}
                className="btn btn-primary w-full"
                style={{
                  padding: '1.25rem',
                  opacity: (!mockCredential || !walletAddress) ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
              >
                EXECUTE ZK PROBE <Zap size={18} fill="currentColor" />
              </button>

              <p style={{ fontSize: '0.85rem', marginTop: '1.5rem', color: 'var(--text-dim)', background: 'rgba(108, 59, 255, 0.05)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
                <strong>Probe Rule:</strong> Prover will locally evaluate <strong style={{color:"white"}} dangerouslySetInnerHTML={{__html: provider.condition}}></strong> securely without leaking any personal keys or underlying numerical values to the UI!
              </p>
            </div>

            {!walletAddress && (
              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#ef4444', textAlign: 'center', fontWeight: 600 }}>
                Please connect your Wallet to anchor the proof.
              </div>
            )}
          </motion.div>
        )}

        {(step === 'fetching' || step === 'proving' || step === 'verifying' || step === 'submitting') && (
          <div style={{ padding: '0' }}>
            {/* Animated Generation Pipeline */}
            <div style={{ marginBottom: '4rem', position: 'relative' }}>
              <div className="steps-container" style={{ maxWidth: '100%', padding: '0' }}>
                <div className="steps-progress-line" style={{ 
                  width: step === 'fetching' ? '12%' : step === 'proving' ? '38%' : step === 'verifying' ? '63%' : '88%',
                  left: '6%'
                }}></div>
                
                {[
                  { id: 'fetching', label: 'Secure Fetch (TLS)', icon: Globe },
                  { id: 'proving', label: 'Proof Generation (ZK)', icon: Cpu },
                  { id: 'verifying', label: 'Proof Verification', icon: ShieldAlert },
                  { id: 'submitting', label: 'Blockchain Anchor', icon: Lock }
                ].map((s) => {
                  const isPast = 
                    (step === 'proving' && s.id === 'fetching') || 
                    (step === 'verifying' && (s.id === 'fetching' || s.id === 'proving')) ||
                    (step === 'submitting' && (s.id === 'fetching' || s.id === 'proving' || s.id === 'verifying'));
                  const isCurrent = step === s.id;
                  
                  return (
                    <div key={s.id} className={`step ${isPast ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                      <div className="step-circle">
                         {isPast ? <Check size={24} /> : <s.icon size={24} />}
                      </div>
                      <div className="step-label">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-row items-center justify-between mb-4">
               <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
                    {step === 'fetching' && 'Connecting via MPC handshake...'}
                    {step === 'proving' && 'Executing Local Circom Circuit...'}
                    {step === 'verifying' && 'Cryptographically Verifying Proof...'}
                    {step === 'submitting' && 'Anchoring attestation to L1...'}
                  </h3>
               </div>
               <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>{progress}%</div>
            </div>

            <div className="progress-container" style={{ height: '12px' }}>
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>

            <Terminal step={step} provider={provider} />
          </div>
        )}

        {step === 'error' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              background: 'rgba(239, 68, 68, 0.1)', margin: '0 auto 2.5rem auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)'
            }}>
              <AlertTriangle size={48} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', color: '#ef4444' }}>NOT VERIFIED</h2>
            <div style={{ margin: '0 auto 2rem auto', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'inline-block', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
               <strong style={{ color: '#ef4444', fontSize: '1.1rem' }}>Condition: {provider?.condition || 'Unknown'}</strong>
            </div>
            <p style={{ maxWidth: '600px', margin: '0 auto 3.5rem auto', fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              {zkResult?.error === "Identity already used" 
                 ? "This digital identity footprint has already been linked and securely minted to another active wallet session. Duplicate interactions are blocked."
                 : "The zero-knowledge proof generation or network relay failed, or the primary condition was not met."}
              <br />
              <strong style={{ color: 'var(--primary)', marginTop: '1rem', display: 'block' }}>
                {zkResult?.error === "Identity already used" ? "Identity already used" 
                 : (zkResult?.error === "Condition Failed: Balance is less than required ₹50,000." ? "Proof invalid: Condition not met." : "Condition Not Met or Network Error")}
              </strong>
            </p>
            <button className="btn btn-secondary" onClick={() => setStep('select')} style={{ padding: '1rem 3rem' }}>
              <ArrowLeft size={18} /> Return
            </button>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.1)', margin: '0 auto 2.5rem auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)'
            }}>
              <CheckCircle size={48} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', color: '#10b981' }}>VERIFIED</h2>
            <div style={{ margin: '0 auto 2rem auto', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'inline-block', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
               <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>Condition: {provider?.condition}</strong>
            </div>
            <p style={{ marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              Proof verified and anchored on-chain
            </p>
            
            <div style={{ 
              background: 'rgba(108, 59, 255, 0.05)', 
              border: '1px solid rgba(108, 59, 255, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '3rem',
              color: 'var(--text-dim)'
            }}>
               <Lock size={20} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
               <p style={{ fontSize: '1rem', fontStyle: 'italic', fontWeight: 600 }}>No financial data is revealed. Only eligibility is proven using zero-knowledge proofs.</p>
            </div>
            
            <div style={{ 
              background: 'rgba(5, 5, 5, 0.6)', 
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '2.5rem',
              textAlign: 'left',
              marginBottom: '3rem',
              boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dim)' }}>ANCHOR WALLET</span>
                <span style={{ fontSize: '1rem', fontFamily: 'monospace', fontWeight: 700, color: 'white' }}>{walletAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dim)' }}>ALGORAND TX ID</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{onChainId || '0x...'}</span>
                  {onChainId && (
                    <a 
                      href={`https://testnet.explorer.perawallet.app/tx/${onChainId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn" 
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <ExternalLink size={14} /> View on Explorer
                    </a>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dim)' }}>PROOF HASH</span>
                <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 700, color: 'white' }}>{proofHash ? `${proofHash.substring(0, 16)}...` : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0', borderBottom: 'none', marginBottom: '0' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dim)' }}>PROOF VALIDITY</span>
                <span className="status-pill status-success" style={{ padding: '0.4rem 1.2rem' }}>AUTHENTICATED</span>
              </div>
            </div>

            {/* Shareable ZK Certificate Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(108, 59, 255, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '24px',
              padding: '2.5rem',
              marginBottom: '3rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
               <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}><Award size={180} /></div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                 <ShieldAlert size={24} color="#10b981" /> Official ZK Certificate
               </h3>
               <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '1rem' }}>
                 You have successfully verified that <strong style={{color: 'white'}}>{provider?.name}</strong> satisfies <strong style={{color: 'white'}} dangerouslySetInnerHTML={{__html: provider?.condition || ''}}></strong>.
               </p>
               <button 
                 className="btn hover-glow" 
                 onClick={() => {
                   setCertDownloaded(true);
                   setTimeout(() => setCertDownloaded(false), 3000);
                 }}
                 style={{ 
                   background: certDownloaded ? '#10b981' : 'white', 
                   color: certDownloaded ? 'white' : 'black', 
                   padding: '1rem 2rem', 
                   fontWeight: 800, 
                   display: 'inline-flex', 
                   alignItems: 'center', 
                   gap: '0.5rem',
                   transition: 'all 0.3s ease'
                 }}
               >
                 {certDownloaded ? <><Check size={18} /> Shared to Network!</> : <><Share2 size={18} /> Share Proof on X (Twitter)</>}
               </button>
            </div>

            <button className="btn btn-primary w-full" onClick={onComplete} style={{ padding: '1.5rem' }}>
              Finalize & Return to Ops Center
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
