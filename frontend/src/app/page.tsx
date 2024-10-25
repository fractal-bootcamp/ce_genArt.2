import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Scene3D } from "./cube";

export default function Home() {
  console.log("render home component");
  return (
    <div>
      <h1>hi</h1>
      <SignedIn>
        signed in yay
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        not signed in
        <SignInButton />
      </SignedOut>
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
