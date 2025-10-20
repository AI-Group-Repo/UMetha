import { motion } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";

interface FloatingActionProps {
  onClick: () => void;
}

export default function FloatingAction({ onClick }: FloatingActionProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg z-40"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <ArrowUpCircle className="h-6 w-6" />
    </motion.button>
  );
}
