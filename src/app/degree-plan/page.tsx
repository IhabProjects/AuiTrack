'use client';

/**
 * Degree Plan Page Component
 *
 * This is the main application page where users create and manage their degree plans.
 * It features:
 * - A semester-based planning interface organized by academic years
 * - Course selection with prerequisite validation
 * - Credit tracking for each semester and overall progress
 * - Import and export functionality for degree plans
 * - Interactive UI with animations and visual feedback
 *
 * The page handles complex logic for prerequisite checking, credit management,
 * and semester organization, ensuring users can create valid and balanced degree plans.
 * It redirects to the user-info page if user information is not set, unless importing a plan.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useDegreePlanStore } from '@/lib/store';
import { Course as ImportedCourse } from '@/lib/pdfParser';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Define a local Prerequisite type
type Prerequisite = {
  type: string;
  value: string;
};

// Define a local Course type that matches the store's Course type
type Course = {
  course_code: string;
  course_name: string;
  credits: string;
  prerequisites: Prerequisite[][];
  corequisites: string[];
  sections: { instructor: string; schedule: string; }[];
};

// TotalCredits component that displays the progress toward graduation
function TotalCredits() {
  // Get semester plans and user info from the global store
  const { semesterPlans, userInfo } = useDegreePlanStore();

  // Use default userInfo if not set (for testing or direct access)
  const defaultUserInfo = userInfo || {
    name: "Test User",
    studentId: "S12345",
    major: "CS",
    totalCreditsToGraduate: 136
  };

  // Calculate the total credits across all semesters
  const totalCredits = useMemo(() =>
    semesterPlans.reduce((total, semester) => total + semester.credits, 0),
    [semesterPlans]
  );

  // Get the total credits required for graduation based on the user's major
  const totalCreditsToGraduate = defaultUserInfo.totalCreditsToGraduate || 136;

  // Calculate the percentage of credits completed (capped at 100%)
  const progressPercentage = Math.min(Math.round((totalCredits / totalCreditsToGraduate) * 100) || 0, 100);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2 mb-1">
        {/* Credits icon */}
        <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-gray-400">Credits Progress</span>
            </div>

      {/* Credits counter */}
      <div className="flex items-center mb-1 justify-center">
        <span className="text-base font-bold text-white">{totalCredits}</span>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-gray-400">{totalCreditsToGraduate}</span>
            </div>

      {/* Progress bar */}
      <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{ width: `${progressPercentage}%` }}
        />
          </div>

      {/* Percentage display */}
      <div className="mt-1 text-right text-xs text-gray-400">
        {progressPercentage}%
      </div>
    </div>
  );
}

