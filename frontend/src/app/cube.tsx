"use client"; // tells Next.js to render this on the client browser

import React, { useRef, useState } from "react";
import * as THREE from "three"; // imperatively access THREE.js library
import { Canvas, useFrame, ThreeElements, extend } from "@react-three/fiber";
import { OrbitControls, Grid, Float } from "@react-three/drei";
import { NoiseShaderMaterial, NoiseShaderMaterialType } from "./material";

extend({ NoiseShaderMaterial });

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
  const materialRef = useRef<NoiseShaderMaterialType>(null);

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
        meshRef.current.rotation.x = time * 1;
        meshRef.current.rotation.y = time * 0.5;
      }
    }
    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.elapsedTime;
      materialRef.current.uniforms.speed.value = hovered ? 1.0 : 0.5;
      materialRef.current.uniforms.intensity.value = hovered ? 0.5 : 0.3;
      // Normalize position values to create better gradient distribution
      materialRef.current.uniforms.positionIndex.value = new THREE.Vector2(
        (position[0] + 10) / 20, // Normalize x position to 0-1 range
        (position[1] + 10) / 20 // Normalize y position to 0-1 range
      );
      materialRef.current.uniforms.depthIndex.value =
        Math.floor(index / 33) % 3;
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
      <boxGeometry
        args={[2, 0.1, 0.5]}
        onUpdate={(geometry) => {
          const uvAttribute = geometry.attributes.uv;
          for (let i = 0; i < uvAttribute.count; i++) {
            // Ensure UVs span full 0-1 range
            uvAttribute.setXY(
              i,
              i % 2, // Alternating 0 and 1 for x
              Math.floor(i / 2) % 2 // Alternating 0 and 1 for y
            );
          }
          uvAttribute.needsUpdate = true;
        }}
      />
      <noiseShaderMaterial
        ref={materialRef}
        transparent
        depthWrite={true}
        side={THREE.DoubleSide}
      />{" "}
      // Render both sides of the geometry
      {/* <meshStandardMaterial color={hovered ? "blue" : "green"} />
       */}
    </mesh>
  );
}
export function Scene3D() {
  //SINGLE ARRAY IN COLUMN

  const cuberArray = Array.from({ length: 100 }, (_, index) => {
    const position = [0, index * 0.1, 1] as [number, number, number];
    // console.log(`Create cube ${index} at position:`, position);
    return position;
  });

  console.log("rendering scene3d now");
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [-5, 8, 5], fov: 50 }}>
        {/* {console.log("Inside Canvas")} */}
        <color attach="background" args={["#666666"]} />
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
        <Float speed={5.5} rotationIntensity={0.5} floatIntensity={0.5}>
          {cuberArray.map((position, index) => (
            <Cuber
              key={index}
              position={position}
              index={index}
              castShadow
              receiveShadow
            />
          ))}
        </Float>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={20}
          target={[0, 2, 0]}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 4}
          makeDefault
        />
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
