import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useRef, useState } from 'react'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'
import { projectPhoto, projects } from '../../data'

const CARD_WIDTH = 1.72
const CARD_HEIGHT = 2.18

/** Crops the texture like CSS object-fit: cover, so photos keep their proportions on the card. */
function coverTexture(texture: THREE.Texture) {
  const image = texture.image as HTMLImageElement
  const imageAspect = image.width / image.height
  const cardAspect = CARD_WIDTH / CARD_HEIGHT
  if (imageAspect > cardAspect) texture.repeat.set(cardAspect / imageAspect, 1)
  else texture.repeat.set(1, imageAspect / cardAspect)
  texture.offset.set((1 - texture.repeat.x) / 2, (1 - texture.repeat.y) / 2)
  texture.colorSpace = THREE.SRGBColorSpace
}

type CardProps = { index: number; angle: number; url: string }

function CarouselCard({ index, angle, url }: CardProps) {
  const mesh = useRef<Mesh>(null)
  const texture = useTexture(url, coverTexture)
  const radius = 3.35

  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.position.y = Math.sin(clock.getElapsedTime() * 0.7 + index) * 0.08
  })

  return (
    <mesh ref={mesh} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, -angle, 0]}>
      <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
      <meshStandardMaterial map={texture} roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
  )
}

function CarouselObjects({ target }: { target: number }) {
  const group = useRef<Group>(null)
  useFrame(() => {
    if (group.current) group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 4.4, 1 / 60)
  })
  return (
    <group ref={group}>
      {projects.map((project, index) => (
        <CarouselCard key={project.id} index={index} angle={(Math.PI * 2 * index) / projects.length} url={projectPhoto(project.id, project.cover)} />
      ))}
    </group>
  )
}

export default function PortfolioCarousel() {
  const [target, setTarget] = useState(0)
  const touchStart = useRef<number | null>(null)

  return (
    <div
      className="portfolio-carousel"
      role="region"
      aria-label="Трёхмерная карусель работ. Прокручивайте колесом или свайпайте для вращения."
      onWheel={(event) => {
        event.preventDefault()
        setTarget((value) => value + event.deltaY * 0.005)
      }}
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        const end = event.changedTouches[0]?.clientX
        if (start !== null && end !== undefined) setTarget((value) => value + (start - end) * 0.012)
        touchStart.current = null
      }}
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.15, 6.3], fov: 36 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={1.75} />
        <spotLight position={[2, 5, 5]} intensity={32} angle={0.34} penumbra={1} color="#ffe4b4" />
        <pointLight position={[-4, -2, 3]} intensity={11} color="#b77a5a" />
        <CarouselObjects target={target} />
      </Canvas>
      <span className="carousel-hint" aria-hidden="true">листайте / свайпайте</span>
    </div>
  )
}
