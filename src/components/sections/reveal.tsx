"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const directionOffset = {
    up: { x: 0, y: 40 },
    left: { x: -40, y: 0 },
    right: { x: 40, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: directionOffset[direction].x,
        y: directionOffset[direction].y,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : {
              opacity: 0,
              x: directionOffset[direction].x,
              y: directionOffset[direction].y,
            }
      }
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
