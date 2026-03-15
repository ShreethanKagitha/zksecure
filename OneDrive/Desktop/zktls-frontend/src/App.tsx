import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ZkOracleInterface } from './components/ZkOracleInterface';
import { Dashboard } from './components/Dashboard';
import { ParticleBackground } from './components/ParticleBackground';
import { ShieldCheck, Check, FileText, Network, Database, Globe } from 'lucide-react';
import { useState } from 'react';
import { Hero } from './components/Hero';
import { WalletConnect } from './components/WalletConnect';
import Docs from './pages/Docs';

function MainLayout({ children, wallet }: any) {
  const navigate = useNavigate();
  const location = useLocation();

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
              <div className="status-pill status-success" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', padding: '0.6rem 1.2rem', fontWeight: 800, fontFamily: 'monospace' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                {wallet.slice(0, 10)}...{wallet.slice(-6)}
              </div>
            ) : (
              <button onClick={() => navigate('/connect')} className="btn btn-primary nav-cta">
                Start Verification
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
              <a href="https://github.com/kgoud3621/event-registration" target="_blank" rel="noopener noreferrer" className="footer-link">
                <Network size={18} /> GitHub
              </a>
              <a href="/whitepaper.pdf" className="footer-link">
                <Database size={18} /> Whitepaper
              </a>
              <a href="https://twitter.com/kgoud3621" target="_blank" rel="noopener noreferrer" className="footer-link">
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
  const [wallet, setWallet] = useState<string | null>(null);

  const handleWalletConnected = (address: string, navigate: any) => {
    setWallet(address);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainLayout wallet={wallet}>
            <HeroRouteWrapper />
          </MainLayout>
        } />
        
        <Route path="/connect" element={
          <MainLayout wallet={wallet}>
            <ConnectRouteWrapper onConnected={handleWalletConnected} />
          </MainLayout>
        } />

        <Route path="/dashboard" element={
          <MainLayout wallet={wallet}>
            <DashboardRouteWrapper wallet={wallet} />
          </MainLayout>
        } />

        <Route path="/oracle" element={
          <MainLayout wallet={wallet}>
            <OracleRouteWrapper wallet={wallet} />
          </MainLayout>
        } />

        <Route path="/docs" element={
          <MainLayout wallet={wallet}>
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
