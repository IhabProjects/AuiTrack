'use client';

/**
 * Features Page Component
 *
 * This page provides detailed information about the application's features and technology stack.
 * It includes:
 * - Core features section highlighting the main capabilities
 * - Secondary features section covering additional functionality
 * - Technology stack section detailing the frontend and backend technologies used
 * - Future features section showcasing planned enhancements
 * - How it works section explaining the user workflow
 * - Feature details section with in-depth explanations of key features
 *
 * The page helps users understand the full capabilities of the application and
 * the technology behind it, while also providing a glimpse of future development plans.
 */

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1e293b] to-transparent opacity-40" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Header/Navbar */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link href="/" className="flex items-center space-x-4">
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
              </Link>
            </motion.div>

            {/* Back to Home button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-12 text-center">
            Features & Technology
          </h1>

          {/* Core Features Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Interactive Degree Planning",
                  description: "Create a personalized semester-by-semester plan with an intuitive drag-and-drop interface. Organize courses across multiple academic years with visual feedback.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )
                },
                {
                  title: "Prerequisite Validation",
                  description: "Intelligent system that automatically checks and validates course prerequisites. Prevents adding courses when prerequisites haven't been completed.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Credit Management",
                  description: "Automatic tracking of credits per semester with visual indicators. Enforces credit limits (22 for regular semesters, 10 for summer) to ensure balanced course loads.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  title: "Progress Tracking",
                  description: "Visual representation of progress toward degree completion. Track total credits completed and remaining with an interactive progress bar.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative group rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-2.5 mb-6">
                    <div className="w-full h-full rounded-lg bg-[#0f172a] flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Secondary Features Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Secondary Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Course Search & Filtering",
                  description: "Powerful search functionality to quickly find courses by code or name. Filter options to show only courses with satisfied prerequisites."
                },
                {
                  title: "Exportable Plans",
                  description: "Generate and download your degree plan as a formatted document for sharing with advisors or personal reference."
                },
                {
                  title: "Detailed Course Information",
                  description: "Access comprehensive details for each course, including prerequisites, corequisites, and available sections."
                },
                {
                  title: "Responsive Design",
                  description: "Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices."
                },
                {
                  title: "Animated UI",
                  description: "Smooth, physics-based animations that provide visual feedback and enhance the user experience."
                },
                {
                  title: "Persistent Storage",
                  description: "Automatic saving of your degree plan to local storage, ensuring your progress is never lost."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Technology Stack Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="rounded-2xl bg-white/5 border border-white/10 p-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Frontend</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">Next.js 14 with App Router</span>
                      <p className="text-gray-400 text-sm mt-1">Provides server-side rendering, static site generation, and client-side routing for optimal performance and SEO. The App Router enables more intuitive and efficient routing.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">React 18 with Hooks</span>
                      <p className="text-gray-400 text-sm mt-1">Powers the UI with component-based architecture. React Hooks (useState, useEffect, useCallback, useMemo) enable functional components with state management and side effects.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">TypeScript</span>
                      <p className="text-gray-400 text-sm mt-1">Adds static typing to JavaScript, catching errors during development. Provides better code documentation, autocompletion, and refactoring tools for complex data structures like course prerequisites.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">Tailwind CSS</span>
                      <p className="text-gray-400 text-sm mt-1">Utility-first CSS framework that enables rapid UI development with responsive design. Custom design system with consistent spacing, colors, and components without writing custom CSS.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">Framer Motion</span>
                      <p className="text-gray-400 text-sm mt-1">Production-ready animation library for React that powers all transitions and micro-interactions. Provides physics-based animations, gestures, and layout animations for a polished user experience.</p>
                    </div>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                className="rounded-2xl bg-white/5 border border-white/10 p-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">State Management & Data</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">Zustand</span>
                      <p className="text-gray-400 text-sm mt-1">Lightweight state management library that simplifies global state. Manages course data, semester plans, and user information with minimal boilerplate compared to Redux.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">JSON-based course catalog</span>
                      <p className="text-gray-400 text-sm mt-1">Structured data format for storing and retrieving course information. Contains comprehensive details about each course including prerequisites, corequisites, and available sections.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">Local storage persistence</span>
                      <p className="text-gray-400 text-sm mt-1">Browser-based storage that saves degree plans between sessions. Automatically saves changes to prevent data loss and allows users to continue planning across multiple sessions.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">Custom document generation</span>
                      <p className="text-gray-400 text-sm mt-1">Converts degree plans into formatted text documents for download. Creates a structured, readable format that can be shared with academic advisors or printed for reference.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-gray-300 font-medium">Custom hooks & utilities</span>
                      <p className="text-gray-400 text-sm mt-1">Reusable logic for common operations like prerequisite validation, credit calculation, and semester management. Ensures consistent behavior across components and reduces code duplication.</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </section>

          {/* Future Features Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Future Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "AI Course Recommendations",
                  description: "Smart recommendations for courses based on your major, interests, and previous course selections to optimize your degree path."
                },
                {
                  title: "Collaborative Planning",
                  description: "Share and collaborate on degree plans with advisors or fellow students in real-time with commenting and suggestion features."
                },
                {
                  title: "Graduation Path Optimization",
                  description: "AI-powered analysis to suggest the most efficient path to graduation based on course availability and prerequisites."
                },
                {
                  title: "Mobile Application",
                  description: "Native mobile apps for iOS and Android to plan your degree on the go with offline capabilities."
                },
                {
                  title: "Integration with University Systems",
                  description: "Direct integration with AUI's registration system to automatically import your current courses and register for planned courses."
                },
                {
                  title: "Career Path Visualization",
                  description: "Connect your degree plan to potential career paths and job opportunities based on your course selections and specializations."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="my-20">
            <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Enter Your Information",
                  description: "Start by providing your personal details, major, and expected timeline. This information helps customize your degree plan to your specific academic journey.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  step: "2",
                  title: "Build Your Plan",
                  description: "Add courses to each semester using the intuitive interface. The system automatically validates prerequisites and tracks your credit load to ensure a balanced schedule.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )
                },
                {
                  step: "3",
                  title: "Track & Export",
                  description: "Monitor your progress toward graduation with the visual progress tracker. When you're ready, export your plan as a formatted document to share with advisors.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  )
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-2.5 mb-6 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Feature Details Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Feature Details</h2>

            {/* Prerequisite Validation */}
            <div className="mb-12 rounded-2xl bg-white/5 border border-white/10 p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Prerequisite Validation System</h3>
              <p className="text-gray-400 mb-6">
                Our advanced prerequisite validation system ensures you can only add courses when you've completed the necessary prerequisites, preventing registration errors and keeping your degree plan on track.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                  <h4 className="text-lg font-medium text-white mb-3">Complex Logic Support</h4>
                  <p className="text-gray-400 text-sm">
                    Handles both simple and complex prerequisite relationships, including:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-400">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Single course prerequisites (e.g., "CS 101")</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Multiple required courses (e.g., "CS 101 AND MATH 201")</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Alternative options (e.g., "CS 101 OR CS 102")</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Combinations of AND/OR logic for complex requirements</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                  <h4 className="text-lg font-medium text-white mb-3">Visual Indicators</h4>
                  <p className="text-gray-400 text-sm">
                    Clear visual feedback helps you understand prerequisite status:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-400">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Green badges for satisfied prerequisites</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Red badges for unmet prerequisites</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Detailed prerequisite information in course details</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Filter option to show only courses with satisfied prerequisites</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Credit Management */}
            <div className="mb-12 rounded-2xl bg-white/5 border border-white/10 p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Credit Management System</h3>
              <p className="text-gray-400 mb-6">
                Our intelligent credit management system helps you maintain balanced course loads across semesters while tracking your progress toward graduation requirements.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                  <h4 className="text-lg font-medium text-white mb-3">Semester Credit Tracking</h4>
                  <p className="text-gray-400 text-sm">
                    Monitors credit loads for each semester with:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-400">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Visual progress bars showing credit usage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Color-coded indicators (green, yellow, red) based on load</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Different credit limits for regular (22) and summer (10) semesters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Automatic updates when adding or removing courses</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                  <h4 className="text-lg font-medium text-white mb-3">Graduation Progress</h4>
                  <p className="text-gray-400 text-sm">
                    Tracks overall progress toward degree completion:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-400">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Total credits completed across all semesters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Credits remaining to reach graduation requirements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Percentage completion with visual progress bar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Major-specific credit requirements (e.g., 136 for CS)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/user-info" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white overflow-hidden transition-all duration-300 hover:scale-105">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                <span className="relative flex items-center">
                  Start Planning Now
                  <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link href="/degree-plan?import=true" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-white/10 border border-white/20 text-white overflow-hidden transition-all duration-300 hover:bg-white/20">
                <span className="relative flex items-center">
                  <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Import Plan
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
