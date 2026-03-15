import { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  step: string;
  provider: any;
}

export function Terminal({ step, provider }: TerminalProps) {
  const [logs, setLogs] = useState<{ text: string; type: 'info' | 'success' | 'warning' | 'dim' }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 'fetching') {
      setLogs([
        { text: `IDENTITY_PROBE: Initializing handshake with operator_node_${provider?.id || 'standard'}`, type: 'info' },
        { text: `ENCRYPTION: TLS 1.3 Handshake (ECDHE-RSA-AES256-GCM-SHA384)`, type: 'dim' },
        { text: `TRUST_ROOT: Remote Certificate Verified (SHA256: 8A:42:B1:0C)`, type: 'dim' },
        { text: `MPC_SESSION: Multi-party computation active. session_id: 0x${Math.random().toString(16).slice(2, 10)}`, type: 'success' },
        { text: `DATA_CAPTURE: JSON-RPC transcript intercepted in zero-knowledge`, type: 'info' },
        { text: `TRANSCRIPT: 204 OK - SECURE DATA TRACE LOCKED`, type: 'success' },
      ]);
    } else if (step === 'proving') {
      const moreLogs: { text: string; type: 'info' | 'success' | 'warning' | 'dim' }[] = [
        { text: 'CIRCUIT_ENGINE: Loading R1CS constraints for personhood bypass', type: 'info' },
        { text: 'SIGNAL_INPUT: Masking private witness "actual_balance_integer"', type: 'dim' },
        { text: 'ASSERTION: If(secret_val >= 50000) Return(ValidProof)', type: 'warning' },
        { text: 'SNARK_CORE: Generating Groth16 non-interactive proof...', type: 'info' },
        { text: 'FIELD_OPS: Calc Point G1: 0x3f...12 | G2: 0x9a...bc', type: 'dim' },
        { text: 'PROOF_GENERATED: Attestation compiled in 1420ms.', type: 'success' },
      ];
      setLogs(prev => [...prev, ...moreLogs]);
    } else if (step === 'submitting') {
      const submitLogs: { text: string; type: 'info' | 'success' | 'warning' | 'dim' }[] = [
        { text: 'ORACLE_BRIDGE: Relaying proof to VerifierContract.sol', type: 'info' },
        { text: 'EVM_AUTH: s=0x4c... e=0x12... v=0x1b', type: 'dim' },
        { text: 'BROADCAST: Pushing proof to decentralized trust layer...', type: 'info' },
        { text: 'BLOCK_FINALTY: Epoch #42,295 confirmed on-chain.', type: 'success' },
        { text: 'PROTOCOL: Attestation globally queryable by wallet_id', type: 'success' },
      ];
      setLogs(prev => [...prev, ...submitLogs]);
    }
  }, [step, provider]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal mt-6" ref={scrollRef} style={{ background: 'rgba(5, 5, 5, 0.8)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '16px' }}>
      {logs.map((log, i) => (
        <div key={i} className={`terminal-line ${log.type}`} style={{ marginBottom: '0.5rem', fontSize: '0.9rem', letterSpacing: '0.02em', fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ marginRight: '10px', opacity: 0.8 }}>
            {log.type === 'success' ? '⚡' : log.type === 'warning' ? '◈' : '»'}
          </span>
          {log.text}
        </div>
      ))}
      <div className="terminal-line" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px', opacity: 0.8 }}>»</span>
        <span className="cursor"></span>
      </div>
    </div>
  );
}
