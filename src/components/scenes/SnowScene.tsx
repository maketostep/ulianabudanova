import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Points } from 'three'
import * as THREE from 'three'

function SnowParticles() {
  const points = useRef<Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(820 * 3)
    for (let i = 0; i < 820; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 13
      values[i * 3 + 1] = Math.random() * 7 - 3.5
      values[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return values
  }, [])

  useFrame(({ clock }) => {
    if (!points.current) return
    points.current.rotation.y = clock.getElapsedTime() * 0.022
    points.current.position.y = -((clock.getElapsedTime() * 0.1) % 1) * 0.42
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying float vAlpha;
          void main() {
            vAlpha = 0.45 + sin(position.x * 1.7 + position.y) * 0.28;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 4.0 * (18.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            float snow = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(1.0, 0.94, 0.82, snow * vAlpha);
          }
        `}
      />
    </points>
  )
}

function Lights() {
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.38) * 0.05
  })
  return (
    <group ref={group}>
      {[-2.6, -1.25, 0, 1.25, 2.6].map((x, index) => (
        <mesh key={x} position={[x, Math.sin(index) * 0.4, -0.3]}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <meshBasicMaterial color={index % 2 ? '#f2b554' : '#ffdfad'} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export default function SnowScene() {
  return (
    <Canvas dpr={[1, 1.4]} camera={{ position: [0, 0, 4.5], fov: 48 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
      <fog attach="fog" args={['#172520', 2, 9]} />
      <ambientLight intensity={0.35} color="#d9f3e8" />
      <pointLight position={[0, 1.4, 2]} intensity={16} color="#ffd68c" distance={7} />
      <SnowParticles />
      <Lights />
    </Canvas>
  )
}
