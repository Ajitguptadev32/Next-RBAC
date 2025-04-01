'use client';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Sofa, LampDesk, Armchair, Sprout, Table, GalleryVertical } from 'lucide-react';
import { KitchenDesignHero } from '../MainHeader';

const ICONS = [
  { icon: Sofa, size: 40, blur: 4, speed: 20 },
  { icon: LampDesk, size: 32, blur: 6, speed: 25 },
  { icon: Armchair, size: 36, blur: 5, speed: 30 },
  { icon: Sprout, size: 28, blur: 8, speed: 15 },
  { icon: Table, size: 44, blur: 3, speed: 18 },
  { icon: GalleryVertical, size: 30, blur: 7, speed: 22 },
];

const GRID_CELLS = 16;
const GRID_BOX_SIZE = 100;

export const HeroBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Grid animation
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.3,
      transition: {
        staggerChildren: 0.02,
        staggerDirection: 1,
      },
    },
  };

  const cellVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 0.3, scale: 1 },
  };

  // Floating icons
  const FloatingIcon = ({ icon: Icon, size, blur, speed }: typeof ICONS[number]) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useMotionValue(0);

    const xRange = useTransform(x, [-1, 1], [-50, 50]);
    const yRange = useTransform(y, [-1, 1], [-30, 30]);
    const rotateRange = useTransform(rotate, [-1, 1], [-15, 15]);

    useEffect(() => {
      if (!isVisible) return;
      
      const animate = () => {
        x.set(Math.sin(Date.now() / (speed * 100)));
        y.set(Math.cos(Date.now() / (speed * 100)));
        rotate.set(Math.sin(Date.now() / (speed * 100 + 10)));
        requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        // Cleanup if needed
      };
    }, [x, y, rotate, speed, isVisible]);

    return (
      <motion.div
        className="absolute text-gray-300"
        style={{
          x: xRange,
          y: yRange,
          rotate: rotateRange,
          filter: `blur(${blur}px)`,
        }}
      >
        <Icon size={size} />
      </motion.div>
    );
  };

  useEffect(() => {
    setIsVisible(true); // Always visible in this version
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Grid Background */}
        <motion.div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_CELLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_CELLS}, 1fr)`,
          }}
          variants={gridVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {Array.from({ length: GRID_CELLS * GRID_CELLS }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-gray-200"
              variants={cellVariants}
              whileHover={{ opacity: 0.5 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute inset-0">
          {ICONS.map((icon, index) => {
            // Random initial positions
            const left = 10 + Math.random() * 80;
            const top = 10 + Math.random() * 80;
            
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
              >
                <FloatingIcon {...icon} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};