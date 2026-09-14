import { Environment, Float, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Shared                                                             */
/* ------------------------------------------------------------------ */

const INK = "#1e1e1c";
const PAPER = "#f5f4f0";

/** Warm paper background + matching fog so geometry melts into the page. */
function SceneBackdrop() {
  return (
    <>
      <color attach="background" args={[PAPER]} />
      <fog attach="fog" args={[PAPER, 12, 30]} />
    </>
  );
}

/** Soft gallery lighting: high ambient, one key, one cool rim. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} />
      <directionalLight position={[-8, 4, -6]} intensity={0.4} color="#dfe4ea" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Monoliths                                                          */
/* tall matte boxes — the studio's signature solid                     */
/* ------------------------------------------------------------------ */

function Monolith({
  position,
  rotation = [0, 0, 0],
  size = [1, 2.6, 1],
  delay = 0,
  hue = 0,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number, number];
  delay?: number;
  hue?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  // GSAP intro: each solid rises and settles on a staggered delay.
  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        g.scale,
        { x: 0.001, y: 0.001, z: 0.001 },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.4,
          delay,
          ease: "expo.out",
        },
      );
      gsap.fromTo(
        g.rotation,
        { y: rotation[1] - 0.9 },
        {
          y: rotation[1],
          duration: 1.8,
          delay,
          ease: "expo.out",
        });
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Perpetual drift — slow, deliberate, unhurried.
    g.rotation.z = rotation[2] + Math.sin(t * 0.25 + delay) * 0.05;
    g.rotation.y = rotation[1] + Math.sin(t * 0.18 + delay) * 0.14;
    g.position.y = position[1] + Math.sin(t * 0.4 + delay * 2) * 0.12;
  });

  const base = new THREE.Color(INK).lerp(new THREE.Color(PAPER), 0.12 + hue * 0.16);
  const edge = new THREE.Color(INK).lerp(new THREE.Color(PAPER), 0.28 + hue * 0.2);

  return (
    <group ref={ref} position={position} rotation={rotation} scale={0.001}>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={base} roughness={0.92} metalness={0.02} />
      </mesh>
      {/* Precision edge line — the drafting mark that sells the minimality */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color={edge} transparent opacity={0.28} />
      </lineSegments>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbit stone                                                        */
/* ------------------------------------------------------------------ */

function OrbitStone({ delay = 0 }: { delay?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        m.scale,
        { x: 0.001, y: 0.001, z: 0.001 },
        { x: 1, y: 1, z: 1, duration: 1.2, delay, ease: "expo.out" },
      );
    });
    return () => ctx.revert();
  }, [delay]);

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.x = t * 0.12;
    m.rotation.y = t * 0.2;
  });

  return (
    <mesh ref={ref} position={[2.5, 1.35, 0.4]} scale={0.001}>
      <icosahedronGeometry args={[0.42, 0]} />
      <meshStandardMaterial color="#8b8b86" roughness={0.5} metalness={0.1} flatShading />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Pointer parallax                                                   */
/* ------------------------------------------------------------------ */

function PointerParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const x = state.pointer.x;
    const y = state.pointer.y;
    g.rotation.y = gsap.utils.interpolate(g.rotation.y, x * 0.08, 0.045);
    g.rotation.x = gsap.utils.interpolate(g.rotation.x, -y * 0.06, 0.045);
  });
  return <group ref={ref}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

export default function MonolithScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 9], fov: 42 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "transparent" }}
    >
      <SceneBackdrop />
      <Lights />
      <PointerParallax>
        <group position={[0, 0.2, 0]}>
          <Monolith position={[-2.9, 0.3, 0]} size={[1.1, 2.8, 1.1]} rotation={[0, 0.5, 0.02]} delay={0.15} hue={0.0} />
          <Monolith position={[0, -0.6, -1.5]} size={[1.3, 3.4, 1.3]} rotation={[0, 0.15, -0.015]} delay={0.3} hue={0.35} />
          <Monolith position={[2.8, -0.1, 0.6]} size={[0.95, 2.2, 0.95]} rotation={[0, -0.4, 0.03]} delay={0.45} hue={0.7} />
          <OrbitStone delay={0.85} />
          <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.5}>
            <mesh position={[-4.4, 1.6, -2]}>
              <torusGeometry args={[0.32, 0.012, 16, 64]} />
              <meshStandardMaterial color="#5f5f5a" roughness={0.4} />
            </mesh>
          </Float>
        </group>
      </PointerParallax>
      <ContactShadows position={[0, -2.35, 0]} opacity={0.32} scale={14} blur={2.6} far={4.2} resolution={512} color="#3a3a36" />
      {/* Suspense guard: Environment streams an HDR from a CDN; render without it if unavailable */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
