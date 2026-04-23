'use client';

export default function HelpModal({ onClose }) {
    const commands = [
        { cmd: 'Alt + B', desc: 'Focus Command Bar' },
        { cmd: 'Alt + M', desc: 'Toggle Microphone' },
        { cmd: 'Alt + S', desc: 'Split (Multi-Agent)' },
        { cmd: 'Alt + G', desc: 'God Mode Override' },
        { cmd: 'Blue Wing, run diagnostics', desc: 'System Audit' },
        { cmd: 'Blue Wing, summarize mission', desc: 'Mission Briefing' },
        { cmd: 'Blue Wing, switch to Scribe', desc: 'Persona Change' },
    ];

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(3, 6, 18, 0.9)',
            backdropFilter: 'blur(30px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
        }}>
            <div className="glass-panel" style={{ width: '500px', padding: '30px' }}>
                <div className="panel-header" style={{ marginBottom: '20px' }}>
                    <span className="panel-title">Sovereign OS — Command Protocols</span>
                    <button onClick={onClose} className="cmd-btn" style={{ padding: '2px 8px' }}>CLOSE</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {commands.map((c, i) => (
                        <div key={i} className="status-row" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                            <span className="status-label" style={{ color: 'var(--accent-cyan)' }}>{c.cmd}</span>
                            <span className="status-value" style={{ opacity: 0.8 }}>{c.desc}</span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>PRO TIP:</span> Use God-Mode to intensify the neural core and unlock high-authority aesthetic overrides.
                </div>
            </div>
        </div>
    );
}
