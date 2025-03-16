import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  semester: string;
  courses: any[];
  addCourse: (semester: string, course: any) => void;
}

export default function AddCourseModal({
  isOpen,
  onClose,
  semester,
  courses,
  addCourse,
}: AddCourseModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredCourses = courses.filter((course) =>
    (course.course_code + course.course_name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with hexagon pattern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.8 8.544 15.214 9.96l9.9-9.9h-2.77zM32 0l-3.657 3.657 1.414 1.414L35.143 0H32zm-6.485 0L19.8 5.715l1.414 1.414 5.657-5.657 1.415-1.414L25.515 0h-2.827zm12.97 0l3.657 3.657-1.414 1.414L34.857 0h2.828zM38.657 0l6.485 6.485-1.414 1.414-6.485-6.485L36.828 0h2.829zM28 0l-3.657 3.657 1.414 1.414L30.143 0H28zm-9.657 0l-6.485 6.485 1.414 1.414 6.485-6.485L18.343 0h-2.829zM16 0l-3.657 3.657 1.414 1.414L18.143 0H16zm21.314 0L44.8 6.485 43.384 7.9l-7.9-7.9h2.83zM4 0L.343 3.657 1.757 5.07 5.414 1.414 4 0zm54.627 0l.83.828-1.415 1.415L55.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828z' fill='rgba(16, 185, 129, 0.05)' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[85vh] z-50 p-4"
          >
            {/* Modal container with neon border */}
            <div className="relative rounded-2xl overflow-hidden bg-black/80 backdrop-blur-xl border border-emerald-500/30">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 opacity-20"
                   style={{ filter: 'blur(20px)' }} />

              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
                  >
                    Add Course to {semester}
                  </motion.h2>
                </div>

                {/* Search */}
                <div className="p-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 pl-12 bg-black/50 border-2 border-emerald-500/20 rounded-xl
                               text-white placeholder-emerald-500/50 focus:border-emerald-500/50 focus:outline-none
                               transition-all duration-300"
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50"
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
                  </div>
                </div>

                {/* Course grid */}
                <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course.course_code}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setSelectedCourse(course.course_code);
                          setTimeout(() => {
                            addCourse(semester, course);
                            onClose();
                          }, 300);
                        }}
                        className={`relative p-6 rounded-xl cursor-pointer group transition-all duration-300
                                  ${selectedCourse === course.course_code
                                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                                    : 'bg-white/5 border-2 border-white/10 hover:border-emerald-500/50'
                                  }`}
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0
                                      group-hover:opacity-20 rounded-xl transition-opacity duration-300"
                             style={{ filter: 'blur(10px)' }} />

                        {/* Content */}
                        <div className="relative">
                          <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                            {course.course_code}
                            <motion.span
                              initial={{ opacity: 0, scale: 0 }}
                              animate={selectedCourse === course.course_code ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                              className="ml-3 text-emerald-400"
                            >
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.span>
                          </h3>
                          <p className="text-white/60 mb-4">{course.course_name}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400">
                              {course.credits} Credits
                            </span>
                            {course.prerequisites?.length > 0 && (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                                Prerequisites
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
