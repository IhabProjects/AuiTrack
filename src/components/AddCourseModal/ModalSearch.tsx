import { motion } from 'framer-motion';
import { ChangeEvent } from 'react';

interface ModalSearchProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ModalSearch({ value, onChange }: ModalSearchProps) {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Search container */}
        <div className="relative group">
          {/* Background effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 group-hover:from-primary/10 group-hover:via-secondary/10 group-hover:to-primary/10 transition-all duration-300" />

          {/* Input field */}
          <input
            type="text"
            placeholder="Search courses..."
            value={value}
            onChange={onChange}
            className="w-full px-6 py-4 pl-12 bg-elevated/30 border border-white/10 rounded-xl
                     text-white placeholder-white/40 focus:border-primary/50 focus:outline-none
                     transition-all duration-300 relative z-10"
          />

          {/* Search icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg
                className="w-5 h-5 text-primary/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </motion.div>
          </div>

          {/* Corner accents */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((position) => (
            <div
              key={position}
              className={`absolute w-2 h-2 border border-primary/20 group-hover:border-primary/40 transition-colors duration-300
                ${position.includes('top') ? 'top-0' : 'bottom-0'}
                ${position.includes('left') ? 'left-0' : 'right-0'}
                ${position.includes('top-left') ? 'rounded-tl-lg' : ''}
                ${position.includes('top-right') ? 'rounded-tr-lg' : ''}
                ${position.includes('bottom-left') ? 'rounded-bl-lg' : ''}
                ${position.includes('bottom-right') ? 'rounded-br-lg' : ''}
              `}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
