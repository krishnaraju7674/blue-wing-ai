'use client';

import dynamic from 'next/dynamic';

const BlueWingApp = dynamic(() => import('@/components/BlueWingApp'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#030612',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '12px',
    }}>
      <div style={{
        fontSize: '14px', letterSpacing: '8px', fontWeight: 600,
        background: 'linear-gradient(135deg, #00d4ff, #0096ff, #7c6cf0)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        BLUE WING
      </div>
      <div style={{ fontSize: '9px', letterSpacing: '4px', color: '#3a4468' }}>
        INITIALIZING SYSTEMS...
      </div>
    </div>
  ),
});

export default function Home() {
  return <BlueWingApp />;
}
