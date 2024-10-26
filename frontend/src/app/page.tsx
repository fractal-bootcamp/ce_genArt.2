"use client";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { Scene3D } from "./cube";

export default function Home() {
  const { getToken } = useAuth();
  (async () => {
    console.log(await getToken());
  })();

  return (
    <div>
      Hey CC
      <Scene3D />
    </div>
  );
}
