import { useState, useRef, useEffect } from 'react';
import { AlertOctagon, CheckCircle, Database } from 'lucide-react';

export default function SybilSimulator() {
  const [logs, setLogs] = useState<{type: string, text: string}[]>([]);
  const [step, setStep] = useState(0); 
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (type: string, text: string, delay: number = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setLogs(prev => [...prev, { type, text }]);
        resolve(true);
      }, delay);
    });
  };

  const runWalletA = async () => {
    setStep(1);
    setLogs([]);
    await addLog('info', '> INITIALIZING CONNECTION TO DIGILOCKER ORACLE...', 500);
    await addLog('dim', '  Fetching signature and cryptographic payload...', 800);
    await addLog('success', '> TLS HANDSHAKE SUCCESSFUL! Payload Received.', 800);
    await addLog('info', '> Generating Zero-Knowledge Nullifier from Biological Hash + App Salt...', 1000);
    await addLog('dim', '  Hash(IdentityData + Issuer + Salt) -> 0xAB98F1E...', 1200);
    await addLog('info', '> Checking Protocol Database for Nullifier: 0xAB98F1E...', 800);
    await addLog('success', '> NULLIFIER IS CLEAN. NO PREVIOUS IDENTITIES FOUND.', 1200);
    await addLog('success', '==============================================', 200);
    await addLog('success', '✅ VERIFICATION PASSED: AIRDROP TOKENS SECURELY CLAIMED TO WALLET A', 200);
    setStep(2);
  };

  const runWalletB = async () => {
    setStep(3);
    await addLog('info', '', 1000);
    await addLog('warning', '> ATTACK INITIATED: User attempting to re-use identical DigiLocker credentials on a completely new Wallet...', 500);
    await addLog('info', '> INITIALIZING CONNECTION TO DIGILOCKER ORACLE...', 800);
    await addLog('success', '> Payload dynamically intercepted. Generating cryptographic identity nullifier...', 1000);
    await addLog('warning', '  Hash(IdentityData + Issuer + Salt) -> 0xAB98F1E...', 1200);
    await addLog('info', '> Cross-referencing Protocol Registry Nodes...', 800);
    await addLog('warning', '> !! CRITICAL EXCEPTION TRIGGERED !!', 1500);
    await addLog('warning', '> FATAL COLLISION: Nullifier [0xAB98F1E] inherently linked to another active wallet!', 500);
    await addLog('warning', '==============================================', 200);
    await addLog('warning', '🚫 SYBIL ATTACK BLOCKED: IDENTITY ALREADY MINED', 200);
    setStep(4);
  };

  return (
    <div className="w-full animate-in flex-col gap-8" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
          Sybil Attack <span style={{ color: '#ef4444' }}>Defense Simulator</span>
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '900px', margin: '0 auto', lineHeight: 1.6 }}>
          Watch how mathematically guaranteed <strong style={{ color: 'white' }}>zkTLS Nullifiers</strong> actively prevent malicious actors from reusing the same Web2 identity across hundreds of Web3 wallets to drain protocol airdrops.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '3rem', marginBottom: '2rem' }}>
        {/* Wallet A */}
        <div className="glass-card" style={{ border: step >= 1 ? '1px solid rgba(16, 185, 129, 0.4)' : undefined, boxShadow: step >= 2 ? '0 0 40px rgba(16, 185, 129, 0.1)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Attacker: Wallet A</h3>
            <div className="status-pill status-active" style={{ fontSize: '0.7rem' }}>NEW SESSION</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', fontFamily: 'monospace', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
               <span>ADDRESS:</span>
               <span style={{ color: 'white', fontWeight: 600 }}>0x1F...9A42</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span>WEB2 ID PAYLOAD:</span>
               <span style={{ color: 'var(--primary)', fontWeight: 600 }}>DigiLocker-Auth-v1</span>
            </div>
          </div>
          <button 
             className="btn btn-primary w-full"
             onClick={runWalletA}
             disabled={step !== 0}
             style={{ 
               opacity: step !== 0 ? 0.5 : 1, 
               padding: '1.25rem', 
               background: step >= 2 ? 'rgba(16, 185, 129, 0.15)' : undefined, 
               color: step >= 2 ? '#10b981' : undefined,
               border: step >= 2 ? '1px solid rgba(16, 185, 129, 0.4)' : undefined,
               boxShadow: step >= 2 ? 'none' : undefined
             }}
          >
            {step >= 2 ? <><CheckCircle size={20} /> AirDrop Claimed</> : '1. Connect & Claim Airdrop'}
          </button>
        </div>

        {/* Wallet B */}
        <div className="glass-card" style={{ border: step >= 4 ? '1px solid rgba(239, 68, 68, 0.5)' : undefined, boxShadow: step >= 4 ? '0 0 40px rgba(239, 68, 68, 0.15)' : undefined }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Attacker: Wallet B</h3>
            <div className="status-pill status-active" style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>MALICIOUS</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', fontFamily: 'monospace', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
               <span>ADDRESS:</span>
               <span style={{ color: 'white', fontWeight: 600 }}>0x8C...B592</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span>WEB2 ID PAYLOAD:</span>
               <span style={{ color: '#ef4444', fontWeight: 600 }}>DigiLocker-Auth-v1 <span style={{ opacity: 0.6 }}>(RE-USED)</span></span>
            </div>
          </div>
          <button 
             className="btn w-full"
             onClick={runWalletB}
             disabled={step !== 2}
             style={{ 
               padding: '1.25rem', 
               background: 'rgba(239, 68, 68, 0.1)', 
               border: '1px solid rgba(239, 68, 68, 0.4)', 
               color: '#ef4444', 
               opacity: step !== 2 ? 0.3 : 1, 
               transition: 'all 0.3s ease',
               cursor: step !== 2 ? 'not-allowed' : 'pointer'
             }}
          >
            {step >= 4 ? <><AlertOctagon size={20} /> Access Denied By Protocol</> : '2. Execute Sybil Attack'}
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
        <Database size={20} color="var(--primary)" /> Smart Contract Execution Node Monitor
      </h3>
      <div className="terminal" style={{ minHeight: '350px' }}>
        {logs.length === 0 && <span className="terminal-line dim">Awaiting execution commands from Web3 clients...</span>}
        {logs.map((log, i) => (
          <div key={i} className={`terminal-line ${log.type}`}>
             {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
