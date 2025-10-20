"use client";
import { motion } from "framer-motion";

export function HoverCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg p-6">
        {children}
      </div>
    </motion.div>
  );
}
