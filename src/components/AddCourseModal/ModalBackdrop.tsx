import { motion } from 'framer-motion';

interface ModalBackdropProps {
  onClose: () => void;
}

export default function ModalBackdrop({ onClose }: ModalBackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 backdrop-blur-xl"
      style={{
        background: `
          linear-gradient(to bottom right,
            rgba(var(--surface), 0.9),
            rgba(var(--surface), 0.95)
          )
        `,
      }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(var(--primary), 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(var(--primary), 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Radial gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, rgba(var(--primary), 0.05), transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(var(--secondary), 0.05), transparent 50%)
          `
        }}
      />
    </motion.div>
  );
}
