"use client"; // tells Next.js to render this on the client browser

import React, { useRef, useState } from "react";
import * as THREE from "three"; // imperatively access THREE.js library
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";

type CuberParms = {
  position: [number, number, number];
  scale?: number;
  // include all other mesh props except position & scale
} & Omit<ThreeElements["mesh"], "position" | "scale">; // with this Typescript utility type - props are typed and destructured
// without TypeScript Type we would need to spread all props

export function Cuber({ position, scale = 1, ...props }: CuberParms) {
  // point to mesh
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => setClicked(!clicked)}
      onPointerOver={(event) => setHovered(true)}
      onPointerOut={(event) => setHovered(false)}
    >
      <boxGeometry args={[2, 1, 1]} />
      <meshStandardMaterial color={hovered ? "blue" : "green"} />
    </mesh>
  );
}
export function Scene3D() {
  console.log("rendering scene3d now");
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas>
        {/* {console.log("Inside Canvas")} */}
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1} // soft edges
          decay={0} // no light falloff
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {/* // position on grid from (0,0,0)  */}
        <Cuber position={[-1.2, 0, 0]} castShadow receiveShadow />
        <Cuber position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  );
}
