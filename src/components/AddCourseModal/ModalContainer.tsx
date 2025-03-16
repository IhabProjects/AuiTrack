import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ModalContainerProps {
  children: ReactNode;
}

export default function ModalContainer({ children }: ModalContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[85vh] p-4 modal-elevation"
    >
      <div className="glass-card h-full">
        {/* Animated gradient border */}
        <div className="absolute inset-0 animate-shimmer" />

        {/* Content */}
        <div className="relative h-full custom-scrollbar overflow-y-auto">
          {children}
        </div>

        {/* Bottom shadow overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgb(var(--surface)), transparent)'
          }}
        />
      </div>
    </motion.div>
  );
}