// Header component that displays at the top of the degree plan page
function Header({ isImportModalOpen, setIsImportModalOpen, isImporting, setIsImporting }: {
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isImporting: boolean;
  setIsImporting: (importing: boolean) => void;
}) {
  // Get user information and semester plans from the global store
  const { userInfo, semesterPlans, setUserInfo, resetPlan, addCourse } = useDegreePlanStore();

  // Use default userInfo if not set (for testing or direct access)
  const defaultUserInfo = userInfo || {
    name: "Test User",
    studentId: "S12345",
    major: "CS",
    totalCreditsToGraduate: 136
  };

  // Convert the major code to a full name for display
  const majorFullName = useMemo(() => {
    switch (defaultUserInfo.major) {
      case 'CS': return 'Computer Science';
      case 'BA': return 'Business Administration';
      case 'IS': return 'International Studies';
      default: return 'Computer Science';
    }
  }, [defaultUserInfo.major]);

  // State for file import modal
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    setImportSuccess('');

    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a text file
    if (file.type !== 'text/plain') {
      setImportError('Please upload a text (.txt) file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;

        // Parse the file content
        const parsedData = parseDegreePlanFile(content);

        if (!parsedData) {
          setImportError('Invalid file format. Please upload a file exported from this application.');
          return;
        }

        console.log('Parsed data:', parsedData);

        // Store user info in localStorage to persist through reload
        localStorage.setItem('importedUserInfo', JSON.stringify(parsedData.userInfo));
        localStorage.setItem('importedSemesters', JSON.stringify(parsedData.semesters));

        // Update user info and courses
        setUserInfo(parsedData.userInfo);

        // Reset the plan first to clear existing courses
        resetPlan();

        // Add courses to each semester
        parsedData.semesters.forEach(sem => {
          sem.courses.forEach(course => {
            addCourse(sem.name, course);
          });
        });

        setImportSuccess('Degree plan imported successfully!');
        setIsImporting(false);

        // Close the modal after a delay
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportSuccess('');
        }, 3000);
      } catch (error) {
        console.error('Error parsing file:', error);
        setImportError('Failed to parse the file. Please ensure it has the correct format.');
      }
    };

    reader.readAsText(file);
  };

  // Function to parse the degree plan file
  const parseDegreePlanFile = (content: string): {
    userInfo: any,
    semesters: Array<{ name: string, courses: Course[] }>
  } | null => {
    try {
      // Extract student information
      const nameMatch = content.match(/Name:\s*(.+)/);
      const idMatch = content.match(/ID:\s*(.+)/);
      const majorMatch = content.match(/Major:\s*(.+)/);

      if (!nameMatch || !idMatch || !majorMatch) {
        console.error('Missing required student information');
        return null;
      }

      const name = nameMatch[1].trim();
      const studentId = idMatch[1].trim();
      const majorFullName = majorMatch[1].trim();

      // Convert major full name to code
      let major = 'CS';
      if (majorFullName.includes('Business')) major = 'BA';
      else if (majorFullName.includes('International')) major = 'IS';

      // Extract total credits
      const totalCreditsMatch = content.match(/Credits Required for Graduation:\s*(\d+)/);
      const totalCreditsToGraduate = totalCreditsMatch ? parseInt(totalCreditsMatch[1]) : 136;

      // Extract academic years and semesters
      const academicYearSections = content.split(/=+\s*ACADEMIC YEAR:/);

      // Skip the first section (it's the header)
      const semesters: Array<{ name: string, courses: Course[] }> = [];
      const processedSemesters = new Set<string>(); // Track processed semesters to avoid duplicates

      // Debug output
      console.log('Found academic year sections:', academicYearSections.length - 1);

      for (let i = 1; i < academicYearSections.length; i++) {
        const yearSection = academicYearSections[i];
        console.log(`Processing academic year section ${i}:`, yearSection.substring(0, 100) + '...');

        // Extract semester sections using regex
        const semesterMatches = [...yearSection.matchAll(/\n-{3,}\s*([A-Za-z]+\s+\d{4})\s*\n-{3,}/g)];

        if (semesterMatches.length === 0) {
          console.log(`No semester matches found in year section ${i}`);
          continue;
        }

        console.log(`Found ${semesterMatches.length} semesters in year ${i}`);

        // Process each semester
        for (let j = 0; j < semesterMatches.length; j++) {
          const semesterName = semesterMatches[j][1].trim();

          // Skip if this semester has already been processed
          if (processedSemesters.has(semesterName)) {
            console.log(`Skipping duplicate semester: ${semesterName}`);
            continue;
          }

          console.log(`Processing semester: ${semesterName}`);
          processedSemesters.add(semesterName);

          // Get the content for this semester
          const startIndex = semesterMatches[j].index! + semesterMatches[j][0].length;
          const endIndex = j < semesterMatches.length - 1 ? semesterMatches[j+1].index : undefined;
          const semesterContent = yearSection.substring(startIndex, endIndex);

          // Process this semester's content
          const courses = extractCoursesFromSemesterContent(semesterContent);

          // Add the semester even if it has no courses
          semesters.push({
            name: semesterName,
            courses
          });
          console.log(`Added semester ${semesterName} with ${courses.length} courses`);
        }
      }

      // Helper function to extract courses from semester content
      function extractCoursesFromSemesterContent(content: string): Course[] {
        const courses: Course[] = [];
        const lines = content.split('\n');

        // Clean up the content by removing any lines with just "=" characters
        const cleanedLines = lines.filter(line => !line.trim().match(/^=+$/));

        // Find the header line (contains "Course ID" or similar)
        const headerLineIndex = cleanedLines.findIndex(line =>
          line.includes('Course ID') || line.includes('Course Title') || line.includes('SCH'));

        if (headerLineIndex === -1) {
          console.log('No header line found in semester content');
          return [];
        }

        // Skip the header and separator lines
        for (let i = headerLineIndex + 2; i < cleanedLines.length; i++) {
          const line = cleanedLines[i].trim();

          // Skip empty lines, separator lines, and total lines
          if (!line || line.startsWith('-') || line.includes('Total SCH:')) continue;

          // Skip placeholder lines for empty semesters
          if (line.startsWith('NONE') || line.includes('No courses added')) continue;

          // Parse course information
          let courseCode, courseName, credits;

          if (line.includes('\t')) {
            // Tab-separated format
            const parts = line.split('\t').filter(part => part.trim());
            courseCode = parts[0]?.trim();
            courseName = parts[1]?.trim();
            credits = parts[2]?.trim() || parts[parts.length - 1]?.trim();
          } else {
            // Space-separated format with fixed widths
            courseCode = line.substring(0, 15).trim();
            courseName = line.substring(15, 55).trim();
            credits = line.substring(55).trim();
          }

          if (courseCode && courseName && credits) {
            // Ensure credits is a valid number
            const parsedCredits = parseInt(credits);
            if (!isNaN(parsedCredits)) {
              courses.push({
                course_code: courseCode,
                course_name: courseName,
                credits: parsedCredits.toString(),
                prerequisites: [],
                corequisites: [],
                sections: []
              });
            }
          }
        }

        return courses;
      }

      // Extract start and end dates from semester names
      const allSemesterNames = semesters.map(s => s.name);
      const firstSemester = allSemesterNames[0] || 'Fall 2024';
      const lastSemester = allSemesterNames[allSemesterNames.length - 1] || 'Spring 2028';

      const [startSemester, startYearStr] = firstSemester.split(' ');
      const [endSemester, endYearStr] = lastSemester.split(' ');

      const startYear = parseInt(startYearStr);
      const endYear = parseInt(endYearStr);

      console.log('Parsed semesters:', semesters);

      return {
        userInfo: {
          name,
          studentId,
          major,
          startSemester,
          startYear,
          endSemester,
          endYear,
          totalCreditsToGraduate
        },
        semesters
      };
    } catch (error) {
      console.error('Error parsing file:', error);
      return null;
    }
  };

  // Function to generate and download the degree plan document
  const savePlan = () => {
    // Create document content
    const generateDocContent = () => {
      // Extract user information for the document
      const studentName = defaultUserInfo.name;
      const studentId = defaultUserInfo.studentId;
      const major = majorFullName;
      const school = major === 'Computer Science' ? 'SSE' :
                    major === 'Business Administration' ? 'SBA' : 'SHSS';

      // Calculate total credits across all semesters
      const totalCredits = semesterPlans.reduce((total, semester) => total + semester.credits, 0);

      // Get all possible semesters from user's start to end date
      const allPossibleSemesters = getAllSemesters();

      // Group semesters by academic year for organized display
      const semestersByYear: Record<string, Array<{
        term: string;
        year: number;
        courses: Course[];
        credits: number;
        name: string;
      }>> = {};

      // Initialize all possible semesters with empty courses
      allPossibleSemesters.forEach(semesterName => {
        const parts = semesterName.split(' ');
        const term = parts[0]; // Fall, Spring, Summer
        const year = parseInt(parts[1]);

        // Determine academic year (Fall starts the academic year)
        let academicYear;
        if (term === 'Fall') {
          academicYear = `${year}/${year + 1}`;
        } else {
          academicYear = `${year - 1}/${year}`;
        }

        // Initialize the academic year array if it doesn't exist
        if (!semestersByYear[academicYear]) {
          semestersByYear[academicYear] = [];
        }

        // Find if this semester exists in the plan
        const existingSemester = semesterPlans.find(s => s.semester === semesterName);

        // Add this semester to its academic year (either with courses or empty)
        semestersByYear[academicYear].push({
          term,
          year,
          name: semesterName,
          courses: existingSemester ? existingSemester.courses : [],
          credits: existingSemester ? existingSemester.credits : 0
        });
      });

      // Sort semesters within each academic year (Fall, Spring, Summer)
      const termOrder: Record<string, number> = { 'Fall': 0, 'Spring': 1, 'Summer': 2 };
      Object.keys(semestersByYear).forEach(year => {
        semestersByYear[year].sort((a, b) => termOrder[a.term] - termOrder[b.term]);
      });

      // Generate document content with formatting
      let content = `
=======================================================================
                      DEGREE PLAN TEMPLATE
=======================================================================
Use this template as your roadmap to graduation.

-----------------------------------------------------------------------
                     STUDENT INFORMATION
-----------------------------------------------------------------------
Name: ${studentName}
ID: ${studentId}
Major: ${major}
School: ${school}

`;

      // Add academic years and semesters to the document
      Object.keys(semestersByYear).sort().forEach(academicYear => {
        content += `=======================================================================
                   ACADEMIC YEAR: ${academicYear}
=======================================================================\n`;

        // Add each semester in this academic year
        semestersByYear[academicYear].forEach(semester => {
          content += `\n-----------------------------------------------------------------------
                        ${semester.term} ${semester.year}
-----------------------------------------------------------------------\n`;
          content += 'Course ID\t\tCourse Title\t\t\t\tSCH\n';
          content += '-----------------------------------------------------------------------\n';

          // Add each course in this semester
          if (semester.courses.length > 0) {
            semester.courses.forEach(course => {
              // Pad course code and name for better formatting
              const paddedCode = course.course_code.padEnd(15, ' ');
              const paddedName = course.course_name.padEnd(40, ' ');
              content += `${paddedCode}${paddedName}${course.credits}\n`;
            });
          } else {
            // Add a placeholder for empty semesters
            content += 'NONE\t\tNo courses added\t\t\t\t0\n';
          }

          content += '-----------------------------------------------------------------------\n';
          content += `Total SCH: ${semester.credits}\n`;
        });

        // Calculate academic year total credits
        const yearTotal = semestersByYear[academicYear].reduce((total, sem) => total + sem.credits, 0);
        content += `\nTotal SCH for ${academicYear}: ${yearTotal}\n\n`;
      });

      // Add degree summary section
      content += `
=======================================================================
                        DEGREE SUMMARY
=======================================================================
Total Credits Completed: ${totalCredits}
Credits Required for Graduation: ${defaultUserInfo.totalCreditsToGraduate}
Remaining Credits: ${Math.max(0, defaultUserInfo.totalCreditsToGraduate - totalCredits)}

=======================================================================
                  MINIMUM DEGREE REQUIREMENTS
=======================================================================
SBA: 120 SCH
SHSS: 120 SCH
SSE: 134-136 SCH (depending on program)
`;

      return content;
    };

    // Helper function to get all possible semesters between start and end dates
    const getAllSemesters = () => {
      if (!userInfo) return [];

      const startYear = userInfo.startYear;
      const endYear = userInfo.endYear;
      const startSemester = userInfo.startSemester;
      const endSemester = userInfo.endSemester;

      const allSemesters: string[] = [];
      let currentYear = startYear;
      let currentSemester = startSemester;

      // Order of semesters in a year
      const semesterOrder = ['Fall', 'Spring', 'Summer'];
      const startSemesterIndex = semesterOrder.indexOf(startSemester);

      // Add all semesters until we reach or pass the end semester and year
      while (
        currentYear < endYear ||
        (currentYear === endYear && semesterOrder.indexOf(currentSemester) <= semesterOrder.indexOf(endSemester))
      ) {
        // Determine the year to display for this semester
        const displayYear = currentSemester === 'Fall' ? currentYear : currentYear + 1;
        allSemesters.push(`${currentSemester} ${displayYear}`);

        // Move to the next semester
        const nextSemesterIndex = (semesterOrder.indexOf(currentSemester) + 1) % semesterOrder.length;
        currentSemester = semesterOrder[nextSemesterIndex];

        // If we've gone through all semesters in a year, increment the year
        if (nextSemesterIndex === 0) {
          currentYear++;
        }
      }

      return allSemesters;
    };

    // Generate the document content
    const docContent = generateDocContent();

    // Create a Blob with the content for downloading
    const blob = new Blob([docContent], { type: 'text/plain' });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${defaultUserInfo.name.replace(/\s+/g, '_')}_${defaultUserInfo.studentId}_DegreePlan.txt`;

    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the URL object to free memory
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Backdrop blur overlay for the header */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0f172a] backdrop-blur-xl border-b border-white/10 z-[48]" />

      {/* Header content */}
      <header className="fixed top-0 left-0 right-0 h-20 z-[49]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo and user information */}
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
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  AUI Track
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{majorFullName}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-400">{defaultUserInfo.name}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions (credits display and buttons) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <TotalCredits />

              {/* Import Plan button */}
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>Import Plan</span>
            </button>

              {/* Save Plan button */}
              <button
                onClick={savePlan}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white flex items-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
                <span>Save Plan</span>
            </button>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Import Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <>
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-[50]"
              onClick={() => setIsImportModalOpen(false)}
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[60] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-[#1e293b] border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-white mb-4">Import Degree Plan</h3>

                <p className="text-gray-300 mb-6">
                  Upload a degree plan file that you previously exported from this application.
                  This will replace your current plan with the imported one.
                </p>

                {/* Error message */}
                {importError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {importError}
        </div>
                )}

                {/* Success message */}
                {importSuccess && (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                    {importSuccess}
      </div>
                )}

                {/* File input (hidden) */}
                <input
                  type="file"
                  accept=".txt"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  className="hidden"
                />

                {/* Custom file input button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 mb-4 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Select File
                </button>

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
    </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// CourseNode component that displays a single course in a semester
function CourseNode({
  course,           // The course object to display
  onRemove          // Function to call when removing the course
}: {
  course: Course;
  onRemove: () => void;
}) {
  // State to track if the course details are expanded
  const [expanded, setExpanded] = useState(false);

  // Calculate the total credits for this course
  const credits = parseInt(course.credits);

  return (
    <motion.div
      // Animation for the course node (fades in and slides up)
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all duration-300"
    >
      {/* Main course information (always visible) */}
      <div className="p-4">
        <div className="flex justify-between">
        <div>
            {/* Course code and name */}
            <h4 className="font-semibold text-white">{course.course_code}</h4>
            <p className="text-sm text-gray-400 mt-1">{course.course_name}</p>
          </div>

          <div className="flex items-start space-x-2">
            {/* Credits badge */}
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {credits} {credits === 1 ? 'Credit' : 'Credits'}
            </span>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Toggle button to expand/collapse details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-gray-500 flex items-center hover:text-gray-300 transition-colors"
        >
          <span>{expanded ? 'Hide details' : 'Show details'}</span>
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded details section (only visible when expanded) */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-white/2">
          {/* Prerequisites section */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-400 mb-1">Prerequisites:</h5>
              <div className="text-xs text-gray-500">
                {course.prerequisites.map((group, i) => (
                  <div key={i} className="mb-1 last:mb-0">
                    {/* Display prerequisites with AND/OR logic */}
                    {group.map((prereq, j) => (
                      <React.Fragment key={j}>
                        <span className="text-blue-400">{(prereq as Prerequisite).value}</span>
                        {j < group.length - 1 && <span className="text-green-400 mx-1">OR</span>}
                      </React.Fragment>
                    ))}
                    {i < course.prerequisites.length - 1 && (
                      <span className="text-purple-400 mx-1">AND</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Corequisites section */}
          {course.corequisites && course.corequisites.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-400 mb-1">Corequisites:</h5>
              <div className="text-xs text-gray-500">
                {course.corequisites.map((coreq, i) => (
                  <span key={i} className="text-yellow-400">
                    {coreq}
                    {i < course.corequisites.length - 1 && ', '}
                </span>
                ))}
                </div>
            </div>
          )}

          {/* Sections/Instructors section */}
          {course.sections && course.sections.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-400 mb-1">Available Sections:</h5>
              <div className="text-xs text-gray-500">
                {course.sections.map((section, i) => (
                  <div key={i} className="mb-1 last:mb-0">
                    <span className="text-gray-400">{section.instructor}</span>
                    {section.schedule && (
                      <span className="text-gray-500 ml-2">{section.schedule}</span>
            )}
          </div>
                ))}
        </div>
      </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// AddCourseButton component that displays a button to add courses to a semester
// and handles the course selection modal
function AddCourseButton({ semester, type }: { semester: string; type: 'regular' | 'summer' }) {
  // State for controlling the visibility of the course selection modal
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Get the store state and actions
  const { courseData, semesterPlans, addCourse } = useDegreePlanStore();

  // Get all courses that have been added to the plan in previous semesters
  // This is used to check if prerequisites are satisfied
  const addedCourses = useMemo(() => {
    if (!semesterPlans) return [];

    // Get all courses from all semesters
    const allCourses = semesterPlans.flatMap(plan => plan.courses.map(course => course.course_code));

    // Get all courses from semesters that come before the current semester
    // and include courses from the current semester as well
    const currentSemesterIndex = semesterPlans.findIndex(plan => plan.semester === semester);
    if (currentSemesterIndex === -1) return allCourses; // If semester not found, use all courses

    // Include all semesters up to and including the current one
    const relevantSemesters = semesterPlans.slice(0, currentSemesterIndex + 1);
    return relevantSemesters.flatMap(semester => semester.courses.map(course => course.course_code));
  }, [semesterPlans, semester]);

  // Get courses that are already in the current semester
  const currentSemesterCourses = useMemo(() => {
    const currentSemester = semesterPlans.find(plan => plan.semester === semester);
    return currentSemester ? currentSemester.courses.map(course => course.course_code) : [];
  }, [semesterPlans, semester]);

  // Check if prerequisites for a course are satisfied based on previously added courses
  const arePrerequisitesSatisfied = useCallback((course: Course) => {
    // If the course has no prerequisites or empty prerequisites array, it's available
    if (!course.prerequisites || course.prerequisites.length === 0) {
      if (debugMode) console.log(`Course ${course.course_code} has no prerequisites`);
      return true;
    }

    // If the prerequisites array contains an empty array, it means no prerequisites
    if (course.prerequisites.some(group => Array.isArray(group) && group.length === 0)) {
      if (debugMode) console.log(`Course ${course.course_code} has an empty prerequisite group`);
      return true;
    }

    if (debugMode) {
      console.log(`Checking prerequisites for ${course.course_code}:`);
      console.log(`Prerequisites:`, course.prerequisites);
      console.log(`Added courses:`, addedCourses);
    }

    // Helper function to normalize course codes for comparison
    const normalizeCourseCode = (code: string) => {
      if (!code) return '';
      // Remove spaces, hyphens, and convert to uppercase
      return code.replace(/[\s-]+/g, '').toUpperCase();
    };

    // Helper function to check if two course codes match
    const courseCodesMatch = (code1: string, code2: string) => {
      return normalizeCourseCode(code1) === normalizeCourseCode(code2);
    };

    // Get normalized versions of added courses for comparison
    const normalizedAddedCourses = addedCourses.map(normalizeCourseCode);

    if (debugMode) {
      console.log(`Normalized added courses:`, normalizedAddedCourses);
    }

    // Special case for CSC 2302 which requires CSC 1401
    if (course.course_code === "CSC 2302") {
      const hasCSC1401 = addedCourses.some(code => courseCodesMatch(code, "CSC1401"));

      if (debugMode) {
        console.log(`Special check for CSC 2302 - Has CSC1401: ${hasCSC1401}`);
      }

      if (hasCSC1401) return true;
    }

    // Prerequisites are in the format of AND of ORs
    // Each outer array element is an AND condition
    // Each inner array element is an OR condition
    const result = course.prerequisites.every(orGroup => {
      // Handle case where orGroup is not an array (direct prerequisite object)
      if (!Array.isArray(orGroup)) {
        const prereqValue = (orGroup as unknown as Prerequisite).value;
        const normalizedPrereqValue = normalizeCourseCode(prereqValue);
        const isSatisfied = addedCourses.some(code => courseCodesMatch(code, prereqValue));
        if (debugMode) console.log(`  Direct prerequisite ${prereqValue} (normalized: ${normalizedPrereqValue}) satisfied: ${isSatisfied}`);
        return isSatisfied;
      }

      // If this is an empty group, it's satisfied
      if (orGroup.length === 0) {
        if (debugMode) console.log(`  Empty prerequisite group - automatically satisfied`);
        return true;
      }

      // If any of the OR conditions are met, this prerequisite group is satisfied
      const groupResult = orGroup.some(prereq => {
        // Handle different formats of prerequisites
        let prereqValue;
        if (typeof prereq === 'string') {
          prereqValue = prereq;
        } else if (prereq && typeof prereq === 'object') {
          prereqValue = (prereq as unknown as Prerequisite).value;
        } else {
          if (debugMode) console.log(`  Invalid prerequisite format:`, prereq);
          return false; // Invalid prerequisite format
        }

        // Check if the prerequisite course is in the added courses
        const isSatisfied = addedCourses.some(code => courseCodesMatch(code, prereqValue));
        if (debugMode) console.log(`  Prerequisite ${prereqValue} satisfied: ${isSatisfied}`);
        return isSatisfied;
      });

      if (debugMode) console.log(`  Prerequisite group satisfied: ${groupResult}`);
      return groupResult;
    });

    if (debugMode) console.log(`All prerequisites satisfied for ${course.course_code}: ${result}`);
    return result;
  }, [addedCourses, debugMode]);

  // Filter courses based on search term and prerequisites
  const filteredCourses = useMemo(() => {
    if (!courseData) return [];

    // First filter by search term
    let filtered = courseData.filter(course => {
      const searchLower = searchTerm.toLowerCase();
      return (
        course.course_code.toLowerCase().includes(searchLower) ||
        course.course_name.toLowerCase().includes(searchLower)
      );
    });

    // Filter out courses that are already in the current semester
    filtered = filtered.filter(course => !currentSemesterCourses.includes(course.course_code));

    // Then filter by prerequisites if not showing all courses
    if (!showAllCourses) {
      filtered = filtered.filter(course => {
        // Show courses with no prerequisites
        if (!course.prerequisites || course.prerequisites.length === 0) {
          return true;
        }

        // Show courses with empty prerequisite arrays
        if (course.prerequisites.some(group =>
          Array.isArray(group) && group.length === 0 ||
          (group && typeof group === 'object' && Object.keys(group).length === 0)
        )) {
          return true;
        }

        // Show courses with satisfied prerequisites
        return arePrerequisitesSatisfied(course);
      });
    }

    return filtered;
  }, [courseData, searchTerm, showAllCourses, arePrerequisitesSatisfied, currentSemesterCourses]);

  // Function to add a course and close the modal
  const handleAddCourse = (course: Course) => {
    addCourse(semester, course);

    // Log the course being added for debugging
    console.log(`Adding course ${course.course_code} to ${semester}`);
    console.log(`Current added courses:`, addedCourses);

    // Force an immediate update of the addedCourses list
    // This ensures that prerequisites are re-evaluated immediately
    const event = new CustomEvent('course-added', {
      detail: { courseCode: course.course_code, semester }
    });
    document.dispatchEvent(event);

    // Close the modal after a short delay to allow the UI to update
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  // Function to test prerequisites for a specific course (for debugging)
  const testPrerequisites = (courseCode: string) => {
    if (!courseData) return;

    const course = courseData.find(c => c.course_code === courseCode);
    if (!course) {
      console.log(`Course ${courseCode} not found`);
      return;
    }

    console.log(`Testing prerequisites for ${courseCode}:`);
    console.log(`Prerequisites:`, course.prerequisites);
    console.log(`Added courses:`, addedCourses);

    const result = arePrerequisitesSatisfied(course);
    console.log(`Prerequisites satisfied: ${result}`);
  };

  // Listen for course-added events to update prerequisites status
  useEffect(() => {
    const handleCourseAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { courseCode, semester: eventSemester } = customEvent.detail;

      console.log(`Course added event received in AddCourseButton: ${courseCode} in ${eventSemester}`);

      // Force a re-render by updating the search term slightly and then back
      // This is a hack to force the component to re-evaluate prerequisites
      setSearchTerm(prev => prev + ' ');
      setTimeout(() => setSearchTerm(prev => prev.trim()), 10);
    };

    document.addEventListener('course-added', handleCourseAdded);
    return () => {
      document.removeEventListener('course-added', handleCourseAdded);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-16 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all duration-300"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Course
      </button>

        {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Add Course to {semester}</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

            <div className="p-4 border-b border-white/10 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                  placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                <svg className="absolute right-3 top-2.5 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showAllCourses"
                    checked={showAllCourses}
                    onChange={() => setShowAllCourses(!showAllCourses)}
                    className="rounded text-blue-500 focus:ring-blue-500 bg-white/5 border-white/10"
                  />
                  <label htmlFor="showAllCourses" className="text-white/70 text-sm">
                    Show all courses
                  </label>
              </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="debugMode"
                    checked={debugMode}
                    onChange={() => setDebugMode(!debugMode)}
                    className="rounded text-blue-500 focus:ring-blue-500 bg-white/5 border-white/10"
                  />
                  <label htmlFor="debugMode" className="text-white/70 text-sm">
                    Debug mode
                  </label>
                </div>

                <div className="text-white/70 text-sm">
                  {!showAllCourses && <span>Showing available courses only</span>}
                </div>
              </div>

              {debugMode && (
                <div className="p-2 bg-gray-800 rounded-lg">
                  <div className="text-white/70 text-sm mb-2">Debug Tools:</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => testPrerequisites('CSC 2302')}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                    >
                      Test CSC 2302
                    </button>
                    <button
                      onClick={() => console.log('Added courses:', addedCourses)}
                      className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs"
                    >
                      Log Added Courses
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Course list */}
            <div className="overflow-y-auto max-h-[50vh] p-6 space-y-3 custom-scrollbar">
                  {filteredCourses.map((course) => (
                    <motion.button
                      key={course.course_code}
                      whileHover={{ scale: 1.02 }}
                  onClick={() => handleAddCourse(course)}
                  className="w-full group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex justify-between items-start">
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white">{course.course_code}</div>
                      <div className="text-sm text-gray-400 mt-1">{course.course_name}</div>
                        </div>
                    <div className="flex-shrink-0 ml-4 flex flex-col items-end space-y-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-white border border-white/10">
                            {course.credits} Credits
                          </span>
                          {course.prerequisites && course.prerequisites.length > 0 &&
                        course.prerequisites.some(group => Array.isArray(group) ? group.length > 0 : group) && (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            arePrerequisitesSatisfied(course)
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                          } border`}>
                            {arePrerequisitesSatisfied(course) ? "Prerequisites Met" : "Prerequisites Not Met"}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}

              {/* Empty state when no courses match the search */}
              {filteredCourses.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-0.5">
                    <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                </div>
              </div>
                  <p className="text-gray-400 text-sm">
                    {showAllCourses
                      ? "No courses found matching your search"
                      : "No available courses found. Try showing all courses or check if you've already added all available courses."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ErrorMessage component that displays validation errors to the user
function ErrorMessage({ message }: { message: string }) {
  // State to track if the error message is visible
  const [visible, setVisible] = useState(true);

  // Automatically hide the error message after 5 seconds
  useEffect(() => {
    // Reset visibility when message changes
    setVisible(true);

    // Set a timeout to hide the message
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Clean up the timeout when component unmounts or message changes
    return () => clearTimeout(timer);
  }, [message]);

  // If not visible, don't render anything
  if (!visible) return null;

  return (
        <motion.div
      // Animation for the error message
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setVisible(false)} />
      <div className="relative bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl px-6 py-4 shadow-xl max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          {/* Error icon */}
          <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

          {/* Error message text */}
          <p className="text-white">{message}</p>

          {/* Close button */}
                <button
            onClick={() => setVisible(false)}
            className="ml-4 text-white/70 hover:text-white transition-colors flex-shrink-0"
                >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>
          </div>
        </motion.div>
  );
}

// SemesterGroup component that displays a semester with its courses
function SemesterGroup({ semester, type }: {
  semester: string;       // The semester name (e.g., "Fall 2024")
  type: 'regular' | 'summer'; // The type of semester (affects credit limits)
}) {
  // Get state and actions from the global store
  const { semesterPlans, removeCourse } = useDegreePlanStore();

  // Find the semester plan that matches this semester
  const semesterPlan = useMemo(() => {
    return semesterPlans.find(plan => plan.semester === semester);
  }, [semesterPlans, semester]);

  // Calculate the credit limit based on semester type
  const creditLimit = type === 'summer' ? 10 : 22;

  // Calculate the percentage of credits used
  const creditPercentage = semesterPlan
    ? Math.min(Math.round((semesterPlan.credits / creditLimit) * 100), 100)
    : 0;

  // Determine the color of the credit bar based on percentage
  const getCreditBarColor = () => {
    if (creditPercentage < 50) return 'bg-green-500';
    if (creditPercentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden shadow-xl">
      {/* Semester header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-start">
        <div>
            {/* Semester name */}
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            {semester}
            </h3>

            {/* Credits display */}
          <div className="flex items-center mt-2">
              <span className="text-sm text-gray-400">
                {semesterPlan?.credits || 0} / {creditLimit} Credits
            </span>
          </div>

            {/* Credit usage progress bar */}
            <div className="mt-2 h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getCreditBarColor()}`}
                style={{ width: `${creditPercentage}%` }}
              />
        </div>
          </div>

          {/* Add Course button */}
        <AddCourseButton semester={semester} type={type} />
      </div>
      </div>

      {/* Course list */}
      <div className="p-6 space-y-4">
      <AnimatePresence>
          {/* Map through courses in this semester */}
          {semesterPlan?.courses.map((course) => (
          <CourseNode
            key={course.course_code}
            course={course}
            onRemove={() => removeCourse(semester, course.course_code)}
          />
        ))}
      </AnimatePresence>

        {/* Empty state when no courses are added */}
        {(!semesterPlan?.courses || semesterPlan.courses.length === 0) && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/5 p-0.5">
              <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              No courses added to this semester yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// YearGroup component that displays a full academic year with its semesters
function YearGroup({ year, semesters, index, refreshKey }: {
  year: number;           // The year number (e.g., 1, 2, 3, 4)
  semesters: any[];       // Array of semesters in this academic year
  index: number;          // Index for animation delay
  refreshKey: number;     // Key to force re-renders
}) {
  return (
    <motion.div
      // Animation for the year group (fades in from bottom with delay based on index)
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="relative"
    >
      {/* Year header with glowing effect */}
      <div className="flex items-center mb-8">
        <div className="relative">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          {/* Year number badge */}
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold border border-white/20 shadow-lg">
          {year}
        </div>
      </div>
        {/* Year title */}
        <div className="ml-6">
          <h2 className="text-2xl font-bold text-white">Academic Year</h2>
          <p className="text-emerald-400/80 text-sm mt-1">Plan your courses for Year {year}</p>
        </div>
      </div>

      {/* Semesters grid - 3 columns on large screens, 1 column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {semesters.map((semester, i) => (
          <motion.div
            key={`${semester.name}-${refreshKey}`}
            // Animation for each semester (slides in from sides with delay)
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + index * 0.2 }}
          >
            {/* Render the SemesterGroup component for this semester */}
            <SemesterGroup
              semester={semester.name}
              type={semester.type}
              key={`${semester.name}-${refreshKey}`}
            />
          </motion.div>
          ))}
      </div>
    </motion.div>
  );
}

export default function DegreePlanPage() {
  const router = useRouter();
  const { courseData, error, resetPlan, semesterPlans, userInfo, setCourseData, setUserInfo } = useDegreePlanStore();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key to force re-renders

  // Add custom scrollbar styles
  useEffect(() => {
    // Add custom scrollbar styles to the document
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Listen for course-added events to update all AddCourseButton components
  useEffect(() => {
    const handleCourseAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { courseCode, semester } = customEvent.detail;

      console.log(`Course added event received: ${courseCode} in ${semester}`);

      // Force a re-render of all components by updating the refresh key
      setRefreshKey(prev => prev + 1);
    };

    document.addEventListener('course-added', handleCourseAdded);
    return () => {
      document.removeEventListener('course-added', handleCourseAdded);
    };
  }, []);

  // Check for import query parameter and open import modal if present
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('import') === 'true') {
      setIsImportModalOpen(true);
      setIsImporting(true);
      // Remove the query parameter to avoid reopening the modal on refresh
      router.replace('/degree-plan', { scroll: false });
    }
  }, [router]);

  // Check for imported data in localStorage
  useEffect(() => {
    const { addCourse } = useDegreePlanStore.getState();
    const importedUserInfo = localStorage.getItem('importedUserInfo');
    const importedSemesters = localStorage.getItem('importedSemesters');

    if (importedUserInfo && !userInfo) {
      try {
        const parsedUserInfo = JSON.parse(importedUserInfo);
        setUserInfo(parsedUserInfo);

        // If we have imported semesters, add them to the plan
        if (importedSemesters) {
          const parsedSemesters = JSON.parse(importedSemesters);

          // Reset the plan first
          resetPlan();

          // Add courses to each semester
          parsedSemesters.forEach((sem: any) => {
            sem.courses.forEach((course: any) => {
              addCourse(sem.name, course);
            });
          });

          // Clear localStorage after use
          localStorage.removeItem('importedSemesters');
        }

        localStorage.removeItem('importedUserInfo');
      } catch (error) {
        console.error('Error parsing imported data:', error);
      }
    }
  }, [userInfo, setUserInfo, resetPlan]);

  // Redirect to user-info page if userInfo is not set and not importing
  useEffect(() => {
    // Check URL parameters directly to ensure we don't redirect during import
    const searchParams = new URLSearchParams(window.location.search);
    const isImportParam = searchParams.get('import') === 'true';

    // Check if there's imported data in localStorage
    const hasImportedData = localStorage.getItem('importedUserInfo') !== null;

    // Only redirect if not importing (either from state or URL parameter) and no imported data
    if (!userInfo && !isImporting && !isImportParam && !hasImportedData) {
      router.push('/user-info');
    }
  }, [userInfo, router, isImporting]);

  // Load course data if not already loaded
  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseData) {
        try {
          const data = (await import('../../../jz_scraper_final.json')).default;
          if (Array.isArray(data)) {
            setCourseData(data);
          } else {
            throw new Error('Invalid course data format');
          }
        } catch (err) {
          console.error('Error loading course data:', err);
        }
      }
    };

    loadCourseData();
  }, [courseData, setCourseData]);

  // Initialize empty plan when component mounts
  useEffect(() => {
  if (!semesterPlans || semesterPlans.length === 0) {
      resetPlan();
    }
  }, [semesterPlans, resetPlan]);

  // Generate years based on user's selected start and end years
  const years = useMemo(() => {
    if (!userInfo) return [];

    const startYear = userInfo.startYear;
    const endYear = userInfo.endYear;
    const startSemester = userInfo.startSemester;
    const endSemester = userInfo.endSemester;

    // Create an array of all semesters between start and end
    const allSemesters: Array<{
      name: string;
      type: 'regular' | 'summer';
      academicYear: number;
      order: number;
    }> = [];

    let currentYear = startYear;
    let currentSemester = startSemester;

    // Order of semesters in a year
    const semesterOrder = ['Fall', 'Spring', 'Summer'];

    // Find the index of the starting semester
    const startSemesterIndex = semesterOrder.indexOf(startSemester);
    if (startSemesterIndex === -1) return []; // Invalid semester

    // Add all semesters until we reach or pass the end semester and year
    while (
      currentYear < endYear ||
      (currentYear === endYear && semesterOrder.indexOf(currentSemester) <= semesterOrder.indexOf(endSemester))
    ) {
      // Determine the year to display for this semester
      // Fall is in the current year, Spring and Summer are in the next year
      const displayYear = currentSemester === 'Fall' ? currentYear : currentYear + 1;

      allSemesters.push({
        name: `${currentSemester} ${displayYear}`,
        type: currentSemester === 'Summer' ? 'summer' as const : 'regular' as const,
        academicYear: Math.floor(allSemesters.length / 3) + 1, // Group every 3 semesters as 1 academic year
        order: allSemesters.length // Keep original order
      });

      // Move to the next semester
      const nextSemesterIndex = (semesterOrder.indexOf(currentSemester) + 1) % semesterOrder.length;
      currentSemester = semesterOrder[nextSemesterIndex];

      // If we've gone through all semesters in a year, increment the year
      if (nextSemesterIndex === 0) {
        currentYear++;
      }
    }

    // Group semesters by academic year (every 3 semesters)
    const academicYears: Record<number, Array<{
      name: string;
      type: 'regular' | 'summer';
      academicYear: number;
      order: number;
    }>> = {};

    // Group by academic year (starting with the user's selected semester)
    for (let i = 0; i < allSemesters.length; i++) {
      const yearNumber = Math.floor(i / 3) + 1;
      if (!academicYears[yearNumber]) {
        academicYears[yearNumber] = [];
      }
      academicYears[yearNumber].push(allSemesters[i]);
    }

    // Convert to the expected format
    return Object.keys(academicYears).map(yearKey => {
      const yearNumber = parseInt(yearKey);
      return {
        year: yearNumber,
        semesters: academicYears[yearNumber].map(semester => ({
          name: semester.name,
          type: semester.type
        }))
      };
    });
  }, [userInfo]);

  // Only show loading state when courseData is not loaded
  if (!courseData) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <Header isImportModalOpen={isImportModalOpen} setIsImportModalOpen={setIsImportModalOpen} isImporting={isImporting} setIsImporting={setIsImporting} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
                <motion.svg
                  className="w-8 h-8 text-white"
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
            <p className="text-gray-400">
              {isImporting ? "Please select a degree plan file to import..." : "Loading course data..."}
            </p>
            </div>
          </div>
      </div>
    );
  }

  // Create default userInfo if not set (for testing)
  const defaultUserInfo = userInfo || (isImporting ? null : {
    name: "Test User",
    studentId: "S12345",
    major: "CS",
    startSemester: "Fall",
    startYear: 2024,
    endSemester: "Spring",
    endYear: 2028,
    totalCreditsToGraduate: 136
  });

  // Use default years if userInfo is not set and not importing
  const displayYears = userInfo ? years : (isImporting ? [] : [
    {
      year: 1,
      semesters: [
        { name: 'Fall 2023', type: 'regular' as const },
        { name: 'Spring 2024', type: 'regular' as const },
        { name: 'Summer 2024', type: 'summer' as const }
      ]
    },
    {
      year: 2,
      semesters: [
        { name: 'Fall 2024', type: 'regular' as const },
        { name: 'Spring 2025', type: 'regular' as const },
        { name: 'Summer 2025', type: 'summer' as const }
      ]
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-radial from-[#1e293b] to-[#0f172a] opacity-40 z-0" />

      <Header isImportModalOpen={isImportModalOpen} setIsImportModalOpen={setIsImportModalOpen} isImporting={isImporting} setIsImporting={setIsImporting} />

      {/* Main content */}
      <main className="relative pt-28 pb-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isImporting && !userInfo ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Import Your Degree Plan</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Click the "Import Plan" button in the header to upload a degree plan file that you previously exported from this application.
                </p>
              </div>
            </div>
          ) : (
            displayYears.map((year, index) => (
              <YearGroup
                key={year.year}
                year={year.year}
                semesters={year.semesters}
                index={index}
                refreshKey={refreshKey}
              />
            ))
          )}
        </div>
      </main>

      {/* Error message */}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
