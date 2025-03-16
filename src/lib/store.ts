/**
 * Application State Management
 *
 * This file defines the global state management for the degree planning application using Zustand.
 * It includes:
 * - Type definitions for courses, prerequisites, semester plans, and user information
 * - The main store with initial state and actions for manipulating the state
 * - Logic for adding/removing courses with prerequisite validation
 * - Functions for managing semester plans and user information
 * - Utilities for calculating credits and checking graduation requirements
 *
 * The store serves as the central data management system for the entire application,
 * ensuring consistent state across all components and pages.
 */

import { create } from 'zustand';

// Define the Prerequisite type which represents a course prerequisite
// A prerequisite can have a type (e.g., "course") and a value (e.g., "MTH 1303")
interface Prerequisite {
  type: string;
  value: string;
}

// Define the Course type which represents a course in the curriculum
// Each course has a code, name, credits, prerequisites, corequisites, and sections
interface Course {
  course_code: string;        // Unique identifier for the course (e.g., "CSC 1401")
  course_name: string;        // Full name of the course (e.g., "Introduction to Programming")
  credits: string;            // Number of credit hours as a string (e.g., "3")
  prerequisites: Prerequisite[][]; // Nested array for complex prerequisite logic (AND/OR conditions)
  corequisites: string[];     // Array of course codes that must be taken concurrently
  sections: { instructor: string; schedule: string; }[]; // Available sections with instructor and schedule info
}

// Define the SemesterPlan type which represents a semester in the degree plan
// Each semester has a name, type, courses, and total credits
interface SemesterPlan {
  semester: string;           // Semester name (e.g., "Fall 2024")
  type: 'regular' | 'summer'; // Type of semester (regular or summer) which affects credit limits
  courses: Course[];          // Array of courses planned for this semester
  credits: number;            // Total credits for this semester (sum of all course credits)
}

// Define the UserInfo type which represents student information
// This includes personal details and academic preferences
interface UserInfo {
  name: string;               // Student's full name
  studentId: string;          // Student's ID number
  major: string;              // Student's major (e.g., "CS", "BA", "IS")
  startSemester: string;      // Starting semester (e.g., "Fall", "Spring", "Summer")
  startYear: number;          // Starting year (e.g., 2024)
  endSemester: string;        // Expected graduation semester
  endYear: number;            // Expected graduation year
  totalCreditsToGraduate: number; // Total credits required for graduation based on major
}

// Define the DegreePlanState interface which represents the complete application state
interface DegreePlanState {
  courseData: Course[] | null;  // Complete catalog of available courses (null when not loaded)
  semesterPlans: SemesterPlan[]; // Array of semester plans with their courses
  error: string | null;         // Error message for validation failures (null when no errors)
  userInfo: UserInfo | null;    // Student information (null when not set)

  // Action to set the course catalog data
  setCourseData: (data: Course[]) => void;

  // Action to reset the plan (initialize empty semesters)
  resetPlan: () => void;

  // Action to add a course to a specific semester
  addCourse: (semester: string, course: Course) => void;

  // Action to remove a course from a specific semester
  removeCourse: (semester: string, courseCode: string) => void;

  // Action to set the user information
  setUserInfo: (info: UserInfo) => void;
}

const SEMESTERS = [
  'Fall 2024', 'Spring 2025', 'Summer 2025',
  'Fall 2025', 'Spring 2026', 'Summer 2026',
  'Fall 2026', 'Spring 2027', 'Summer 2027',
  'Fall 2027', 'Spring 2028', 'Summer 2028'
];

// Credit limits
const REGULAR_SEMESTER_CREDIT_LIMIT = 22;
const SUMMER_SEMESTER_CREDIT_LIMIT = 10;

const createEmptyPlans = (): SemesterPlan[] => {
  return SEMESTERS.map(semester => ({
    semester,
    courses: [],
    credits: 0,
    type: semester.toLowerCase().includes('summer') ? 'summer' : 'regular'
  }));
};

// Helper function to get course code from prerequisite object
const getPrereqCode = (prereq: any): string => {
  if (typeof prereq === 'string') return prereq;
  if (prereq.type === 'course' && prereq.value) {
    // Format: "CSC1401" -> "CSC 1401"
    const code = prereq.value;
    return code.slice(0, 3) + ' ' + code.slice(3);
  }
  return '';
};

