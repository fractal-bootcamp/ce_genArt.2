"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

interface SaveStateProps {
  currentState: {
    colors: {
      layer1Primary: string;
      layer1Secondary: string;
      layer2Primary: string;
      layer2Secondary: string;
      layer3Primary: string;
      layer3Secondary: string;
    };
    animation: {
      speed: number;
      intensity: number;
    };
    grid: {
      spacing: number;
    };
  };
}

export function SaveStateButton({ currentState }: SaveStateProps) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !title) return;

    setIsSaving(true);
    try {
      const response = await fetch("api/artwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          configuration: currentState,
          published: true,
        }),
      });

      if (!response.ok) {
        throw new Error("failed to save");
      }

      // reset form and show success message
      setTitle("");
      alert("successful save!");
    } catch (error) {
      console.error("error saveing:", error);
      alert("failed to save!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-white rounded-lg shadow-lg">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="what do they call you"
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={handleSave}
        disabled={isSaving || !title}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded
                hover:bg-blue-600 disabled:bg-gray-300"
      >
        {isSaving ? "Saving..." : "Save Configuration"}
      </button>
    </div>
  );
}
