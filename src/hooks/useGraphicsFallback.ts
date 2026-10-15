import { useState } from 'react'

type MemoryNavigator = Navigator & { deviceMemory?: number }

function shouldUseFallback() {
  const canvas = document.createElement('canvas')
  const webgl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  const navigatorWithMemory = navigator as MemoryNavigator
  const lowMemory = navigatorWithMemory.deviceMemory !== undefined && navigatorWithMemory.deviceMemory <= 2
  const lowCpu = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2
  return !webgl || lowMemory || lowCpu
}

/** A lightweight CSS alternative for devices unlikely to enjoy multiple WebGL canvases. */
export function useGraphicsFallback() {
  const [fallback] = useState(shouldUseFallback)
  return fallback
}
