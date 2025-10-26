// src/components/HeroParticles.tsx
"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { loadFull } from "tsparticles";

// Partículas carregadas apenas no client
const Particles = dynamic(() => import("react-tsparticles"), { ssr: false });

export default function HeroParticles() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fpsLimit: 60,
        particles: {
          number: { value: 50, density: { enable: true, area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.3, random: true },
          size: { value: { min: 1, max: 3 } },
          move: { enable: true, speed: 1.5, direction: "none", random: true, outModes: { default: "out" } },
          links: { enable: true, distance: 120, color: "#ffffff", opacity: 0.2, width: 1 },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: ["repulse"] }, resize: true },
          modes: { repulse: { distance: 100, duration: 0.4 } },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
