import { Center, Environment, Float, Lightformer, Sparkles, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { useRef } from 'react'
import type { Group } from 'three'
import * as THREE from 'three'

const PEONY_URL = `${import.meta.env.BASE_URL}models/peony.glb`
const HERO_X = 1.75
/** This Tripo export has the bloom facing +X; turn it toward the camera with a slight downward tilt */
const PEONY_ROTATION = [0.15, -Math.PI / 2, 0] as const

/** Mirror balls echo the chrome spheres used in the real photo zones (City Day, Green Marathon). */
const MIRROR_BALLS = [
  { position: [-1.15, -0.85, 0.5], radius: 0.34, speed: 1.6 },
  { position: [-1.05, 1.0, -0.6], radius: 0.46, speed: 1.2 },
  { position: [1.0, -1.05, 0.6], radius: 0.22, speed: 2 },
  { position: [0.95, 1.2, -0.3], radius: 0.16, speed: 1.8 },
] as const

function Peony() {
  const { scene } = useGLTF(PEONY_URL)
  return (
    <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.6}>
      <group rotation={[...PEONY_ROTATION]} scale={2}>
        <Center><primitive object={scene} /></Center>
      </group>
    </Float>
  )
}

function MirrorBalls() {
  return (
    <>
      {MIRROR_BALLS.map((ball) => (
        <Float key={ball.radius} speed={ball.speed} rotationIntensity={0} floatIntensity={0.9}>
          <mesh position={[...ball.position]}>
            <sphereGeometry args={[ball.radius, 64, 64]} />
            <meshStandardMaterial color="#f3ece2" metalness={1} roughness={0.06} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

function Composition() {
  const main = useRef<Group>(null)
  // On phones the text fills the left and middle, so the bouquet shrinks into the top-right corner
  const narrow = useThree((state) => state.size.width < 640)
  const baseX = narrow ? 0.3 : HERO_X

  useFrame(({ clock, pointer }) => {
    if (!main.current) return
    const t = clock.getElapsedTime()
    main.current.rotation.y = THREE.MathUtils.lerp(main.current.rotation.y, pointer.x * 0.3 + Math.sin(t * 0.2) * 0.25, 0.03)
    main.current.rotation.x = THREE.MathUtils.lerp(main.current.rotation.x, -pointer.y * 0.18, 0.03)
    main.current.position.x = THREE.MathUtils.lerp(main.current.position.x, baseX + pointer.x * 0.22, 0.02)
  })

  return (
    <group ref={main} position={[baseX, narrow ? 1.5 : 0, 0]} scale={narrow ? 0.62 : 1}>
      <Peony />
      <MirrorBalls />
    </group>
  )
}

/** Procedural studio reflections: no HDR download, warm softboxes that the chrome picks up. */
function StudioReflections() {
  return (
    <Environment resolution={256}>
      {/* Warm base tone so the chrome reads as polished metal instead of black glass */}
      <color attach="background" args={['#4a382d']} />
      <Lightformer form="rect" intensity={3} color="#ffe2b8" position={[3, 3, 4]} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#c88662" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
      <Lightformer form="ring" intensity={2.4} color="#fff3dc" position={[0, 5, -3]} scale={2.5} />
    </Environment>
  )
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.4], fov: 43 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#251f1b']} />
      <fog attach="fog" args={['#251f1b', 5, 12]} />
      <ambientLight intensity={0.6} color="#f4e7cd" />
      <pointLight position={[3, 3, 2]} intensity={18} color="#f0bb75" distance={8} />
      <pointLight position={[-4, -1, 1]} intensity={8} color="#c88662" distance={7} />
      <StudioReflections />
      <Composition />
      <Sparkles count={34} scale={[8, 5, 3]} size={1.25} speed={0.18} color="#f6dfb8" opacity={0.7} />
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.45} radius={0.6} />
        <Noise opacity={0.045} premultiply />
        <Vignette eskil={false} offset={0.25} darkness={0.82} />
      </EffectComposer>
    </Canvas>
  )
}

useGLTF.preload(PEONY_URL)
