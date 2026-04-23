'use client';

import { useRef, useEffect, useState } from 'react';

export default function VisionFeed() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setActive(true);
      }
    } catch (err) {
      console.error("Camera access denied.", err);
    }
  };

  const [coords, setCoords] = useState({ x: 42.1234, y: -71.5678 });

  useEffect(() => {
    if (!active) return;

    let watchId;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCoords({ x: pos.coords.latitude, y: pos.coords.longitude });
        },
        (err) => {
          console.warn("Geolocation access denied, using simulated data.");
          startSimulation();
        }
      );
    } else {
      startSimulation();
    }

    let simIv;
    function startSimulation() {
      simIv = setInterval(() => {
        setCoords(prev => ({
          x: prev.x + (Math.random() - 0.5) * 0.001,
          y: prev.y + (Math.random() - 0.5) * 0.001
        }));
      }, 3000);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (simIv) clearInterval(simIv);
    };
  }, [active]);

  return (
    <div className="glass-panel" style={{ height: '220px', marginBottom: '12px', position: 'relative' }}>
      <div className="scan-line" />
      <div className="panel-header">
        <span className="panel-title">Vision Feed</span>
        <span className="panel-badge">{active ? 'LIVE' : 'OFFLINE'}</span>
      </div>

      {!active ? (
        <div
          onClick={startCamera}
          style={{
            height: 'calc(100% - 40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '24px', opacity: 0.3 }}>📷</div>
          <div style={{ fontSize: '9px', letterSpacing: '2px', color: 'var(--text-muted)' }}>ACTIVATE OPTICS</div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: 'calc(100% - 40px)',
              objectFit: 'cover',
              filter: 'grayscale(1) contrast(1.2) brightness(0.8) sepia(0.3) hue-rotate(180deg)',
              opacity: 0.8
            }}
          />
          {/* Targeting Reticle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            border: '1px solid rgba(0, 212, 255, 0.4)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}>
            <div style={{ position: 'absolute', top: '50%', left: '-10px', width: '20px', height: '1px', background: 'cyan', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '50%', right: '-10px', width: '20px', height: '1px', background: 'cyan', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '-10px', left: '50%', width: '1px', height: '20px', background: 'cyan', opacity: 0.5 }} />
            <div style={{ position: 'absolute', bottom: '-10px', left: '50%', width: '1px', height: '20px', background: 'cyan', opacity: 0.5 }} />
          </div>

          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '8px',
            color: 'cyan',
            textShadow: '0 0 5px cyan',
            pointerEvents: 'none'
          }}>
            LAT: {coords.x.toFixed(4)}<br />
            LON: {coords.y.toFixed(4)}<br />
            ALT: 427.8m<br />
            OBJ: DETECTED
          </div>
        </>
      )}

      {/* HUD Overlay for video */}
      {active && (
        <div style={{
          position: 'absolute',
          inset: '40px 0 0 0',
          pointerEvents: 'none',
          border: '1px solid rgba(0,212,255,0.1)',
          background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.4))'
        }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderLeft: '1px solid cyan', borderTop: '1px solid cyan', opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderRight: '1px solid cyan', borderBottom: '1px solid cyan', opacity: 0.5 }} />
        </div>
      )}
    </div>
  );
}
