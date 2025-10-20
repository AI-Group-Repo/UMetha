"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useFBX, Html } from "@react-three/drei";
import * as THREE from "three";

type Gender = "male" | "female";

interface OutfitItem {
  id: string;
  name: string;
  type: "top" | "bottom" | "shoes" | "accessories" | "suit" | "dress";
  price?: number;
  image?: string;
  color?: string;
  gender?: "male" | "female" | "unisex";
  size?: string;
  category?: string;
}

interface FbxModelViewerProps {
  items?: OutfitItem[];
  className?: string;
}

function pickGender(items?: OutfitItem[]): Gender {
  if (!items || items.length === 0) return "female";
  const lower = items.map(i => i.name?.toLowerCase() || "");
  const masculine = items.some(i => i.type === "suit" || i.gender === "male" || lower.some(n => n.includes("suit") || n.includes("tie") || n.includes("sneaker")));
  const feminine = items.some(i => i.type === "dress" || i.gender === "female" || lower.some(n => n.includes("dress") || n.includes("heel") || n.includes("purse")));
  if (masculine && !feminine) return "male";
  if (feminine && !masculine) return "female";
  return "female";
}

function Model({ gender }: { gender: Gender }) {
  const primaryPath = useMemo(() => (
    gender === "male"
      ? "/models/Male Fighter/male_fighter_03.fbx"
      : "/models/Female Fighter/female_fighter_01.fbx"
  ), [gender]);

  // Fallbacks in case the primary path fails at runtime
  const fallbackPath = useMemo(() => (
    gender === "male" ? "/models/Warrior/warrior_03.fbx" : "/models/Cowgirl/cowgirl.fbx"
  ), [gender]);

  let fbx: THREE.Group;
  try {
    fbx = useFBX(primaryPath);
  } catch (e) {
    fbx = useFBX(fallbackPath);
  }

  // Normalize: center and scale to target height ~1.7m
  const group = useMemo(() => {
    const container = new THREE.Group();
    const model = fbx.clone(true);

    model.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (!(obj.material instanceof THREE.MeshStandardMaterial)) {
          obj.material = new THREE.MeshStandardMaterial({ color: 0xffffff, skinning: !!obj.skeleton });
        }
      }
    });

    // Compute bounding box
    const bbox = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bbox.getSize(size);
    bbox.getCenter(center);

    // Center the model at origin on X/Z and feet at y= -1
    model.position.sub(center);
    // Move down by half height so feet are near y=-1 after scale
    model.position.y -= -bbox.min.y;

    // Scale to target height 1.7
    const targetHeight = 1.7;
    const scaleFactor = size.y > 0 ? targetHeight / size.y : 1.0;
    model.scale.setScalar(scaleFactor);

    container.add(model);
    // Slight rotate to face camera nicely
    container.rotation.y = Math.PI;
    container.position.set(0, -1.0, 0);
    return container;
  }, [fbx]);

  return <primitive object={group} />;
}

function WornOverlays({ items }: { items: OutfitItem[] }) {
  // Simple overlays positioned around model in world space
  return (
    <group>
      {items.map((item, idx) => {
        const color = item.color || "#4f46e5";
        switch (item.type) {
          case "top":
          case "suit":
            return (
              <mesh position={[0, 0.3, 0]} key={`${item.id}-${idx}`}>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshStandardMaterial color={color} transparent opacity={0.4} />
              </mesh>
            );
          case "bottom":
            return (
              <mesh position={[0, -0.2, 0]} key={`${item.id}-${idx}`}>
                <cylinderGeometry args={[0.28, 0.35, 0.6, 24]} />
                <meshStandardMaterial color={color} transparent opacity={0.35} />
              </mesh>
            );
          case "shoes":
            return (
              <group key={`${item.id}-${idx}`}>
                <mesh position={[-0.15, -0.95, 0.1]}>
                  <boxGeometry args={[0.18, 0.08, 0.3]} />
                  <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0.15, -0.95, 0.1]}>
                  <boxGeometry args={[0.18, 0.08, 0.3]} />
                  <meshStandardMaterial color={color} />
                </mesh>
              </group>
            );
          case "accessories":
            return (
              <mesh position={[0.28, 0.45, 0]} key={`${item.id}-${idx}`}>
                <torusGeometry args={[0.06, 0.015, 16, 32]} />
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
              </mesh>
            );
          case "dress":
            return (
              <mesh position={[0, 0.0, 0]} key={`${item.id}-${idx}`}>
                <coneGeometry args={[0.55, 1.2, 24]} />
                <meshStandardMaterial color={color} transparent opacity={0.35} />
              </mesh>
            );
          default:
            return null;
        }
      })}
    </group>
  );
}

export default function FbxModelViewer({ items = [], className = "" }: FbxModelViewerProps) {
  const gender = pickGender(items);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 1.3, 2.4], fov: 45 }} shadows style={{ background: "linear-gradient(180deg,#0f172a,#111827)" }}>
        <Suspense fallback={null}>
          {/* Lights */}
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 6, 4]} intensity={1.15} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <hemisphereLight skyColor={0x88aaff} groundColor={0x222222} intensity={0.5} />

          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color={0x0b1220} />
          </mesh>

          {/* Model and overlays */}
          <Model gender={gender} />
          <WornOverlays items={items} />

          {/* Controls and environment */}
          <OrbitControls enablePan={false} minDistance={1.5} maxDistance={4} enableDamping dampingFactor={0.08} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
