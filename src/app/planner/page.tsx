'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDegreePlanStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function PlannerPage() {
  const router = useRouter();
  const { setCourseData, resetPlan } = useDegreePlanStore();

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const data = (await import('../../../jz_scraper_final.json')).default;
        if (Array.isArray(data)) {
          setCourseData(data);
          resetPlan();
          router.push('/degree-plan');
        } else {
          throw new Error('Invalid course data format');
        }
      } catch (err) {
        console.error('Error loading course data:', err);
      }
    };
    loadCourseData();
  }, [setCourseData, resetPlan, router]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1e293b] to-transparent opacity-40" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                AUI Planner
              </span>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
        <div className="w-full max-w-4xl">
          {/* Loading card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10"
          >
            {/* Top section */}
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                >
                  Loading Your Planner
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Loading steps */}
            <div className="p-8 space-y-6">
              {[
                { text: "Fetching course data...", delay: 0 },
                { text: "Processing prerequisites...", delay: 0.2 },
                { text: "Preparing your planner...", delay: 0.4 }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-lg bg-[#0f172a] flex items-center justify-center">
                      <motion.svg
                        className="w-4 h-4 text-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2V4c4.418 0 8 3.582 8 8s-3.582 8-8 8z"
                        />
                      </motion.svg>
                    </div>
                  </div>
                  <span className="text-gray-300">{step.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-gray-400 mt-6"
          >
            This may take a few moments. We're preparing your personalized degree planner.
          </motion.p>
        </div>
      </main>
    </div>
  );
}
