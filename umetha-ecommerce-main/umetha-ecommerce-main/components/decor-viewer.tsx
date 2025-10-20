"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface DecorViewerProps {
  selected?: { id?: number; name?: string; modelPath?: string | null } | null;
  className?: string;
}

function PrimitiveSofa({ color = "#374151" }) {
  return (
    <group position={[0, -0.9, 0]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.35, -0.2]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.8, 0.25, 0.45]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.8, 0.25, 0.45]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function PrimitiveTable() {
  return (
    <group position={[0, -0.9, -1.2]}>
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 32]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh castShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.24, 16]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
    </group>
  );
}

function PrimitiveLamp() {
  return (
    <group position={[1.2, -0.9, -0.6]}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <coneGeometry args={[0.25, 0.3, 24]} />
        <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
    </group>
  );
}

function GLTFModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Normalize and scale
  const bbox = useMemo(() => new THREE.Box3().setFromObject(cloned), [cloned]);
  const size = useMemo(() => bbox.getSize(new THREE.Vector3()), [bbox]);
  const center = useMemo(() => bbox.getCenter(new THREE.Vector3()), [bbox]);
  useMemo(() => {
    cloned.position.sub(center);
    const target = 2.0; // fit within 2 meters
    const scale = Math.max(size.x, size.y, size.z) > 0 ? target / Math.max(size.x, size.y, size.z) : 1;
    cloned.scale.setScalar(scale);
    cloned.position.y = -0.9;
  }, [cloned, size, center]);

  return <primitive object={cloned} />;
}

export default function DecorViewer({ selected, className = "" }: DecorViewerProps) {
  const modelPath = selected?.modelPath || null;
  const layout = selected?.name || "Modern Minimalist";

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas camera={{ position: [2.2, 1.8, 2.8], fov: 45 }} shadows style={{ background: "linear-gradient(180deg,#0b1020,#0a0f1a)" }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 6, 4]} intensity={1.1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <hemisphereLight skyColor={0x88aaff} groundColor={0x222222} intensity={0.5} />

          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color={0x0b1220} />
          </mesh>

          {modelPath ? (
            <GLTFModel path={modelPath} />
          ) : (
            <group>
              {/* Simple staged layout by style */}
              <PrimitiveSofa color={layout.includes("Bohemian") ? "#7c3aed" : layout.includes("Rustic") ? "#6b7280" : "#374151"} />
              <PrimitiveTable />
              <PrimitiveLamp />
            </group>
          )}

          <OrbitControls enableDamping dampingFactor={0.08} minDistance={1.8} maxDistance={6} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload default gltf types declaration
useGLTF.preload?.("/models/example.glb");
