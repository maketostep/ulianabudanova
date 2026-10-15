import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

type MorphSceneProps = { progress: MutableRefObject<number> }

function MorphingObject({ progress }: MorphSceneProps) {
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  const ringOne = useRef<Mesh>(null)
  const ringTwo = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const p = progress.current
    const time = clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = time * 0.22 + p * Math.PI * 1.35
      group.current.rotation.z = -0.23 + p * 0.7
      group.current.position.x = THREE.MathUtils.lerp(0.9, 0.3, p)
      group.current.position.y = THREE.MathUtils.lerp(0, 0.1, p)
      group.current.scale.setScalar(THREE.MathUtils.lerp(0.95, 1.15, p))
    }
    if (core.current) {
      const scale = THREE.MathUtils.lerp(0.92, 1.05, p) + Math.sin(time * 1.6) * 0.02
      core.current.scale.set(scale, THREE.MathUtils.lerp(1.08, 0.9, p), scale)
    }
    if (ringOne.current) ringOne.current.rotation.x = time * 0.26 + p * Math.PI
    if (ringTwo.current) ringTwo.current.rotation.y = -time * 0.18 - p * Math.PI * 1.25
  })

  return (
    <group ref={group}>
      <mesh ref={core}>
        <sphereGeometry args={[0.82, 64, 64]} />
        <meshStandardMaterial color="#c29562" roughness={0.22} metalness={0.7} />
      </mesh>
      <mesh ref={ringOne} rotation={[1.1, 0.1, 0.2]}>
        <torusGeometry args={[1.18, 0.036, 12, 120]} />
        <meshBasicMaterial color="#f4ddad" transparent opacity={0.82} />
      </mesh>
      <mesh ref={ringTwo} rotation={[-0.2, 0.9, 0]}>
        <torusGeometry args={[1.4, 0.022, 10, 120]} />
        <meshBasicMaterial color="#a97c50" transparent opacity={0.62} />
      </mesh>
    </group>
  )
}

export default function MorphScene({ progress }: MorphSceneProps) {
  return (
    <Canvas dpr={[1, 1.4]} camera={{ position: [0, 0, 4.2], fov: 41 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 3]} intensity={3.6} color="#ffe6bb" />
      <pointLight position={[-3, -2, 1]} intensity={1.8} color="#725447" />
      <MorphingObject progress={progress} />
    </Canvas>
  )
}
