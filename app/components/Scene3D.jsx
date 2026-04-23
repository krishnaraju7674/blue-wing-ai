'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

function DigitalTwin({ isAlert }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[4, -2, -5]}>
      <mesh ref={ref}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshBasicMaterial wireframe color="#00d4ff" transparent opacity={0.05} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshBasicMaterial color="#7c6cf0" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function NeuralMap({ count = 30 }) {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10));
    }
    return p;
  }, [count]);

  const lines = useMemo(() => {
    const l = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 3) {
          l.push(points[i], points[j]);
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(l);
  }, [points]);

  const lineRef = useRef();
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.05 + Math.sin(state.clock.elapsedTime) * 0.03;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={lines}>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

/* ── Particle Ring ── */
function ParticleRing({ radius, count, speed, tilt, color, size = 0.025 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const jitter = 0.06;
      arr[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * jitter;
      arr[i * 3 + 1] = (Math.random() - 0.5) * jitter;
      arr[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * jitter;
    }
    return arr;
  }, [radius, count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <points ref={ref} rotation={[tilt, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Waveform Ring (audio visualizer bars) ── */
function WaveformRing({ radius, barCount, agentState, isAlert }) {
  const barsRef = useRef([]);
  const groupRef = useRef();

  useFrame(() => {
    const time = performance.now() * 0.001;
    const isActive = agentState === 'processing' || agentState === 'listening';
    groupRef.current.rotation.y = time * 0.15;

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const baseHeight = isActive ? 0.15 : 0.03;
      const amplitude = isActive ? 0.25 : 0.02;
      const freq = isActive ? 4 : 1;
      const h = baseHeight + Math.sin(time * freq + i * 0.7) * amplitude;
      bar.scale.y = Math.max(0.01, h);
      bar.material.opacity = isActive ? 0.5 : 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: barCount }, (_, i) => {
        const angle = (i / barCount) * Math.PI * 2;
        return (
          <mesh
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[0.015, 1, 0.015]} />
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Wireframe Shell ── */
function WireframeShell({ agentState, isAlert }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.08;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
      const scale = agentState === 'processing' ? 2.1 : agentState === 'sleeping' ? 1.6 : 1.85;
      ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.02);
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        wireframe
        color="#0088ff"
        transparent
        opacity={agentState === 'sleeping' ? 0.03 : 0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Second Wireframe (counter-rotating) ── */
function WireframeShell2({ agentState, isAlert }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = -state.clock.elapsedTime * 0.06;
      ref.current.rotation.x = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[2.3, 0]} />
      <meshBasicMaterial
        wireframe
        color="#6c5ce7"
        transparent
        opacity={agentState === 'sleeping' ? 0.02 : 0.04}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Split Spheres (for "split" command) ── */
function SplitSpheres({ isSpeaking, isAlert }) {
  const groupRef = useRef();
  const lineRef = useRef();
  const spheres = [
    { pos: new THREE.Vector3(-1.8, 0.8, 0), color: '#0096ff' },
    { pos: new THREE.Vector3(1.8, 0.8, 0), color: '#00d4ff' },
    { pos: new THREE.Vector3(0, -1.5, 0), color: '#7c6cf0' },
  ];

  useFrame((state) => {
    const speed = isSpeaking ? 1.5 : 0.5;
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
    if (lineRef.current) {
      lineRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  const lineGeometry = useMemo(() => {
    const points = [];
    points.push(spheres[0].pos, spheres[1].pos);
    points.push(spheres[1].pos, spheres[2].pos);
    points.push(spheres[2].pos, spheres[0].pos);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <group>
      <group ref={groupRef}>
        {spheres.map((s, i) => (
          <Float key={i} speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={s.pos}>
              <sphereGeometry args={[0.6, 32, 32]} />
              <MeshDistortMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={isSpeaking ? 3 : 1.2}
                distort={isSpeaking ? 0.6 : 0.4}
                speed={isSpeaking ? 8 : 4}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
          </Float>
        ))}
      </group>
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#00d4ff" transparent opacity={isSpeaking ? 0.5 : 0.2} linewidth={1} />
      </lineSegments>
    </group>
  );
}

/* ── Core Sphere ── */
function CoreSphere({ agentState, isSpeaking, isAlert }) {
  const meshRef = useRef();
  const lightRef = useRef();

  const coreColor = useMemo(() => {
    if (isAlert) return '#ff0033';
    switch (agentState) {
      case 'processing': return '#7c6cf0';
      case 'listening': return '#00e676';
      case 'sleeping': return '#1a1a3e';
      default: return '#0088ff';
    }
  }, [agentState]);

  useFrame((state) => {
    if (meshRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      const jitter = isSpeaking ? Math.sin(state.clock.elapsedTime * 40) * 0.02 : 0;
      const s = agentState === 'sleeping' ? 0.8 : 1 + breathe + jitter;
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.03);
    }
    if (lightRef.current) {
      const pulse = (isSpeaking ? 4 : 2) + Math.sin(state.clock.elapsedTime * (isSpeaking ? 20 : 1.2)) * 0.8;
      lightRef.current.intensity = agentState === 'sleeping' ? 0.3 : pulse;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.3, 64, 64]} />
          <MeshDistortMaterial
            color={coreColor}
            emissive={coreColor}
            emissiveIntensity={isSpeaking ? 3 : agentState === 'processing' ? 2.5 : 1.2}
            distort={isSpeaking ? 0.6 : 0.3}
            speed={isSpeaking ? 10 : 2}
            roughness={0.1}
            metalness={0.85}
            transparent
            opacity={agentState === 'sleeping' ? 0.4 : 0.9}
          />
        </mesh>
      </Float>
      <pointLight ref={lightRef} color={coreColor} intensity={2} distance={15} decay={2} />
    </group>
  );
}

/* ── Ambient Floating Particles ── */
function AmbientParticles({ count = 200, agentState, isSpeaking }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      
      const posAttr = ref.current.geometry.attributes.position;
      const speed = isSpeaking ? 0.02 : agentState === 'processing' ? -0.04 : 0.005;
      
      if (Math.abs(speed) > 0.001) {
        for (let i = 0; i < count; i++) {
          const x = posAttr.getX(i);
          const y = posAttr.getY(i);
          const z = posAttr.getZ(i);
          
          const dir = new THREE.Vector3(x, y, z).normalize();
          posAttr.setXYZ(i, x + dir.x * speed, y + dir.y * speed, z + dir.z * speed);
          
          // Reset particles that get too close or too far
          const dist = new THREE.Vector3(x, y, z).length();
          if (dist < 0.5 || dist > 15) {
            posAttr.setXYZ(i, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
          }
        }
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#4466aa"
        transparent
        opacity={agentState === 'sleeping' ? 0.1 : 0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Main Scene ── */
export default function Scene3D({ agentState, isSpeaking, godMode, isAlert }) {
  const ambientRef = useRef();
  
  useFrame((state) => {
    if (ambientRef.current) {
      const basePulse = agentState === 'sleeping' ? 0.02 : isAlert ? 0.2 : 0.08;
      const voiceAmp = isSpeaking ? 0.15 + Math.sin(state.clock.elapsedTime * 20) * 0.05 : 0;
      const ambient = basePulse + Math.sin(state.clock.elapsedTime * 0.5) * 0.02 + voiceAmp;
      ambientRef.current.intensity = ambient;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight ref={ambientRef} intensity={0.08} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={agentState === 'sleeping' ? 0.05 : isSpeaking || godMode || isAlert ? 1.2 : 0.15} 
        color={isAlert ? "#ff0000" : godMode ? "#ffd700" : isSpeaking ? "#00d4ff" : "#4488ff"} 
      />
      <directionalLight position={[-5, -3, -5]} intensity={agentState === 'sleeping' ? 0.02 : 0.08} color={isAlert ? "#880000" : "#6644cc"} />

      {/* Background Neural Map & Hardware Twin */}
      <NeuralMap count={isAlert ? 60 : 30} />
      <DigitalTwin isAlert={isAlert} />

      {/* Core */}
      {agentState === 'split' ? (
        <SplitSpheres isSpeaking={isSpeaking} isAlert={isAlert} />
      ) : (
        <CoreSphere agentState={agentState} isSpeaking={isSpeaking} isAlert={isAlert} />
      )}

      {/* Wireframe Shells */}
      <WireframeShell agentState={agentState} isAlert={isAlert} />
      <WireframeShell2 agentState={agentState} isAlert={isAlert} />

      {/* Particle Rings */}
      <ParticleRing radius={2.2} count={180} speed={isAlert ? 0.8 : 0.15} tilt={0.3} color={isAlert ? "#ff0000" : godMode ? "#ffd700" : "#0096ff"} />
      <ParticleRing radius={2.6} count={120} speed={isAlert ? -0.5 : -0.1} tilt={-0.5} color={isAlert ? "#ff3300" : godMode ? "#ffaa00" : "#00d4ff"} size={0.02} />
      <ParticleRing radius={3.0} count={90} speed={isAlert ? 0.4 : 0.07} tilt={1.2} color={isAlert ? "#ff6600" : godMode ? "#ffffff" : "#7c6cf0"} size={0.018} />

      {/* Waveform Visualizer Ring */}
      <WaveformRing radius={2.8} barCount={64} agentState={agentState} isAlert={isAlert} />

      {/* Ambient Effects */}
      <AmbientParticles agentState={agentState} isSpeaking={isSpeaking} isAlert={isAlert} />
      <Sparkles
        count={isAlert ? 150 : 80}
        size={1.5}
        scale={12}
        speed={isAlert ? 2 : 0.3}
        opacity={agentState === 'sleeping' ? 0.1 : 0.5}
        color={isAlert ? "#ff0000" : godMode ? "#ffd700" : "#00aaff"}
      />
      <Stars radius={50} depth={60} count={1500} factor={3} fade speed={isAlert ? 2 : 0.5} />

      {/* Post-Processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          intensity={isAlert ? 4.0 : godMode ? 3.0 : agentState === 'sleeping' ? 0.3 : 1.6}
          mipmapBlur
        />
        <Vignette darkness={isAlert ? 1.0 : agentState === 'sleeping' ? 0.9 : 0.65} offset={0.3} />
        {(godMode || isAlert) && (
          <>
            <ChromaticAberration offset={isAlert ? [0.008, 0.008] : [0.002, 0.002]} radialModulation={true} modulationOffset={0.5} />
            <Noise opacity={isAlert ? 0.2 : 0.05} blendFunction={BlendFunction.OVERLAY} />
          </>
        )}
      </EffectComposer>
    </>
  );
}
