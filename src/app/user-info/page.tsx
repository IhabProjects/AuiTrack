'use client';

/**
 * User Information Page Component
 *
 * This page collects essential user information needed to create a personalized degree plan.
 * It features:
 * - A form to gather personal details (name, ID, major)
 * - Academic information inputs (start year, expected graduation)
 * - Validation to ensure all required fields are completed
 * - Navigation to proceed to the degree planning page
 *
 * The collected information is stored in the application state and used to customize
 * the degree planning experience, including generating appropriate semesters and
 * calculating graduation requirements based on the user's major.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDegreePlanStore } from '@/lib/store';

/**
 * UserInfoPage component
 *
 * This page collects user information before creating a degree plan.
 * It has a two-step form:
 * 1. Personal information (name and student ID)
 * 2. Academic information (major, start/end dates)
 */
export default function UserInfoPage() {
  // Get the router for navigation
  const router = useRouter();

  // Get the setUserInfo action from the global store
  const { setUserInfo } = useDegreePlanStore();

  // State for personal information
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');

  // State for academic information
  const [major, setMajor] = useState('CS');
  const [startSemester, setStartSemester] = useState('Fall');
  const [startYear, setStartYear] = useState(2024);
  const [endSemester, setEndSemester] = useState('Spring');
  const [endYear, setEndYear] = useState(2028);

  // State for form navigation and validation
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // For testing - initialize with default values
  useEffect(() => {
    // Uncomment this for testing
    setName('Test Student');
    setStudentId('S12345');
  }, []);

  // Update end year if start year is changed to be greater than end year
  useEffect(() => {
    if (endYear < startYear) {
      setEndYear(startYear);
    }
  }, [startYear, endYear]);

  /**
   * Handle the next step button click
   * - For step 1: Validate personal info and move to step 2
   * - For step 2: Save all info to store and navigate to degree plan
   */
  const handleNextStep = () => {
    if (step === 1) {
      // Validate personal information
      if (!name.trim() || !studentId.trim()) {
        setError('Please fill in all fields');
        return;
      }
      // Clear any errors and proceed to step 2
      setError('');
      setStep(2);
    } else if (step === 2) {
      // Validate academic information
      if (endYear < startYear) {
        setError('Graduation year cannot be earlier than start year');
        return;
      }

      // Calculate total credits based on major
      const totalCreditsToGraduate =
        major === 'CS' ? 136 :
        major === 'BA' ? 128 :
        major === 'IS' ? 111 : 136;

      // Save user info to store
      setUserInfo({
        name,
        studentId,
        major,
        startSemester,
        startYear,
        endSemester,
        endYear,
        totalCreditsToGraduate
      });

      // Navigate to degree planner
      router.push('/degree-plan');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-radial from-[#1e293b] to-[#0f172a] opacity-40 z-0" />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8">
              {/* Form header - changes based on current step */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  {step === 1 ? 'Personal Information' : 'Academic Information'}
                </h1>
                <p className="text-gray-400 mt-2">
                  {step === 1
                    ? 'Let\'s get to know you better'
                    : 'Tell us about your academic journey'}
                </p>
              </div>

              {/* Error message display */}
              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Personal Information Form */}
              {step === 1 ? (
                <div className="space-y-6">
                  {/* Name input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Student ID input */}
                  <div>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                      placeholder="Enter your student ID"
                    />
                  </div>
                </div>
              ) : (
                /* Step 2: Academic Information Form */
                <div className="space-y-6">
                  {/* Major selection */}
                  <div>
                    <label htmlFor="major" className="block text-sm font-medium text-gray-300 mb-2">
                      Major
                    </label>
                    <select
                      id="major"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                    >
                      <option value="CS">Computer Science (136 credits)</option>
                      <option value="BA">Business Administration (128 credits)</option>
                      <option value="IS">International Studies (111 credits)</option>
                    </select>
                  </div>

                  {/* Start semester and year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Start Semester
                      </label>
                      <select
                        value={startSemester}
                        onChange={(e) => setStartSemester(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20"
                      >
                        <option value="Fall" className="bg-[#1e293b] text-white">Fall</option>
                        <option value="Spring" className="bg-[#1e293b] text-white">Spring</option>
                        <option value="Summer" className="bg-[#1e293b] text-white">Summer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Start Year
                      </label>
                      <select
                        value={startYear}
                        onChange={(e) => setStartYear(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20"
                      >
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <option key={year} value={year} className="bg-[#1e293b] text-white">
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* End semester and year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Expected Graduation Semester
                      </label>
                      <select
                        value={endSemester}
                        onChange={(e) => setEndSemester(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20"
                      >
                        <option value="Fall" className="bg-[#1e293b] text-white">Fall</option>
                        <option value="Spring" className="bg-[#1e293b] text-white">Spring</option>
                        <option value="Summer" className="bg-[#1e293b] text-white">Summer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Graduation Year
                      </label>
                      <select
                        value={endYear}
                        onChange={(e) => setEndYear(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20"
                      >
                        {Array.from({ length: 10 }, (_, i) => Math.max(startYear, new Date().getFullYear()) + i).map((year) => (
                          <option key={year} value={year} className="bg-[#1e293b] text-white">
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                {/* Back button (only on step 2) */}
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    Back
                  </motion.button>
                )}

                {/* Next/Submit button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity ml-auto"
                >
                  {step === 1 ? 'Next' : 'Start Planning'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
