"use client";

import * as React from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFullscreen}
      className="relative"
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {!isFullscreen ? (
        <Maximize className="h-4 w-4 transition-all" />
      ) : (
        <Minimize className="h-4 w-4 transition-all" />
      )}
      <span className="sr-only">Toggle fullscreen</span>
    </Button>
  );
}
