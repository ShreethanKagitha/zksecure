import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ZkOracleInterface } from './components/ZkOracleInterface';
import { Dashboard } from './components/Dashboard';
import { ParticleBackground } from './components/ParticleBackground';
import { ShieldCheck, Check, FileText, Network, Database, Globe, Copy, ExternalLink, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { reconnectWallet, peraWallet, disconnectWallet, getStoredWalletAddress } from './lib/walletService';
import { WalletConnect } from './components/WalletConnect';
import Docs from './pages/Docs';

function MainLayout({ children, wallet, onDisconnect }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNav = (target: string) => {
    if (target === 'landing') navigate('/');
    else navigate(`/${target}`);
  };

  return (
    <>
      <ParticleBackground />
      <div className="bg-mesh">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>
      <div className="hero-glow-orb"></div>
      <div className="hero-glow-orb-2"></div>
      <div className="ambient-hero-glow"></div>
      <div className="bg-grid"></div>
      <div className="noise-overlay"></div>
      
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand" onClick={() => handleNav('landing')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShieldCheck size={28} color="var(--primary)" fill="rgba(108, 59, 255, 0.2)" />
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span className="live-text">LIVE</span>
              </div>
            </div>
            <span style={{ letterSpacing: '-0.02em', fontWeight: 900, marginLeft: '0.75rem' }}>ZK<span style={{ color: 'var(--primary)' }}>SECURE</span></span>
          </div>

          <div className="nav-links">
            <a href="/#protocol" className={`nav-link ${location.hash === '#protocol' ? 'active' : ''}`}>Protocol</a>
            <a href="/#network" className={`nav-link ${location.hash === '#network' ? 'active' : ''}`}>Network</a>
            <a href="/#registry" className={`nav-link ${location.hash === '#registry' ? 'active' : ''}`}>Registry</a>
            <button onClick={() => navigate('/docs')} className={`nav-link ${location.pathname === '/docs' ? 'active' : ''}`} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Docs</button>
          </div>

          <div>
            {wallet ? (
              <div style={{ position: 'relative' }}>
                <div 
                  className="status-pill status-success" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  style={{ cursor: 'pointer', padding: '0.6rem 1.2rem', fontWeight: 800, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  {wallet.slice(0, 10)}...{wallet.slice(-6)}
                  <ChevronDown size={14} />
                </div>
                
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: 'rgba(10, 10, 10, 0.95)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    minWidth: '220px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    zIndex: 50,
                    backdropFilter: 'blur(10px)',
                  }}>
                    <button 
                      onClick={() => {
                        navigate('/dashboard');
                        setIsDropdownOpen(false);
                      }}
                      style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', borderRadius: '8px' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LayoutDashboard size={16} color="var(--primary)" /> Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(wallet);
                        setIsDropdownOpen(false);
                      }}
                      style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', borderRadius: '8px' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Copy size={16} /> Copy Wallet Address
                    </button>
                    <button 
                      onClick={() => {
                        window.open(`https://testnet.algoexplorer.io/address/${wallet}`, '_blank');
                        setIsDropdownOpen(false);
                      }}
                      style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', borderRadius: '8px' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <ExternalLink size={16} /> View on AlgoExplorer
                    </button>
                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }} />
                    <button 
                      onClick={() => {
                        onDisconnect();
                        setIsDropdownOpen(false);
                      }}
                      style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', borderRadius: '8px', fontWeight: 600 }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} /> Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/connect')} className="btn btn-primary nav-cta">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        {location.pathname === '/connect' && (
          <div className="w-full animate-in" style={{ animationDuration: '0.4s', marginBottom: '3rem' }}>
            <div className="steps-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="steps-progress-line" style={{ width: '50%', left: '15%' }}></div>
              <div className="step completed">
                <div className="step-circle"><Check size={20} /></div>
                <div className="step-label">DISCOVERY</div>
              </div>
              <div className="step active">
                <div className="step-circle">2</div>
                <div className="step-label">ANCHORING</div>
              </div>
              <div className="step">
                <div className="step-circle">3</div>
                <div className="step-label">VERIFIED</div>
              </div>
            </div>
          </div>
        )}
        {children}
      </main>

      <footer className="footer-wrapper">
        <div className="container footer-container">
          <div className="footer-branding">
            <div className="footer-logo">
               <ShieldCheck size={32} color="var(--primary)" fill="rgba(108, 59, 255, 0.2)" />
               <span>ZK<span style={{ color: 'var(--primary)' }}>SECURE</span></span>
            </div>
            <p className="footer-desc">
              The global standard for private Web2 data notarization using high-performance zkTLS technology. 
              Bridging legacy data to the future of decentralized finance.
            </p>
          </div>
          
          <div className="footer-resources">
            <h4>Resources</h4>
            <div className="footer-links-grid">
              <button onClick={() => navigate('/docs')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                <FileText size={18} /> Docs
              </button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                <Network size={18} /> GitHub
              </a>
              <a href="/whitepaper.pdf" className="footer-link">
                <Database size={18} /> Whitepaper
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                <Globe size={18} /> Twitter
              </a>
            </div>
          </div>
        </div>
        
        <div className="container" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
          <div>© 2026 ZKSECURE PROTOCOL. ALL RIGHTS RESERVED.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a>
          </div>
        </div>
      </footer>
    </>
  );
}

function App() {
  const [wallet, setWallet] = useState<string | null>(getStoredWalletAddress());

  useEffect(() => {
    reconnectWallet().then(addr => {
      if (addr) setWallet(addr);
    });
    
    // @ts-ignore
    peraWallet.connector?.on('disconnect', () => {
      setWallet(null);
    });
  }, []);

  const handleWalletConnected = (address: string, navigate: any) => {
    setWallet(address);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWallet(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainLayout wallet={wallet} onDisconnect={handleDisconnect}>
            <HeroRouteWrapper />
          </MainLayout>
        } />
        
        <Route path="/connect" element={
          <MainLayout wallet={wallet} onDisconnect={handleDisconnect}>
            <ConnectRouteWrapper onConnected={handleWalletConnected} />
          </MainLayout>
        } />

        <Route path="/dashboard" element={
          <MainLayout wallet={wallet} onDisconnect={handleDisconnect}>
            <DashboardRouteWrapper wallet={wallet} />
          </MainLayout>
        } />

        <Route path="/oracle" element={
          <MainLayout wallet={wallet} onDisconnect={handleDisconnect}>
            <OracleRouteWrapper wallet={wallet} />
          </MainLayout>
        } />

        <Route path="/docs" element={
          <MainLayout wallet={wallet} onDisconnect={handleDisconnect}>
            <Docs />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

// Wrappers to handle navigation inside components that need useNavigate
function HeroRouteWrapper() {
  const navigate = useNavigate();
  return <Hero onStart={() => navigate('/connect')} />;
}

function ConnectRouteWrapper({ onConnected }: any) {
  const navigate = useNavigate();
  return <WalletConnect onConnected={(addr) => onConnected(addr, navigate)} />;
}

function DashboardRouteWrapper({ wallet }: any) {
  const navigate = useNavigate();
  return <Dashboard walletAddress={wallet || ''} onStartVerify={() => navigate('/oracle')} />;
}

function OracleRouteWrapper({ wallet }: any) {
  const navigate = useNavigate();
  return (
    <ZkOracleInterface 
      walletAddress={wallet || ''} 
      onComplete={() => navigate('/dashboard')} 
      onBackToDashboard={() => navigate('/dashboard')} 
    />
  );
}

export default App;
