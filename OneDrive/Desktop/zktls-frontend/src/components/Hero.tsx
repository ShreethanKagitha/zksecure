import { useState, useEffect, useRef } from 'react';
import { Shield, Lock, ArrowRight, Zap, Globe, Search, AlertCircle, CheckCircle, Database, Server, Users, Fingerprint, EyeOff, Network, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// ── Section Reveal Hook ───────────────────────────────────────────
function useSectionReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.section-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function ZkTLSSimulation() {
  const [simStep, setSimStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && simStep === 0) {
          setSimStep(1);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [simStep]);

  useEffect(() => {
    if (simStep === 0 || simStep >= 8) return;
    
    const timers: Record<number, number> = {
      1: 1200, // Handshake
      2: 1500, // Response
      3: 1500, // Prover
      4: 1000, // Redacting
      5: 1500, // ZK Proof
      6: 1500, // Attestation
      7: 3000  // Success Pause before restart
    };

    const timer = setTimeout(() => {
      if (simStep === 7) {
        setSimStep(1); // Restart loop
      } else {
        setSimStep(s => s + 1);
      }
    }, timers[simStep]);
    
    return () => clearTimeout(timer);
  }, [simStep]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [simStep]);

  return (
    <div ref={containerRef} className="glass-card demo-engine-container" style={{ maxWidth: '850px', margin: '0 auto', padding: '0', overflow: 'hidden', border: '1px solid rgba(108, 59, 255, 0.15)' }}>
      <div style={{ background: 'rgba(5, 8, 22, 0.95)', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
         <div style={{ display: 'flex', gap: '0.6rem' }}>
           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 10px rgba(255, 95, 86, 0.5)' }}></div>
           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           {simStep > 0 && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>
               <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}></div>
               LIVE ENGINE
             </div>
           )}
           <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>zkTLS Notary Sandbox v1.0.4</span>
         </div>
      </div>
      
      <div ref={scrollRef} style={{ padding: '3rem', height: '450px', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'radial-gradient(circle at center, rgba(108, 59, 255, 0.04) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 70%)' }} className="custom-scrollbar">
        {simStep === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)' }}>
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : (
          <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SimStepItem step={simStep} target={1} title="Negotiating Multi-Party TLS Handshake" />
            <SimStepItem step={simStep} target={2} title="Extracting Encrypted Web Response">
              <div style={{ background: 'rgba(5, 8, 26, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(108, 59, 255, 0.15)', fontSize: '0.85rem', color: '#6C3BFF', fontFamily: 'JetBrains Mono, monospace' }}>
                 <div style={{ color: 'var(--primary)' }}>"balance"</div>: <span style={{ color: 'white' }}>"₹99,999"</span>,
                 <br />
                 <div style={{ color: 'var(--primary)' }}>"status"</div>: <span style={{ color: 'white' }}>"VERIFIED"</span>
              </div>
            </SimStepItem>
            <SimStepItem step={simStep} target={3} title="Executing Groth16 Prover" />
            <SimStepItem step={simStep} target={4} title="Redacting Sensitive Metadata" />
            <SimStepItem step={simStep} target={5} title="Generating Zero-Knowledge Proof" />
            <SimStepItem step={simStep} target={6} title="Finalizing On-Chain Attestation" isLast={true} />
            
            {simStep >= 7 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', boxShadow: '0 0 40px rgba(16, 185, 129, 0.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={20} color="#10b981" />
                  <span style={{ fontWeight: 800, color: '#10b981', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Proof Anchored on Algorand</span>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'rgba(16, 185, 129, 0.7)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>TX: 0x82fa7c91cd4a...a91c</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>VERIFIED</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SimStepItem({ step, target, title, children, isLast }: { step: number, target: number, title: string, children?: React.ReactNode, isLast?: boolean }) {
  if (step < target) return null;
  
  const isActive = step === target;
  const isDone = step > target || (isLast && step >= target + 1);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-row gap-4"
    >
      <div style={{ marginTop: '4px' }}>
        {isActive ? (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30px', height: '30px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(8px)' }}></div>
            <Loader2 size={24} className="animate-spin" color="var(--primary)" />
          </div>
        ) : (
          <CheckCircle size={24} color={isDone ? "#10b981" : "var(--primary)"} style={{ filter: isDone ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))' : 'none' }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: isActive ? 'white' : 'var(--text-dim)', transition: 'color 0.3s ease' }}>
           {title} 
           {isLast && isDone && (
             <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ color: '#10b981', marginLeft: '1rem', fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.2)', verticalAlign: 'middle' }}
              >
                VERIFIED
              </motion.span>
           )}
        </h4>
        {children && (
          <div style={{ marginTop: '0.75rem', opacity: isActive || isDone ? 1 : 0.4, transition: 'all 0.5s' }}>
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}

const PIPELINE_STEPS = [
  { 
    id: 1, 
    title: "Web2 Data Source", 
    icon: Database, 
    desc: "Target legacy HTTPS data from bank portals, government IDs, or social platforms." 
  },
  { 
    id: 2, 
    title: "Privacy Tunnel", 
    icon: Globe, 
    desc: "MPC-based TLS handshake creates a secure session without revealing login credentials." 
  },
  { 
    id: 3, 
    title: "zkTLS Proving", 
    icon: Shield, 
    desc: "Generate a Zero-Knowledge Proof locally that specific data exists in the TLS session." 
  },
  { 
    id: 4, 
    title: "Oracle Relay", 
    icon: Server, 
    desc: "A decentralized node relays the concise cryptographic proof to the destination chain." 
  },
  { 
    id: 5, 
    title: "Algorand Anchor", 
    icon: Zap, 
    desc: "The proof is verified on-chain and permanently anchored to the Algorand blockchain.",
    isHighlight: true
  }
];

function PipelineStep({ step, isLast }: { step: any, isLast: boolean }) {
  return (
    <>
      <motion.div 
        className={`how-it-works-card ${step.isHighlight ? 'final-step' : ''}`}
        whileHover={{ y: -8 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="icon-box">
          <step.icon size={24} color={step.isHighlight ? "white" : "var(--primary)"} />
        </div>
        <h4 style={step.isHighlight ? { color: 'var(--primary)', textShadow: '0 0 10px var(--primary-glow)' } : {}}>
          {step.title}
        </h4>
        <p>{step.desc}</p>
        <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', fontSize: '1.5rem', fontWeight: 900, opacity: 0.05, color: 'white' }}>
          0{step.id}
        </div>
        {step.isHighlight && (
          <div style={{ marginTop: '1rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Fingerprint size={12} /> Immutable Receipt
          </div>
        )}
      </motion.div>
      {!isLast && (
        <div className="pipeline-arrow">
          <ArrowRight size={32} />
        </div>
      )}
    </>
  );
}


interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  useSectionReveal();
  return (
    <div className="w-full">
      {/* 1. Cinematic Hero Section */}
      <section className="text-center" style={{ padding: '6rem 0 5rem 0', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
        <div className="container">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="badge"
            >
              <Zap size={14} style={{ marginRight: '0.6rem' }} fill="currentColor" />
              The Unified Layer for Private Web2 Data
            </motion.div>
            
            <motion.h1 
              className="text-glow-animate" 
              style={{ marginBottom: '2rem', marginInline: 'auto', maxWidth: '1000px', lineHeight: 1, position: 'relative', zIndex: 1 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Private Data. <br />
              Anonymized.
            </motion.h1>
            
            <motion.p 
              style={{ maxWidth: '800px', margin: '0 auto 4rem auto', fontSize: '1.4rem', color: 'var(--text-dim)', fontWeight: 400, lineHeight: 1.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              The world's first generalized zkTLS oracle. Securely bridge your banking, social, and governmental data to any smart contract without revealing your secrets.
            </motion.p>
            
            <motion.div 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="btn btn-primary btn-cta-pulse" onClick={onStart} style={{ padding: '1.25rem 3.5rem', fontSize: '1.2rem', boxShadow: '0 20px 40px rgba(108, 59, 255, 0.25), 0 0 20px rgba(59, 130, 246, 0.15)', position: 'relative', zIndex: 1 }}>
                Start zkTLS Verification <ArrowRight size={22} />
              </button>
              <a href="#attestation-log" className="btn btn-secondary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.2rem', textDecoration: 'none' }}>
                <Search size={22} /> Explore Attestations
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* 1.5 Problem-Solution-Result Explainer */}
      <section style={{ padding: '5rem 0', background: 'transparent', borderTop: '1px solid rgba(108, 59, 255, 0.05)', borderBottom: '1px solid rgba(108, 59, 255, 0.05)' }}>
        <div className="container">
          <div className="psr-container">
            <motion.div 
              className="psr-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="psr-label">Problem</span>
              <h3>Web2 Data Isolation</h3>
              <p>Web2 data such as bank records and identity credentials cannot be directly trusted by smart contracts.</p>
            </motion.div>

            <div className="psr-connector">
              <ArrowRight size={32} />
            </div>

            <motion.div 
              className="psr-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="psr-label" style={{ color: 'var(--accent)' }}>Solution</span>
              <h3>zkTLS Proofs</h3>
              <p>zkTLS converts authenticated Web2 sessions into zero-knowledge proofs without revealing private data.</p>
            </motion.div>

            <div className="psr-connector">
              <ArrowRight size={32} />
            </div>

            <motion.div 
              className="psr-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span className="psr-label" style={{ color: '#10b981' }}>Result</span>
              <h3>On-Chain Truth</h3>
              <p>Smart contracts verify real-world information securely on the Algorand blockchain.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Interactive zkTLS Demo */}
      <section id="live-demo" style={{ padding: '5rem 0', background: 'transparent' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span className="section-title-glow">Live zkTLS Proof Generation</span>
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>Watch how private Web2 data becomes a verifiable on-chain proof.</p>
          </div>
          <ZkTLSSimulation />
        </div>
      </section>

      {/* 3. Privacy Problem Visualization */}
      <section style={{ padding: '5rem 0' }} className="section-reveal">
        <div className="container">
          <div className="text-center mb-20 section-reveal">
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span className="section-title-glow">The <span style={{ color: 'var(--primary)', textShadow: '0 0 20px var(--primary-glow)' }}>Privacy Trap</span></span>
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>Current Web3 solutions force a choice between usability and absolute privacy. <br /><strong>We've ended the compromise.</strong></p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
            <div className="glass-card section-reveal delay-1" style={{ padding: '3.5rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.04 }}>
                <EyeOff size={220} color="var(--primary)" />
              </div>
              <AlertCircle size={40} color="var(--primary)" style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 2 }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>Session Leakage</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.7, position: 'relative', zIndex: 2 }}>Traditional oracles require sending your raw, sensitive session data to third-party nodes, exposing your passwords and PII to potential malicious actors.</p>
            </div>
            <div className="glass-card section-reveal delay-2" style={{ padding: '3.5rem', borderLeft: '4px solid var(--secondary)' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.03 }}>
                <Network size={220} color="var(--primary)" />
              </div>
              <AlertCircle size={40} color="var(--primary)" style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 2 }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>Custodial Oracles</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.7, position: 'relative', zIndex: 2 }}>Existing bridges act as "trusted" intermediaries. If their infrastructure is compromised, your entire digital identity is at risk. Hardware tees are not enough.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visual Pipeline Visualization */}
      <section id="protocol" style={{ padding: '5rem 0', background: 'transparent' }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span className="section-title-glow">zkTLS Data Verification Pipeline</span>
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>A trustless bridge converting private Web2 sessions into immutable On-Chain truth.</p>
          </div>
          
          <div className="how-it-works-container">
            {PIPELINE_STEPS.map((step, idx) => (
              <PipelineStep 
                 key={step.id} 
                 step={step} 
                 isLast={idx === PIPELINE_STEPS.length - 1} 
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', opacity: 0.8, maxWidth: '800px', margin: '3rem auto 0 auto', fontStyle: 'italic' }}>
              This architecture enables any smart contract to verify user-owned data from legacy web portals without ever accessing sensitive session tokens or PII, creating the ultimate privacy-preserving bridge between Web2 and Web3.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Horizontal Feature Strip: Native Security */}
      <section style={{ padding: '5rem 0', background: 'transparent', position: 'relative', overflow: 'hidden' }} className="section-reveal">
        <div className="container">
          <div className="light-beam-bg"></div>
          <div className="text-center mb-10">
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span className="section-title-glow">Native Security</span>
            </h2>
          </div>
          
          <div className="feature-strip-container">
            <div className="feature-item section-reveal delay-1">
              <div className="icon-wrapper">
                <Shield size={48} />
              </div>
              <h3>Zero Exposure</h3>
              <p>We never see your password, cookies, or session tokens. Everything is processed via MPC and proven locally on your hardware.</p>
            </div>
            
            <div className="feature-divider"></div>

            <div className="feature-item section-reveal delay-2">
              <div className="icon-wrapper">
                <Lock size={48} />
              </div>
              <h3>Cryptographic Trust</h3>
              <p>Proofs are mathematically verifiable. You don't trust us; you trust the immutable laws of zero-knowledge cryptography.</p>
            </div>

            <div className="feature-divider"></div>
            
            <div className="feature-item section-reveal delay-2">
              <div className="icon-wrapper">
                <Globe size={48} />
              </div>
              <h3>API Agnostic</h3>
              <p>If it's on HTTPS, it's provable. Universal compatibility with any web portal without requiring custom API integrations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Real-World Use Cases */}
      <section id="network" style={{ padding: '5rem 0', background: 'transparent' }} className="section-reveal">
        <div className="container">
           <div className="text-center mb-20 section-reveal">
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span className="section-title-glow">Ecosystem Powered by Truth</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>
            <div className="glass-card section-reveal delay-1" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }}>
                <Zap size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'white', fontWeight: 800 }}>Institutional DeFi</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.7 }}>Unlock credit-based lending. Borrow against your verified RWA assets without ever leaking your financial history or identity documents.</p>
            </div>
            <div className="glass-card section-reveal delay-2" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }}>
                <Users size={40} color="var(--secondary)" />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'white', fontWeight: 800 }}>Sybil-Resistant KYC</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.7 }}>Universal proof of personhood. Prove you have a legitimate government ID without storing your biometrics or PII on any chain.</p>
            </div>
            <div className="glass-card section-reveal delay-3" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }}>
                <Globe size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'white', fontWeight: 800 }}>Social On-Chain</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.7 }}>Bridge your off-chain reputation. Import follower counts, professional certifications, or gaming achievements via LinkedIn/X/GitHub.</p>
            </div>
            <div className="glass-card section-reveal delay-4" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }}>
                <Server size={40} color="var(--secondary)" />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'white', fontWeight: 800 }}>Enterprise Attestation</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.7 }}>Decentralized proof of employment or residency. Onboard employees to DAOs based on their corporate web portal status.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Live Network Activity */}
      <section id="registry" style={{ padding: '5rem 0', background: 'transparent' }} className="section-reveal">
        <div className="container">
          <div className="text-center mb-20 section-reveal">
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span className="section-title-glow">Proof Attestation Log</span>
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>Live verification of web state across the L1 network.</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto', maxWidth: '1000px', margin: '0 auto', background: 'rgba(5, 8, 22, 0.85)' }}>
             <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
                   <th style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data Source</th>
                   <th style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Attestation</th>
                   <th style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ZKP Status</th>
                   <th style={{ padding: '1.5rem', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   { source: 'HDFC Bank', type: 'Balance Attestation', tx: '0x8a...f1', color: 'var(--primary)' },
                   { source: 'LinkedIn', type: 'Employment Status', tx: '0x32...e9', color: 'var(--secondary)' },
                   { source: 'UIDAI', type: 'Personhood Proof', tx: '0x9c...4a', color: 'var(--accent)' }
                 ].map((item, idx) => (
                   <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                     <td style={{ padding: '1.5rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ width: 10, height: 10, borderRadius: '2px', background: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                         <span style={{ fontWeight: 600 }}>{item.source}</span>
                       </div>
                     </td>
                     <td style={{ padding: '1.5rem', color: 'var(--text-dim)' }}>{item.type}</td>
                     <td style={{ padding: '1.5rem' }}>
                       <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                         VERIFIED
                       </span>
                     </td>
                     <td style={{ padding: '1.5rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', fontSize: '0.9rem' }}>
                       {item.tx}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </section>

      {/* 9. Final Call-To-Action */}
      <section style={{ padding: '5rem 0 2rem 0', background: 'transparent', borderTop: '1px solid rgba(108, 59, 255, 0.08)' }}>
        <div className="container">
           <div className="text-center mb-16">
            <h2 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
              <span className="section-title-glow">Ready to Secure <br />the Web?</span>
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>Join the next generation of builders creating privacy-first decentralized applications with zkTLS.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a href="#live-demo" className="btn btn-primary btn-cta-pulse" style={{ padding: '1.5rem 6rem', fontSize: '1.4rem', boxShadow: '0 25px 60px rgba(108, 59, 255, 0.35), 0 0 30px rgba(59, 130, 246, 0.15)', borderRadius: '100px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
               Try zkTLS Demo <ArrowRight size={28} style={{ marginLeft: '1rem' }} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