// Create the Zustand store with initial state and actions
const useDegreePlanStore = create<DegreePlanState>((set, get) => ({
  // Initial state
  courseData: null,           // Start with no course data
  semesterPlans: [],          // Start with no semester plans
  error: null,                // Start with no errors
  userInfo: null,             // Start with no user info

  // Action to set the course catalog data
  setCourseData: (data) => {
    set({ courseData: data });
  },

  // Action to set the user information
  setUserInfo: (info) => {
    set({ userInfo: info });
  },

  // Action to reset the plan and initialize empty semesters
  resetPlan: () => set(() => {
    // Get the user info to determine the starting semester
    const { userInfo } = get();

    if (!userInfo) {
      // Default plan with Fall-Spring-Summer pattern if no user info is available
      return {
        semesterPlans: [
          { semester: 'Fall 2024', type: 'regular', courses: [], credits: 0 },
          { semester: 'Spring 2025', type: 'regular', courses: [], credits: 0 },
          { semester: 'Summer 2025', type: 'summer', courses: [], credits: 0 },
          { semester: 'Fall 2025', type: 'regular', courses: [], credits: 0 },
          { semester: 'Spring 2026', type: 'regular', courses: [], credits: 0 },
          { semester: 'Summer 2026', type: 'summer', courses: [], credits: 0 },
          { semester: 'Fall 2026', type: 'regular', courses: [], credits: 0 },
          { semester: 'Spring 2027', type: 'regular', courses: [], credits: 0 },
          { semester: 'Summer 2027', type: 'summer', courses: [], credits: 0 },
          { semester: 'Fall 2027', type: 'regular', courses: [], credits: 0 },
          { semester: 'Spring 2028', type: 'regular', courses: [], credits: 0 },
          { semester: 'Summer 2028', type: 'summer', courses: [], credits: 0 }
        ],
        error: null
      };
    }

    // Generate semesters based on user's selected start and end
    const startYear = userInfo.startYear;
    const endYear = userInfo.endYear;
    const startSemester = userInfo.startSemester;
    const endSemester = userInfo.endSemester;

    // Order of semesters in a year
    const semesterOrder = ['Fall', 'Spring', 'Summer'];

    // Find the index of the starting semester
    const startSemesterIndex = semesterOrder.indexOf(startSemester);
    if (startSemesterIndex === -1) {
      // Invalid semester, use default
      return {
        semesterPlans: [
          { semester: 'Fall 2024', type: 'regular', courses: [], credits: 0 },
          { semester: 'Spring 2025', type: 'regular', courses: [], credits: 0 },
          { semester: 'Summer 2025', type: 'summer', courses: [], credits: 0 }
        ],
        error: null
      };
    }

    // Generate all semesters between start and end
    const semesterPlans = [];
    let currentYear = startYear;
    let currentSemester = startSemester;

    while (
      currentYear < endYear ||
      (currentYear === endYear && semesterOrder.indexOf(currentSemester) <= semesterOrder.indexOf(endSemester))
    ) {
      // Determine the year to display for this semester
      const displayYear = currentSemester === 'Fall' ? currentYear : currentYear + 1;

      semesterPlans.push({
        semester: `${currentSemester} ${displayYear}`,
        type: currentSemester === 'Summer' ? 'summer' : 'regular',
        courses: [],
        credits: 0
      });

      // Move to the next semester
      const nextSemesterIndex = (semesterOrder.indexOf(currentSemester) + 1) % semesterOrder.length;
      currentSemester = semesterOrder[nextSemesterIndex];

      // If we've gone through all semesters in a year, increment the year
      if (nextSemesterIndex === 0) {
        currentYear++;
      }
    }

    return {
      semesterPlans,
      error: null
    };
  }),

  // Action to add a course to a specific semester
  addCourse: (semester, course) => {
    // Get the current state
    const { semesterPlans } = get();

    // Find the semester plan to add the course to
    const semesterPlan = semesterPlans.find(plan => plan.semester === semester);

    // If semester not found, do nothing
    if (!semesterPlan) return;

    // Check if course already exists in this semester
    if (semesterPlan.courses.some(c => c.course_code === course.course_code)) {
      set({ error: `${course.course_code} is already in ${semester}` });
      return;
    }

    // Check if course exists in any other semester
    const existsInOtherSemester = semesterPlans.some(plan =>
      plan.semester !== semester &&
      plan.courses.some(c => c.course_code === course.course_code)
    );

    if (existsInOtherSemester) {
      set({ error: `${course.course_code} is already in another semester` });
      return;
    }

    // Check credit limit (22 for regular semesters, 10 for summer)
    const creditLimit = semesterPlan.type === 'summer' ? 10 : 22;
    const newCredits = semesterPlan.credits + parseInt(course.credits);

    if (newCredits > creditLimit) {
      set({ error: `Adding ${course.course_code} would exceed the credit limit for ${semester}` });
      return;
    }

    // Check prerequisites
    if (course.prerequisites && course.prerequisites.length > 0) {
      // Get all courses that have been added to previous semesters
      const previousSemesters = [];
      let foundCurrentSemester = false;

      for (const plan of semesterPlans) {
        if (plan.semester === semester) {
          foundCurrentSemester = true;
          break;
        }
        previousSemesters.push(...plan.courses);
      }

      // Helper function to normalize course codes for comparison
      const normalizeCourseCode = (code: string) => {
        if (!code) return '';
        // Remove spaces, hyphens, and convert to uppercase
        return code.replace(/[\s-]+/g, '').toUpperCase();
      };

      // Special case for CSC 2302 which requires CSC 1401
      if (course.course_code === "CSC 2302") {
        const hasCSC1401 = previousSemesters.some(c =>
          normalizeCourseCode(c.course_code) === normalizeCourseCode("CSC1401")
        );

        if (hasCSC1401) {
          // Skip the regular prerequisite check for CSC 2302
          // All checks passed, add the course
          const updatedSemesterPlans = semesterPlans.map(plan => {
            if (plan.semester === semester) {
              // Add course to this semester
              return {
                ...plan,
                courses: [...plan.courses, course],
                credits: plan.credits + parseInt(course.credits)
              };
            }
            return plan;
          });

          set({
            semesterPlans: updatedSemesterPlans,
            error: null // Clear any previous errors
          });
          return;
        }
      }

      // Check if prerequisites are satisfied
      const prerequisitesSatisfied = course.prerequisites.every(group => {
        // If the group is empty, it's satisfied
        if (group.length === 0) return true;

        // For OR conditions, at least one prerequisite must be satisfied
        return group.some(prereq => {
          // Normalize the prerequisite value
          const normalizedPrereq = normalizeCourseCode(prereq.value);

          // Check if the prerequisite course exists in previous semesters
          return previousSemesters.some(c =>
            normalizeCourseCode(c.course_code) === normalizedPrereq
          );
        });
      });

      if (!prerequisitesSatisfied) {
        set({ error: `Prerequisites for ${course.course_code} are not satisfied` });
        return;
      }
    }

    // All checks passed, add the course
    const updatedSemesterPlans = semesterPlans.map(plan => {
      if (plan.semester === semester) {
        // Add course to this semester
        return {
          ...plan,
          courses: [...plan.courses, course],
          credits: plan.credits + parseInt(course.credits)
        };
      }
      return plan;
    });

    set({
      semesterPlans: updatedSemesterPlans,
      error: null // Clear any previous errors
    });
  },

  // Action to remove a course from a specific semester
  removeCourse: (semester, courseCode) => {
    // Get the current state
    const { semesterPlans } = get();

    // Find the semester plan to remove the course from
    const semesterIndex = semesterPlans.findIndex(plan => plan.semester === semester);

    // If semester not found, do nothing
    if (semesterIndex === -1) return;

    // Find the course to remove
    const courseIndex = semesterPlans[semesterIndex].courses.findIndex(
      course => course.course_code === courseCode
    );

    // If course not found, do nothing
    if (courseIndex === -1) return;

    // Get the course to calculate credits
    const course = semesterPlans[semesterIndex].courses[courseIndex];

    // Check if this course is a prerequisite for any course in later semesters
    let isPrerequisite = false;
    let dependentCourse = '';

    // Loop through all semesters after the current one
    for (let i = semesterIndex + 1; i < semesterPlans.length; i++) {
      // Check each course in the semester
      for (const c of semesterPlans[i].courses) {
        // Skip if no prerequisites
        if (!c.prerequisites || c.prerequisites.length === 0) continue;

        // Check if this course is a prerequisite
        const isRequired = c.prerequisites.some(group =>
          group.some(prereq => prereq.value === courseCode)
        );

        if (isRequired) {
          isPrerequisite = true;
          dependentCourse = c.course_code;
          break;
        }
      }
      if (isPrerequisite) break;
    }

    // If it's a prerequisite, show error and don't remove
    if (isPrerequisite) {
      set({ error: `Cannot remove ${courseCode} because it's a prerequisite for ${dependentCourse}` });
      return;
    }

    // Create updated semester plans
    const updatedSemesterPlans = [...semesterPlans];

    // Remove the course and update credits
    updatedSemesterPlans[semesterIndex] = {
      ...updatedSemesterPlans[semesterIndex],
      courses: updatedSemesterPlans[semesterIndex].courses.filter(c => c.course_code !== courseCode),
      credits: updatedSemesterPlans[semesterIndex].credits - parseInt(course.credits)
    };

    // Update state
    set({
      semesterPlans: updatedSemesterPlans,
      error: null // Clear any previous errors
    });
  }
}));

// Export the store hook for use in components
export { useDegreePlanStore };
