import { useState } from 'react';
import { ShieldAlert, Database, FileDigit, Cpu, CheckCircle, AlertTriangle, ArrowLeft, Briefcase, Share2, Check, Zap, Globe, Lock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateCreditScoreProof } from '../lib/zkProver';
import type { ZKResponse } from '../lib/zkProver';
import { fetchWeb2BankData } from '../lib/web2DataService';

import { relayProofToBlockchain } from '../lib/oracleService';
import { Terminal } from './Terminal';

const PROVIDERS = [
  { id: 'bank', name: 'Financial Assets', icon: Database, color: 'var(--primary)', description: 'Verify liquidity > ₹50,000 via HDFC bank session' },
  { id: 'aadhaar', name: 'Digital Identity', icon: ShieldAlert, color: 'var(--primary)', description: 'Prove 18+ personhood without revealing PII' },
  { id: 'linkedin', name: 'Professional Tier', icon: Briefcase, color: 'var(--primary)', description: 'Verify "Senior Developer" status at top-tier org' },
  { id: 'twitter', name: 'Social Influence', icon: Share2, color: 'var(--primary)', description: 'Verify >10k follower count for influencer access' },
];

interface Provider {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

interface ZkOracleInterfaceProps {
  walletAddress: string;
  onComplete: () => void;
  onBackToDashboard: () => void;
}

export function ZkOracleInterface({ walletAddress, onComplete, onBackToDashboard }: ZkOracleInterfaceProps) {
  const [step, setStep] = useState('select'); // select, fetching, proving, submitting, done
  const [provider, setProvider] = useState<Provider | null>(null);
  const [progress, setProgress] = useState(0);
  const [balanceInput, setBalanceInput] = useState('65000');
  const [zkResult, setZkResult] = useState<ZKResponse | null>(null);
  const [onChainId, setOnChainId] = useState<string | null>(null);

  const handleSelect = (p: Provider) => {
    setProvider(p);
    runPipeline();
  };

  const runPipeline = async () => {
    try {
      // 1. FETCHING STAGE
      setStep('fetching');
      setProgress(0);
      console.log(`[PIPELINE] Starting FETCHING. balanceInput: "${balanceInput}"`);
      
      const fetchInterval = setInterval(() => setProgress(prev => Math.min(prev + 5, 95)), 50);
      
      const bankData = await fetchWeb2BankData(Number(String(balanceInput).replace(/[^\d]/g, "")));
      clearInterval(fetchInterval);
      setProgress(100);
      console.log(`[PIPELINE] FETCHED:`, bankData);
      await new Promise(r => setTimeout(r, 600));

      // 2. PROVING STAGE
      setStep('proving');
      setProgress(0);
      const threshold = 50000;
      const actualBalance = Number(String(balanceInput).replace(/[^\d]/g, ""));
      
      console.log(`[PIPELINE] Starting PROVING. UI thinks: Bal=${actualBalance}, Thresh=${threshold}`);
      
      const proveInterval = setInterval(() => setProgress(prev => Math.min(prev + 3, 95)), 50);
      const result = await generateCreditScoreProof(actualBalance, threshold);
      clearInterval(proveInterval);
      setProgress(100);
      setZkResult(result);
      
      console.log(`[PIPELINE] PROVER REFLECTED INPUTS:`, result.inputs);
      console.log(`[PIPELINE] PROVER STATUS: ${result.verificationStatus}`);

      if (result.verificationStatus !== 'SUCCESS') {
        console.error(`[PIPELINE] Verification Failed! Status: ${result.verificationStatus}, Error: ${result.error}`);
        setStep('error');
        return;
      }
      await new Promise(r => setTimeout(r, 600));

      // 3. SUBMITTING STAGE
      setStep('submitting');
      setProgress(0);
      
      const localWallet = localStorage.getItem("walletAddress");
      const activeWalletAddress = localWallet && localWallet !== "null" && localWallet !== "undefined" ? localWallet : walletAddress;
      
      console.log("Anchoring proof with wallet:", activeWalletAddress);
      
      if (!activeWalletAddress || activeWalletAddress === "null" || activeWalletAddress === "undefined") {
        throw new Error("Please connect your Pera Wallet before anchoring the proof.");
      }
      
      const submitInterval = setInterval(() => setProgress(prev => Math.min(prev + 2, 95)), 50);
      const relayResult = await relayProofToBlockchain(activeWalletAddress, result);
      clearInterval(submitInterval);
      
      console.log(`[PIPELINE] RELAY RESULT:`, relayResult);

      if (relayResult.success && relayResult.onChainTxId) {
        setOnChainId(relayResult.onChainTxId);
        setProgress(100);
        await new Promise(r => setTimeout(r, 600));
        setStep('done');
      } else {
        console.error(`[PIPELINE] Relay Failed: ${relayResult.error}`);
        // Ensure the error is bubbled to the UI by mocking a failure on zkResult
        setZkResult(prev => ({ 
            ...prev, 
            proof: prev?.proof, 
            publicSignals: prev?.publicSignals, 
            verificationStatus: 'ERROR', 
            error: relayResult.error || "Relay to blockchain failed" 
        }));
        setStep('error');
      }
    } catch (error: any) {
       console.error("[PIPELINE] Fatal Exception Caught:", error);
       setZkResult(prev => ({ 
           ...prev, 
           proof: prev?.proof, 
           publicSignals: prev?.publicSignals, 
           verificationStatus: 'ERROR', 
           error: error.message || "An unexpected error occurred during the pipeline execution." 
       }));
       setStep('error');
    }
  };

  return (
    <div className="animate-in w-full">
      <div className="flex-row items-center gap-6 mb-10">
        <button className="btn btn-secondary" onClick={onBackToDashboard} style={{ padding: '0', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 style={{ marginBottom: '0.25rem', fontSize: '2rem', fontWeight: 800 }}>Secure Data Probe</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>OPERATION: {step.toUpperCase()}</p>
        </div>
      </div>

      <div className="glass-card w-full" style={{ maxWidth: '900px', margin: '0 auto', padding: '3.5rem' }}>
        {step === 'select' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Initiate Oracle Probe</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Define the parameters for your zero-knowledge TLS attestation.</p>
            </div>
            
            <div className="mx-auto" style={{ maxWidth: '500px', textAlign: 'left', marginBottom: '3.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={16} color="var(--primary)" /> MOCK SESSION DATA (BANK BALANCE)
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                   type="number" 
                   value={balanceInput}
                   onChange={e => setBalanceInput(e.target.value)}
                   style={{
                     width: '100%',
                     padding: '1.25rem 1.5rem',
                     borderRadius: '16px',
                     border: '1px solid var(--glass-border)',
                     background: 'rgba(5, 5, 5, 0.6)',
                     color: '#fff',
                     fontSize: '1.25rem',
                     fontWeight: 700,
                     fontFamily: 'JetBrains Mono, monospace',
                     outline: 'none',
                     boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                   }}
                />
                <span style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: '1rem', fontWeight: 800 }}>
                  ₹ INR
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: 'var(--text-dim)', background: 'rgba(108, 59, 255, 0.05)', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                <strong>Probe Rule:</strong> Prover will only generate a valid attestation if the balance exceeds the ₹50,000 baseline.
              </p>
            </div>

            {!walletAddress && (
              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#ef4444', textAlign: 'center', fontWeight: 600 }}>
                Please connect a Pera Wallet to anchor the proof.
              </div>
            )}

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
              {PROVIDERS.map(p => (
                <button 
                  key={p.id}
                  className="glass-card"
                  onClick={() => {
                    if (walletAddress) handleSelect(p);
                  }}
                  style={{ 
                    flexDirection: 'column', 
                    padding: '2rem',
                    gap: '1.5rem',
                    height: '100%',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    cursor: walletAddress ? 'pointer' : 'not-allowed',
                    opacity: walletAddress ? 1 : 0.5,
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
                    EXECUTE PROBE <Zap size={12} fill="currentColor" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {(step === 'fetching' || step === 'proving' || step === 'submitting') && (
          <div style={{ padding: '0' }}>
            {/* Animated Generation Pipeline */}
            <div style={{ marginBottom: '4rem', position: 'relative' }}>
              <div className="steps-container" style={{ maxWidth: '100%', padding: '0' }}>
                <div className="steps-progress-line" style={{ 
                  width: step === 'fetching' ? '15%' : step === 'proving' ? '50%' : '85%',
                  left: '7%'
                }}></div>
                
                {[
                  { id: 'fetching', label: 'TLS Fetch', icon: Globe },
                  { id: 'proving', label: 'Local Prover', icon: Cpu },
                  { id: 'submitting', label: 'Anchor', icon: Lock }
                ].map((s) => {
                  const isPast = (step === 'proving' && s.id === 'fetching') || (step === 'submitting' && (s.id === 'fetching' || s.id === 'proving'));
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
                    {step === 'fetching' && 'Connecting via MPC handhake...'}
                    {step === 'proving' && 'Executing Local Circom Circuit...'}
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
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Probe Rejected</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 3.5rem auto', fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              The zero-knowledge proof generation or network relay failed. <br />
              <strong style={{ color: 'var(--primary)', marginTop: '1rem', display: 'block' }}>
                {zkResult?.error || `Retrieved Balance ₹${Number(String(balanceInput).replace(/[^\d]/g, ""))} is less than required ₹50,000.`}
              </strong>
            </p>
            <button className="btn btn-secondary" onClick={() => setStep('select')} style={{ padding: '1rem 3rem' }}>
              <ArrowLeft size={18} /> Modify Probe Parameters
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
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Proof Anchored Successfully</h2>
            <p style={{ marginBottom: '3.5rem', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              Success. Your private web session has been cryptographically notarized. The zk-proof is now anchored to the global trust layer.
            </p>
            
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
                      href={`https://testnet.algoexplorer.io/tx/${onChainId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                    >
                      <ExternalLink size={14} /> View on AlgoExplorer
                    </a>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dim)' }}>PROOF VALIDITY</span>
                <span className="status-pill status-success" style={{ padding: '0.4rem 1.2rem' }}>AUTHENTICATED</span>
              </div>
              {zkResult && (
                <div style={{
                  background: '#000',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  fontSize: '0.85rem',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  border: '1px solid var(--glass-border)'
                }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                    <FileDigit size={16} /> RAW ZK-PROOF PAYLOAD
                  </div>
                  <div className="zk-code-block" style={{ opacity: 0.6, color: '#a5b4fc' }}>
                    {JSON.stringify(zkResult, null, 2)}
                  </div>
                </div>
              )}
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
