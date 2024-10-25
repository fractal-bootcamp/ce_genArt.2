"use client"; // tells Next.js to render this on the client browser

import React, { useRef, useState } from "react";
import * as THREE from "three"; // imperatively access THREE.js library
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

type CuberParms = {
  position: [number, number, number];
  scale?: number;
  index: number;
  // include all other mesh props except position & scale
} & Omit<ThreeElements["mesh"], "position" | "scale" | "index">; // with this Typescript utility type - props are typed and destructured
// without TypeScript Type we would need to spread all props

export function Cuber({ position, index, scale = 1, ...props }: CuberParms) {
  // point to mesh
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const delay = index * 0.2; // delay based on index
      const time = clock.elapsedTime - delay; // delay .2 s b/w each cube

      const baseScale = Math.pow(1, index); // scale decreases based on index
      const clickedScale = clicked ? baseScale * 1.5 : baseScale;
      meshRef.current.scale.set(clickedScale, clickedScale, clickedScale);
      if (time > 0) {
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => setClicked(!clicked)}
      onPointerOver={(event) => setHovered(true)}
      onPointerOut={(event) => setHovered(false)}
    >
      <boxGeometry args={[2, 1, 0.2]} />
      <meshStandardMaterial color={hovered ? "blue" : "green"} />
    </mesh>
  );
}
export function Scene3D() {
  //   const rows = 300;
  //   const cols = 50;
  //   const cuberArray = [];

  //   for (let i = 0; i < rows; i++) {
  //     for (let j = 0; j < cols; j++) {
  //       // control spacing
  //       const x = j * 3; // hori
  //       const y = i * 3; // vert
  //       cuberArray.push([x, y, 0] as [number, number, number]);
  //     }
  //   }

  //SINGLE ARRAY IN COLUMN

  const cuberArray = Array.from({ length: 100 }, (_, index) => {
    const position = [0, index * 0.5, 1] as [number, number, number];
    console.log(`Create cube ${index} at position:`, position);
    return position;
  });

  console.log("rendering scene3d now");
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [10, 5, 15], fov: 75 }}>
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
        {/* // map position on grid from (0,0,0)  */}
        {/* <Cuber position={[2, 2, 5]} /> */}
        {cuberArray.map((position, index) => (
          <Cuber
            key={index}
            position={position}
            index={index}
            castShadow
            receiveShadow
          />
        ))}
        <OrbitControls />
        <Grid // Shows a grid to help with positioning
          args={[20, 20]}
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={1}
          cellColor="#6f6f6f"
          sectionSize={3}
        />
        <axesHelper args={[5]} /> {/* Shows X,Y,Z axes */}
      </Canvas>
    </div>
  );
}
