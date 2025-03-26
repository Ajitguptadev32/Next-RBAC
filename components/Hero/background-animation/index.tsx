"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "../Hooks/use-media-query";

// Tech icons to display
const techIcons = [
  { icon: "logos:react", size: 40 },
  { icon: "logos:typescript-icon", size: 35 },
  { icon: "logos:nextjs-icon", size: 40 },
  { icon: "logos:tailwindcss-icon", size: 40 },
  { icon: "logos:javascript", size: 35 },
  { icon: "logos:nodejs-icon", size: 40 },
  { icon: "logos:html-5", size: 35 },
  { icon: "logos:css-3", size: 35 },
  { icon: "logos:git-icon", size: 35 },
  { icon: "logos:github-icon", size: 35 },
  { icon: "logos:mongodb-icon", size: 40 },
  { icon: "logos:postgresql", size: 35 },
  { icon: "logos:prisma", size: 40 },
  { icon: "logos:vercel-icon", size: 35 },
  { icon: "logos:firebase", size: 35 },
  { icon: "logos:graphql", size: 35 },
  { icon: "logos:redux", size: 35 },
  { icon: "logos:framer", size: 35 }
];

interface FloatingIcon {
  id: number;
  icon: string;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export default function BackgroundAnimation() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // Generate random positions for icons
    const iconCount = isMobile ? 10 : 18;
    const newIcons = Array.from({ length: iconCount }, (_, i) => {
      const randomIcon =
        techIcons[Math.floor(Math.random() * techIcons.length)];
      return {
        id: i,
        icon: randomIcon.icon,
        size: randomIcon.size,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 20 + Math.random() * 30,
        delay: Math.random() * -20
      };
    });

    setIcons(newIcons);
  }, [isMobile]);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-20">
        <GridLines />
      </div>

      {/* Floating tech icons */}
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute"
          initial={{
            x: `${icon.x}vw`,
            y: `${icon.y}vh`,
            opacity: 0
          }}
          animate={{
            x: [
              `${icon.x}vw`,
              `${(icon.x + 10) % 100}vw`,
              `${(icon.x - 5) % 100}vw`,
              `${icon.x}vw`
            ],
            y: [
              `${icon.y}vh`,
              `${(icon.y - 15) % 100}vh`,
              `${(icon.y + 10) % 100}vh`,
              `${icon.y}vh`
            ],
            opacity: [0, 0.7, 0.5, 0]
          }}
          transition={{
            duration: icon.duration,
            times: [0, 0.3, 0.7, 1],
            repeat: Number.POSITIVE_INFINITY,
            delay: icon.delay,
            ease: "easeInOut"
          }}
        >
          <Icon icon={icon.icon} width={icon.size} height={icon.size} />
        </motion.div>
      ))}

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}

function GridLines() {
  return (
    <div className="relative w-full h-full">
      {/* Horizontal grid lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-white/30"
          style={{ top: `${(i + 1) * 5}%` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 1, 1, 0],
            opacity: [0, 0.5, 0.5, 0],
            x: ["-100%", "0%", "0%", "100%"]
          }}
          transition={{
            duration: 15,
            times: [0, 0.4, 0.6, 1],
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Vertical grid lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-white/30"
          style={{ left: `${(i + 1) * 5}%` }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{
            scaleY: [0, 1, 1, 0],
            opacity: [0, 0.5, 0.5, 0],
            y: ["-100%", "0%", "0%", "100%"]
          }}
          transition={{
            duration: 15,
            times: [0, 0.4, 0.6, 1],
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Pulsing circles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        return (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full bg-white/10"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2, 3, 0],
              opacity: [0, 0.3, 0.1, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
}
