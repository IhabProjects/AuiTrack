import { motion } from 'framer-motion';

interface CourseCardProps {
  course: any;
  isSelected: boolean;
  onSelect: () => void;
}

export default function CourseCard({ course, isSelected, onSelect }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`
        glass-card p-6 cursor-pointer group transition-all duration-300
        ${isSelected ? 'border-primary ring-1 ring-primary/30' : 'hover:border-primary/30'}
      `}
    >
      {/* Selection indicator */}
      <motion.div
        initial={false}
        animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      {/* Course content */}
      <div className="relative">
        {/* Course code */}
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-xl font-bold text-gradient">
            {course.course_code}
          </h3>
          <div
            className={`w-2 h-2 rounded-full animate-pulse-slow
              ${isSelected ? 'bg-primary' : 'bg-primary/50'}
            `}
          />
        </div>

        {/* Course name */}
        <p className="text-white/70 mb-4 line-clamp-2">{course.course_name}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {/* Credits tag */}
          <div className="relative group/tag">
            <div className={`
              absolute inset-0 rounded-full blur-sm transition-colors duration-300
              ${isSelected ? 'bg-primary/30' : 'bg-primary/20 group-hover/tag:bg-primary/30'}
            `} />
            <span className="relative px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary/90">
              {course.credits} Credits
            </span>
          </div>

          {/* Prerequisites tag */}
          {course.prerequisites?.length > 0 && (
            <div className="relative group/tag">
              <div className={`
                absolute inset-0 rounded-full blur-sm transition-colors duration-300
                ${isSelected ? 'bg-secondary/30' : 'bg-secondary/20 group-hover/tag:bg-secondary/30'}
              `} />
              <span className="relative px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary/90">
                Prerequisites
              </span>
            </div>
          )}
        </div>

        {/* Interactive hover effects */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
      </div>
    </motion.div>
  );
}
