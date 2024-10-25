import { Scene3D } from "./cube";

export default function Home() {
  console.log("render home component");
  return (
    <div>
      <h1>hi</h1>
      {(() => {
        console.log("render before 3d");
        return null;
      })()}
      <Scene3D />
      {(() => {
        console.log("render");
        return null;
      })()}
    </div>
  );
}
