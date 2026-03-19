import { History, PlusCircle, ShieldCheck, Database, AlertCircle, Award, ExternalLink, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ProofExplorer } from './ProofExplorer';

interface DashboardProps {
  walletAddress: string;
  onStartVerify: () => void;
}

export function Dashboard({ walletAddress, onStartVerify }: DashboardProps) {
  // State to simulate blockchain response for demo
  const [proofData, setProofData] = useState<{ txId: string, round: number | string, timestamp: string } | null>(null);

  // Mock history data
  const history = [
    { id: 1, type: 'HDFC Balance Check', status: 'Verified', date: '2024-03-12', tx: '0x8a...f1' },
    { id: 2, type: 'Aadhaar Personhood', status: 'Verified', date: '2024-03-10', tx: '0x32...e9' },
    { id: 3, type: 'X (Twitter) Followers', status: 'Verified', date: '2024-03-08', tx: '0x9c...4a' },
  ];

  const handleAnchorProof = () => {
    // Set a mock proof object to simulate an anchored proof transaction
    setProofData({
      txId: "TEST123ABC",
      round: 345678,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full" 
      style={{ maxWidth: '1100px', margin: '0 auto' }}
    >
      <div className="flex-row items-center justify-between mb-10">
        <div>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: 800 }}>Security Center</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
            <p style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>
              Operator: <span style={{ color: 'white', fontWeight: 600, fontFamily: 'monospace' }}>{walletAddress.slice(0, 14)}...{walletAddress.slice(-6)}</span>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn" onClick={handleAnchorProof} style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#3B82F6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Anchor Proof
          </button>
          <button className="btn btn-primary" onClick={onStartVerify} style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            <Zap size={18} fill="currentColor" /> Initiate Probe
          </button>
        </div>
      </div>

      {/* Render ProofExplorer only when proof data exists */}
      {proofData && (
        <ProofExplorer 
          txId={proofData.txId} 
          round={proofData.round} 
          timestamp={proofData.timestamp} 
        />
      )}

      <div className="stats-grid mb-10">
        <div className="stat-card">
          <div className="opacity-70 mb-3 flex-row items-center gap-2" style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            <ShieldCheck size={18} color="var(--primary)" /> VERIFICATIONS
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>12</div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 600 }}>+18% Efficiency</div>
        </div>
        <div className="stat-card">
          <div className="opacity-70 mb-3 flex-row items-center gap-2" style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            <Database size={18} color="var(--primary)" /> TRUST SCORE
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>94/100</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: 600 }}>Tier-1 Access Active</div>
        </div>
        <div className="stat-card">
          <div className="opacity-70 mb-3 flex-row items-center gap-2" style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            <AlertCircle size={18} color="var(--primary)" /> PRIVACY INDEX
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>100%</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem', fontWeight: 600 }}>Zero Data Leaks</div>
        </div>
      </div>

      <div className="glass-card mb-10" style={{ padding: '2.5rem' }}>
        <div className="card-title" style={{ marginBottom: '2rem' }}>
          <Award size={24} color="var(--primary)" /> Active Attestations
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          <div style={{ background: 'rgba(5, 5, 5, 0.4)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '2rem', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }} className="hover-glow">
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.03 }}><ShieldCheck size={140} color="var(--primary)" /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(108, 59, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(108, 59, 255, 0.2)' }}>
                <Database size={24} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>Lending Protocol</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>HDFC Bank Oracle</div>
              </div>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Proof: Liquid balance exceeds 50k threshold for DeFi access.</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="status-pill status-success" style={{ fontSize: '0.75rem' }}>Active</span>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                0x8a...f1 <ExternalLink size={12} />
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(5, 5, 5, 0.4)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '2rem', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.03 }}><ShieldCheck size={140} color="var(--primary)" /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(108, 59, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(108, 59, 255, 0.2)' }}>
                <ShieldCheck size={24} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>Identiy Portal</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>UIDAI Notary</div>
              </div>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Proof: Over 21 years old and resident of India. Verified via Digilocker.</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="status-pill status-success" style={{ fontSize: '0.75rem' }}>Active</span>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                0x32...e9 <ExternalLink size={12} />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div className="card-title" style={{ marginBottom: '2rem' }}>
          <History size={24} color="var(--primary)" /> Operation Logs
        </div>
        <div className="w-full">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 1fr 1.5fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', opacity: 0.5, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em' }}>
            <div>VERIFICATION PROBE</div>
            <div>STATUS</div>
            <div>TIMESTAMP</div>
            <div style={{ textAlign: 'right' }}>LEDGER</div>
          </div>
          {history.map(item => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 1fr 1.5fr 1fr', padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', fontSize: '1rem', alignItems: 'center' }} className="hover-item">
              <div style={{ fontWeight: 700, color: 'white' }}>{item.type}</div>
              <div><span className="status-pill status-success" style={{ fontSize: '0.7rem' }}>{item.status}</span></div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{item.date}</div>
              <div style={{ fontFamily: 'monospace', color: 'var(--primary)', textAlign: 'right', fontSize: '0.9rem', cursor: 'pointer' }}>{item.tx}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onStartVerify} style={{ padding: '1.5rem 4rem', fontSize: '1.2rem', width: '100%', boxShadow: '0 20px 40px rgba(108, 59, 255, 0.25)' }}>
          <PlusCircle size={24} /> Generate New Secure Proof
        </button>
      </div>
    </motion.div>
  );
}
