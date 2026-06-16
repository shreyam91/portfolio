import { ReactThreeFiber, extendThreeElements } from '@react-three/fiber'
import * as THREE from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      canvas: ReactThreeFiber.Object3DNode<HTMLCanvasElement, typeof HTMLCanvasElement> & {
        shadows?: boolean
        camera?: {
          position?: [number, number, number]
          fov?: number
          near?: number
          far?: number
        }
      }
    }
  }
}

// Extend Three.js elements
extendThreeElements({
  // Add any custom elements here if needed
})
