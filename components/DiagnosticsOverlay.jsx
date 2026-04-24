'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticsOverlay({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('INITIALIZING SCAN...');
    const [details, setDetails] = useState([]);

    const steps = [
        { p: 10, s: 'CHECKING CORE SYNC...', d: 'Three.js Renderer: ONLINE' },
        { p: 30, s: 'VERIFYING VAULT INTEGRITY...', d: 'Appwrite Cloud: CONNECTED' },
        { p: 50, s: 'AUDITING COGNITION LAYER...', d: 'Gemini 2.0 Flash: RESPONDING' },
        { p: 70, s: 'SCANNING ACTION HANDLES...', d: 'Hardhat Engine: READY' },
        { p: 90, s: 'FINALIZING SYSTEM CHECK...', d: 'Sovereign Protocol: LOCKED' },
        { p: 100, s: 'DIAGNOSTICS COMPLETE', d: 'All Systems Nominal.' }
    ];

    useEffect(() => {
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                setProgress(step.p);
                setStatus(step.s);
                setDetails(prev => [step.d, ...prev].slice(0, 3));
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 2000);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(3, 6, 18, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(50px)'
        }}>
            <div style={{ width: '400px', textAlign: 'center' }}>
                <div className="logo-title" style={{ fontSize: '18px', marginBottom: '4px' }}>SYSTEM DIAGNOSTICS</div>
                <div className="logo-subtitle" style={{ marginBottom: '40px' }}>{status}</div>
                
                <div className="meter-bar" style={{ height: '4px', marginBottom: '20px' }}>
                    <div className="meter-fill" style={{ width: `${progress}%`, transition: 'width 0.8s ease' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                    {details.map((d, i) => (
                        <div key={i} style={{ 
                            fontFamily: 'JetBrains Mono, monospace', 
                            fontSize: '10px', 
                            color: 'var(--accent-cyan)',
                            opacity: 1 - (i * 0.3),
                            animation: 'fade-in-up 0.3s ease'
                        }}>
                            {`[OK] ${d}`}
                        </div>
                    ))}
                </div>

                <div>
                    <button 
                        onClick={() => {
                            const msg = "Audio check. Sovereign system audio is functional.";
                            if (window.speechSynthesis) {
                                window.speechSynthesis.cancel();
                                const u = new SpeechSynthesisUtterance(msg);
                                u.pitch = 0.85;
                                window.speechSynthesis.speak(u);
                            }
                        }} 
                        className="cmd-btn" 
                        style={{ fontSize: '8px', padding: '6px 12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
                    >
                        TEST SPEAKERS
                    </button>
                </div>
            </div>
        </div>
    );
}
