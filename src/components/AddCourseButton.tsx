import { useState } from 'react';
import AddCourseModal from './AddCourseModal';
import { motion } from 'framer-motion';

export default function AddCourseButton({ semester, type }: { semester: string; type: 'regular' | 'summer' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600"
          animate={{
            opacity: isHovered ? 0.3 : 0.1,
          }}
          style={{ filter: 'blur(10px)' }}
        />

        {/* Button content */}
        <div className="relative px-6 py-3 rounded-xl bg-black/50 backdrop-blur-sm border border-emerald-500/30
                      flex items-center space-x-3 text-lg font-medium text-emerald-400 shadow-xl
                      hover:border-emerald-500/50 transition-colors duration-300">
          <motion.div
            animate={{
              rotate: isHovered ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.div>
          <span className="tracking-wide">Add Course</span>
        </div>
      </motion.button>

      <AddCourseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        semester={semester}
        courses={courses}
        addCourse={addCourse}
      />
    </>
  );
}
