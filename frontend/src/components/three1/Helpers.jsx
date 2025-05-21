// Helpers.jsx

import { useRef } from "react"
import { useHelper } from "@react-three/drei"
import * as THREE from "three"

const Helpers = () => {
  const boxRef = useRef()
  useHelper(boxRef, THREE.BoxHelper, "blue")

  return (
    <>
      <primitive object={new THREE.GridHelper(10, 10)} />
      <mesh ref={boxRef}>
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial wireframe />
      </mesh>
    </>
  )
}

export default Helpers