import { useState, useEffect } from 'react';
import { Wallet, Loader2, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { connectWallet, disconnectWallet, peraWallet } from '../lib/walletService';
import { motion } from 'framer-motion';

interface WalletConnectProps {
  onConnected: (address: string) => void;
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet.reconnectSession().then((accounts) => {
      peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);

      if (accounts.length) {
        setConnectedAddress(accounts[0]);
        setTimeout(() => {
          onConnected(accounts[0]);
        }, 1500);
      }
    });

    return () => {
      // @ts-ignore
      peraWallet.connector?.off('disconnect', handleDisconnectWalletClick);
    };
  }, [onConnected]);

  const handleDisconnectWalletClick = () => {
    disconnectWallet();
    setConnectedAddress(null);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const account = await connectWallet();
      // @ts-ignore
      peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);
      if (account) {
        setIsConnecting(false);
        setConnectedAddress(account);
        setTimeout(() => {
          onConnected(account);
        }, 1500);
      }
    } catch (error) {
      console.error('Pera Wallet connection failed:', error);
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
  };

  const connected = !!connectedAddress;

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
        {isConnecting && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', inset: -12, borderRadius: '40px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
          ></motion.div>
        )}
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
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
           <p style={{ color: '#ef4444', fontWeight: 800, margin: 0, fontSize: '0.95rem' }}>CRITICAL STEP</p>
           <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
             Ensure your Pera Mobile App is set to <strong>TESTNET</strong> before scanning.<br/>
             <span style={{ opacity: 0.8 }}>(Settings → Developer Settings → Node Settings)</span>
           </p>
           <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', marginBottom: 0, fontStyle: 'italic' }}>
             *If you scan while on Mainnet, Pera will display "DApp is not responding".
           </p>
        </div>
      )}

      {!connected && (
        <button 
          className="btn btn-primary" 
          onClick={handleConnect}
          disabled={isConnecting}
          style={{ width: '100%', height: '64px', fontSize: '1.2rem', boxShadow: '0 20px 40px rgba(108, 59, 255, 0.25)' }}
        >
          {isConnecting ? (
            <><Loader2 className="animate-spin" size={24} /> Awaiting Auth...</>
          ) : (
            <>Connect Web3 Wallet <ChevronRight size={22} /></>
          )}
        </button>
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
              {formatAddress(connectedAddress!)}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

