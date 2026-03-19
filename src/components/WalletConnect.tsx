import { useEffect } from 'react';
import { Wallet, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@txnlab/use-wallet-react';
import { WalletButton } from '@txnlab/use-wallet-ui-react';

interface WalletConnectProps {
  onConnected: (address: string) => void;
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const { activeAddress } = useWallet();

  useEffect(() => {
    if (activeAddress) {
      setTimeout(() => {
        onConnected(activeAddress);
      }, 1500);
    }
  }, [activeAddress, onConnected]);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
  };

  const connected = !!activeAddress;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card" 
      style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '4rem 3rem', margin: '0 auto' }}
    >
      <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2.5rem auto' }}>
        <div style={{ 
          width: '100%', height: '100%', borderRadius: '32px', 
          background: connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(108, 59, 255, 0.1)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `2px solid ${connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(108, 59, 255, 0.3)'}`,
          boxShadow: `0 0 30px ${connected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(108, 59, 255, 0.2)'}`,
          position: 'relative',
          zIndex: 2
        }}>
          {connected ? (
            <ShieldCheck size={48} color="#10b981" />
          ) : (
            <Wallet size={48} color="var(--primary)" />
          )}
        </div>
      </div>

      <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'white' }}>
        {connected ? 'Identity Fixed' : 'Anchor Identity'}
      </h2>
      <p style={{ marginBottom: '3rem', fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
        {connected 
          ? 'Secure bridge established. Initializing cryptographic environment for your private session.'
          : 'Link your primary Web3 wallet to authorize zkTLS probes and cryptographically anchor your real-world data.'}
      </p>

      {!connected && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} className="wui-custom-trigger">
          <WalletButton />
        </div>
      )}

      {connected && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}
        >
          <div className="status-pill status-success" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} /> SESSION AUTHENTICATED
          </div>
          <div style={{ padding: '1.25rem 2rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
              {formatAddress(activeAddress!)}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

