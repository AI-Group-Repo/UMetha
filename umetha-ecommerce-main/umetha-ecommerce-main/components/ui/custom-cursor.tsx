"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CustomCursorProps {
  isHovering: boolean;
}

export default function CustomCursor({ isHovering }: CustomCursorProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", mass: 0.2, stiffness: 800, damping: 35 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600/30 to-indigo-600/30 blur-sm" />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ type: "spring", mass: 0.1, stiffness: 1000, damping: 35 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600" />
      </motion.div>
    </>
  );
}
