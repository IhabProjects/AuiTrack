import { motion } from 'framer-motion';
import { SemesterGroup } from './SemesterGroup';

export function YearGroup({ year, semesters, index }: { year: number; semesters: any[]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="relative"
    >
      {/* Year header with glowing effect */}
      <div className="flex items-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold border border-white/20 shadow-lg">
            {year}
          </div>
        </div>
        <div className="ml-6">
          <h2 className="text-2xl font-bold text-white">Academic Year</h2>
          <p className="text-emerald-400/80 text-sm mt-1">Plan your courses for {year}</p>
        </div>
      </div>

      {/* Semesters grid with modern gaming aesthetic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {semesters.map((plan, i) => (
          <motion.div
            key={plan.semester}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + index * 0.2 }}
          >
            <SemesterGroup
              semester={plan.semester}
              type={plan.type}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
