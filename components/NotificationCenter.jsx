'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const NotificationCenter = forwardRef((props, ref) => {
    const [notifications, setNotifications] = useState([]);

    useImperativeHandle(ref, () => ({
        add: (title, message, type = 'info') => {
            const id = Math.random().toString(36).substring(2, 9);
            setNotifications(prev => [{ id, title, message, type }, ...prev].slice(0, 5));
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 6000);
        }
    }));

    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '80px',
            right: '340px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none'
        }}>
            {notifications.map(n => (
                <div key={n.id} className="glass-panel" style={{
                    width: '260px',
                    padding: '12px 16px',
                    borderLeft: `3px solid ${n.type === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)'}`,
                    animation: 'slide-in-right 0.4s ease',
                    pointerEvents: 'auto'
                }}>
                    <div style={{ 
                        fontFamily: 'JetBrains Mono, monospace', 
                        fontSize: '9px', 
                        letterSpacing: '2px', 
                        color: n.type === 'error' ? 'var(--accent-red)' : 'var(--accent-cyan)',
                        marginBottom: '4px'
                    }}>
                        {n.title.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                        {n.message}
                    </div>
                </div>
            ))}
        </div>
    );
});

NotificationCenter.displayName = 'NotificationCenter';
export default NotificationCenter;
