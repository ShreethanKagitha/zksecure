import { ExternalLink, CheckCircle2, Box, Clock, Fingerprint } from 'lucide-react';

interface ProofExplorerProps {
  txId: string;
  round: number | string;
  timestamp: string;
}

export function ProofExplorer({ txId, round, timestamp }: ProofExplorerProps) {
  return (
    <div className="glass-card mb-10" style={{ padding: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <CheckCircle2 size={24} color="#10b981" />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>Proof Anchored Successfully</h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <Fingerprint size={16} /> Transaction ID
          </div>
          <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'white', wordBreak: 'break-all' }}>
            {txId}
          </div>
        </div>
        
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <Box size={16} /> Block Round
          </div>
          <div style={{ fontWeight: 600, color: 'white' }}>
            {round}
          </div>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <Clock size={16} /> Timestamp
          </div>
          <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
            {timestamp}
          </div>
        </div>
      </div>

      <a 
        href={`https://testnet.algoexplorer.io/tx/${txId}`} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', 
          fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', padding: '0.75rem 1.5rem',
          background: 'rgba(16, 185, 129, 0.1)', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.2)'
        }}
      >
        View on AlgoExplorer <ExternalLink size={16} />
      </a>
    </div>
  );
}
