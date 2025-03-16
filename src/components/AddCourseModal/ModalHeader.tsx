import { motion } from 'framer-motion';

interface ModalHeaderProps {
  semester: string;
}

export default function ModalHeader({ semester }: ModalHeaderProps) {
  return (
    <div className="relative p-6 border-b border-white/5">
      {/* Glowing line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-primary/20 animate-pulse-slow" />
            <div className="relative p-2 rounded-lg bg-primary/10">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gradient">
              Add Course
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Select a course to add to {semester}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full bg-primary/30
                animate-pulse-slow
              `}
              style={{
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
