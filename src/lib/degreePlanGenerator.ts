/**
 * Degree Plan Generator
 *
 * This file contains utilities and data for generating degree plans, including:
 * - Predefined course data for general education requirements
 * - Course category definitions and organization
 * - Helper functions for generating semester plans
 * - Logic for determining course availability and prerequisites
 *
 * It provides the foundation for creating structured degree plans based on
 * university requirements and course relationships, helping users build
 * academically valid plans that satisfy graduation requirements.
 */

import { Course, MajorRequirements } from './pdfParser';

interface DegreePlanOptions {
  includeSummer: boolean;
  summerTerms: number;
  transferCredits: Course[];
  specializations: string[];
}

interface CourseArea {
  name: string;
  minCredits: number;
  courses: Course[];
}

interface CourseCategory {
  code: string;
  name: string;
  credits: number;
  description: string;
  options: {
    code: string;
    name: string;
    prerequisites: string[];
  }[];
}

interface GeneralEducationCourse {
  code: string;
  name: string;
  credits: number;
  prerequisites: string[];
  category: string;
  required: boolean;
}

export const GENERAL_EDUCATION_COURSES: GeneralEducationCourse[] = [
  // Foundation Courses
  { code: 'FYE 1101', name: 'FYE Seminar I', credits: 1, prerequisites: [], category: 'Foundation', required: true },
  { code: 'FAS 0210', name: 'Strategic Academic Skills', credits: 2, prerequisites: [], category: 'Foundation', required: true },
  { code: 'FYE 1102', name: 'FYE Seminar II', credits: 1, prerequisites: ['FYE 1101'], category: 'Foundation', required: true },
  { code: 'FAS 1220', name: 'Introduction to Critical Thinking', credits: 2, prerequisites: [], category: 'Foundation', required: true },

  // English Courses
  { code: 'ENG 1301', name: 'English Composition I', credits: 3, prerequisites: [], category: 'English', required: true },
  { code: 'ENG 2303', name: 'Technical Writing', credits: 3, prerequisites: ['ENG 1301'], category: 'English', required: true },
  { code: 'ENG 2320', name: 'Creative Writing', credits: 3, prerequisites: ['ENG 1301'], category: 'English', required: false },

  // Communication
  { code: 'COM 1301', name: 'Public Speaking', credits: 3, prerequisites: [], category: 'Communication', required: true },

  // Arabic Options (2 SCH required)
  { code: 'ARA 1201', name: 'Arabic Language Course', credits: 2, prerequisites: [], category: 'Arabic', required: false },
  { code: 'ARA 1202', name: 'Arabic Language Course', credits: 2, prerequisites: [], category: 'Arabic', required: false },
  { code: 'ARA 1203', name: 'Arabic Language Course', credits: 2, prerequisites: [], category: 'Arabic', required: false },
  { code: 'ARA 3299', name: 'Arabic Language Course', credits: 2, prerequisites: [], category: 'Arabic', required: false },
  { code: 'ARB 1201', name: 'Arabic Language Course', credits: 2, prerequisites: [], category: 'Arabic', required: false },
  { code: 'ARB 1202', name: 'Arabic Language Course', credits: 2, prerequisites: [], category: 'Arabic', required: false },
  { code: 'ARB 1203', name: 'Arabic Language Course', credits: 2, prerequisites: [], category: 'Arabic', required: false },
  { code: 'ARB 1241', name: 'Arabic Language Course', credits: 2, prerequisites: [], category: 'Arabic', required: false },

  // Humanities (3 SCH required)
  { code: 'HUM 2305', name: 'Humanities Course', credits: 3, prerequisites: [], category: 'Humanities', required: false },
  { code: 'HUM 2306', name: 'Humanities Course', credits: 3, prerequisites: [], category: 'Humanities', required: false },
  { code: 'HUM 2307', name: 'Humanities Course', credits: 3, prerequisites: [], category: 'Humanities', required: false },
  { code: 'LIT 2301', name: 'Literature Course', credits: 3, prerequisites: ['ENG 1301'], category: 'Humanities', required: false },
  { code: 'PHI 2301', name: 'Philosophy Course', credits: 3, prerequisites: ['ENG 1301'], category: 'Humanities', required: false },
  { code: 'PHI 2302', name: 'Philosophy Course', credits: 3, prerequisites: ['ENG 1301'], category: 'Humanities', required: false },
  { code: 'HUM 2301', name: 'Islamic Art & Architecture', credits: 3, prerequisites: ['FAS 1220'], category: 'Humanities', required: false },

  // French Language
  { code: 'FRN 3210', name: 'French Language Course', credits: 2, prerequisites: [], category: 'French', required: true },

  // Art Appreciation (3 SCH required)
  { code: 'ART 1301', name: 'Art Course', credits: 3, prerequisites: ['FYE 1101'], category: 'Art', required: false },
  { code: 'ART 1302', name: 'Art Course', credits: 3, prerequisites: ['FYE 1101'], category: 'Art', required: false },
  { code: 'ART 1303', name: 'Art Course', credits: 3, prerequisites: ['FYE 1101'], category: 'Art', required: false },
  { code: 'ART 1304', name: 'Art Course', credits: 3, prerequisites: ['FYE 1101'], category: 'Art', required: false },
  { code: 'ART 1305', name: 'Art Course', credits: 3, prerequisites: ['FYE 1101'], category: 'Art', required: false },
  { code: 'ART 3399', name: 'Art Course', credits: 3, prerequisites: ['FYE 1101'], category: 'Art', required: false },
  { code: 'COM 2327', name: 'Communication Arts', credits: 3, prerequisites: ['FYE 1101'], category: 'Art', required: false },
  { code: 'LIT 3370', name: 'Literature & Arts', credits: 3, prerequisites: ['FYE 1101'], category: 'Art', required: false },

  // History/Political Science (3 SCH required)
  { code: 'HIS 1301', name: 'History Course', credits: 3, prerequisites: [], category: 'History', required: false },
  { code: 'HIS 2301', name: 'History Course', credits: 3, prerequisites: [], category: 'History', required: false },
  { code: 'HUM 1310', name: 'Humanities & History', credits: 3, prerequisites: [], category: 'History', required: false },
  { code: 'HUM 2302', name: 'Humanities & History', credits: 3, prerequisites: [], category: 'History', required: false },
  { code: 'PSC 2301', name: 'History/Political Science', credits: 3, prerequisites: ['ENG 1301'], category: 'History', required: false },

  // Social Sciences
  { code: 'ECO 1300', name: 'Economics Course', credits: 3, prerequisites: [], category: 'Social', required: false },
  { code: 'GEO 1301', name: 'Geography Course', credits: 3, prerequisites: [], category: 'Social', required: false },
  { code: 'PSY 1301', name: 'Psychology Course', credits: 3, prerequisites: [], category: 'Social', required: false },
  { code: 'SOC 1301', name: 'Sociology Course', credits: 3, prerequisites: [], category: 'Social', required: false },
  { code: 'SSC 1310', name: 'Social Science Course', credits: 3, prerequisites: [], category: 'Social', required: false },

  // Civic Engagement
  { code: 'SLP 1101', name: 'Service Learning', credits: 3, prerequisites: [], category: 'Civic', required: true }
];

const GE_CATEGORIES: CourseCategory[] = [
  {
    code: 'FYE_FAS',
    name: 'First Year & Foundation Courses',
    credits: 6,
    description: 'Required foundation courses',
    options: [
      { code: 'FYE 1101', name: 'FYE Seminar I', prerequisites: [] },
      { code: 'FAS 0210', name: 'Strategic Academic Skills', prerequisites: [] },
      { code: 'FYE 1102', name: 'FYE Seminar II', prerequisites: ['FYE 1101'] },
      { code: 'FAS 1220', name: 'Introduction to Critical Thinking', prerequisites: [] }
    ]
  },
  {
    code: 'ENGLISH',
    name: 'English Requirements',
    credits: 6,
    description: 'Required English courses',
    options: [
      { code: 'ENG 1301', name: 'English Composition I', prerequisites: [] },
      { code: 'ENG 2303', name: 'Technical Writing', prerequisites: ['ENG 1301'] },
      { code: 'ENG 2320', name: 'Creative Writing', prerequisites: ['ENG 1301'] }
    ]
  },
  {
    code: 'ARABIC',
    name: 'Arabic Language Requirement',
    credits: 2,
    description: 'Choose from available Arabic courses',
    options: [
      { code: 'ARA 1201', name: 'Arabic Language Course', prerequisites: [] },
      { code: 'ARA 1202', name: 'Arabic Language Course', prerequisites: [] },
      { code: 'ARA 1203', name: 'Arabic Language Course', prerequisites: [] },
      { code: 'ARA 3299', name: 'Arabic Language Course', prerequisites: [] },
      { code: 'ARB 1201', name: 'Arabic Language Course', prerequisites: [] },
      { code: 'ARB 1202', name: 'Arabic Language Course', prerequisites: [] },
      { code: 'ARB 1203', name: 'Arabic Language Course', prerequisites: [] },
      { code: 'ARB 1241', name: 'Arabic Language Course', prerequisites: [] }
    ]
  },
  {
    code: 'COMMUNICATION',
    name: 'Communication',
    credits: 3,
    description: 'Required communication course',
    options: [
      { code: 'COM 1301', name: 'Public Speaking', prerequisites: [] }
    ]
  },
  {
    code: 'HUMANITIES',
    name: 'Humanities',
    credits: 3,
    description: 'Choose from available humanities courses',
    options: [
      { code: 'HUM 2305', name: 'Humanities Course', prerequisites: [] },
      { code: 'HUM 2306', name: 'Humanities Course', prerequisites: [] },
      { code: 'HUM 2307', name: 'Humanities Course', prerequisites: [] },
      { code: 'LIT 2301', name: 'Literature Course', prerequisites: ['ENG 1301'] },
      { code: 'PHI 2301', name: 'Philosophy Course', prerequisites: ['ENG 1301'] },
      { code: 'PHI 2302', name: 'Philosophy Course', prerequisites: ['ENG 1301'] },
      { code: 'HUM 2301', name: 'Islamic Art & Architecture', prerequisites: ['FAS 1220'] }
    ]
  },
  {
    code: 'FRENCH',
    name: 'French Language',
    credits: 2,
    description: 'Required French course',
    options: [
      { code: 'FRN 3210', name: 'French Language Course', prerequisites: [] }
    ]
  },
  {
    code: 'ART',
    name: 'Art Appreciation & Creation',
    credits: 3,
    description: 'Choose from available art courses',
    options: [
      { code: 'ART 1301', name: 'Art Course', prerequisites: ['FYE 1101'] },
      { code: 'ART 1302', name: 'Art Course', prerequisites: ['FYE 1101'] },
      { code: 'ART 1303', name: 'Art Course', prerequisites: ['FYE 1101'] },
      { code: 'ART 1304', name: 'Art Course', prerequisites: ['FYE 1101'] },
      { code: 'ART 1305', name: 'Art Course', prerequisites: ['FYE 1101'] },
      { code: 'ART 3399', name: 'Art Course', prerequisites: ['FYE 1101'] },
      { code: 'COM 2327', name: 'Communication Arts', prerequisites: ['FYE 1101'] },
      { code: 'LIT 3370', name: 'Literature & Arts', prerequisites: ['FYE 1101'] }
    ]
  },
  {
    code: 'HISTORY',
    name: 'History or Political Science',
    credits: 3,
    description: 'Choose from available history/political science courses',
    options: [
      { code: 'HIS 1301', name: 'History Course', prerequisites: [] },
      { code: 'HIS 2301', name: 'History Course', prerequisites: [] },
      { code: 'HUM 1310', name: 'Humanities & History', prerequisites: [] },
      { code: 'HUM 2302', name: 'Humanities & History', prerequisites: [] },
      { code: 'PSC 2301', name: 'History/Political Science', prerequisites: ['ENG 1301'] }
    ]
  },
  {
    code: 'SOCIAL',
    name: 'Social Sciences',
    credits: 3,
    description: 'Choose from available social science courses',
    options: [
      { code: 'ECO 1300', name: 'Economics Course', prerequisites: [] },
      { code: 'GEO 1301', name: 'Geography Course', prerequisites: [] },
      { code: 'PSY 1301', name: 'Psychology Course', prerequisites: [] },
      { code: 'SOC 1301', name: 'Sociology Course', prerequisites: [] },
      { code: 'SSC 1310', name: 'Social Science Course', prerequisites: [] }
    ]
  },
  {
    code: 'CIVIC',
    name: 'Civic Engagement',
    credits: 3,
    description: 'Required civic engagement course',
    options: [
      { code: 'SLP 1101', name: 'Service Learning', prerequisites: [] }
    ]
  }
];

export function generateDegreePlan(
  requirements: MajorRequirements,
  options: DegreePlanOptions
): any[] {
  const {
    includeSummer,
    transferCredits,
    specializations
  } = options;
  let remainingSummerTerms = options.summerTerms;

  // Initialize semester plans
  const semesterPlans: any[] = [];
  let currentSemester = 1;
  let totalCredits = 0;
  const MAX_SEMESTERS = 12;
  const COURSES_PER_REGULAR_SEMESTER = 6;
  const MAX_COURSES_SUMMER = 3;

  // Track taken courses and credits by category
  const takenCourses = new Set<string>();
  const categoryCredits: Record<string, number> = {
    'Foundation': 0,
    'English': 0,
    'Arabic': 0,
    'Communication': 0,
    'Humanities': 0,
    'French': 0,
    'Art': 0,
    'History': 0,
    'Social': 0,
    'Civic': 0
  };

  // Group courses by area with proper credit requirements
  const areas: CourseArea[] = [
    {
      name: 'Technical Core',
      minCredits: 83,
      courses: requirements.courses.filter(c =>
        c.code.startsWith('MTH') ||
        c.code.startsWith('PHY') ||
        c.code.startsWith('CHE') ||
        c.code.startsWith('EGR') ||
        c.code.startsWith('ACC') ||
        c.code.startsWith('FIN') ||
        c.code.startsWith('MGT') ||
        (c.code.startsWith('CSC') && !specializations.some(spec => isSpecializationCourse(c.code, spec)))
      )
    },
    {
      name: 'General Education',
      minCredits: 31,
      courses: GENERAL_EDUCATION_COURSES.map(course => ({
        ...course,
        isPlaceholder: !course.required,
        type: course.required ? 'course' : 'choice'
      }))
    },
    {
      name: 'Specialization',
      minCredits: 12,
      courses: requirements.courses.filter(c =>
        specializations.some(spec => isSpecializationCourse(c.code, spec))
      )
    }
  ];

  // Create prerequisite map
  const prerequisiteMap = new Map<string, Set<string>>();
  areas.forEach(area => {
    area.courses.forEach(course => {
      prerequisiteMap.set(course.code, new Set(course.prerequisites));
    });
  });

  // First semester is fixed
  const firstSemesterCourses = [
    { code: 'ARB 1241', name: 'Arabic Literature', credits: 2, prerequisites: [], semester: 1 },
    { code: 'CSC 1401', name: 'Computer Programming + LAB', credits: 4, prerequisites: [], semester: 1 },
    { code: 'ENG 1301', name: 'English Composition', credits: 3, prerequisites: [], semester: 1 },
    { code: 'FAS 0210', name: 'Strategic Academic Skills', credits: 2, prerequisites: [], semester: 1 },
    { code: 'FYE 1101', name: 'FYE Seminar I', credits: 1, prerequisites: [], semester: 1 },
    { code: 'MTH 1303', name: 'Calculus I', credits: 3, prerequisites: [], semester: 1 }
  ];

  // Add first semester
  semesterPlans.push({
    semester: 1,
    courses: firstSemesterCourses,
    credits: firstSemesterCourses.reduce((sum, course) => sum + course.credits, 0),
    type: 'regular'
  });

  // Update taken courses and credits
  firstSemesterCourses.forEach(course => {
    takenCourses.add(course.code);
    if (course.code.startsWith('FAS') || course.code.startsWith('FYE')) {
      categoryCredits['Foundation'] += course.credits;
    } else if (course.code.startsWith('ENG')) {
      categoryCredits['English'] += course.credits;
    } else if (course.code.startsWith('ARB')) {
      categoryCredits['Arabic'] += course.credits;
    }
  });

  totalCredits += firstSemesterCourses.reduce((sum, course) => sum + course.credits, 0);
  currentSemester++;

  // Remove first semester courses from areas
  const firstSemesterCodes = new Set(firstSemesterCourses.map(c => c.code));
  areas.forEach(area => {
    area.courses = area.courses.filter(course => !firstSemesterCodes.has(course.code));
  });

  // Helper function to check prerequisites
  const arePrerequisitesMet = (course: Course): boolean => {
    const prerequisites = prerequisiteMap.get(course.code);
    if (!prerequisites || prerequisites.size === 0) return true;
    return Array.from(prerequisites).every(prereq => takenCourses.has(prereq));
  };

  // Add back the isSpecializationCourse function
  function isSpecializationCourse(code: string, track: string): boolean {
    const trackCourses: Record<string, string[]> = {
      'ai': ['CSC3309', 'CSC3347', 'CSC3310', 'CSC3311'],
      'bigdata': ['CSC3331', 'CSC4352', 'CSC3329', 'CSC3346'],
      'systems': ['CSC3373', 'CSC3328', 'CSC3329', 'CSC3331'],
      'software': ['CSC4307', 'CSC4309', 'CSC3357', 'CSC3358']
    };
    return trackCourses[track]?.includes(code.replace(/\s/g, '')) || false;
  }

  // Helper function to get available general education courses
  const getAvailableGenEdCourses = (maxCourses: number): Course[] => {
    const availableCourses: Course[] = [];
    const categories = Object.keys(categoryCredits);

    // Prioritize required courses first
    const requiredCourses = areas[1].courses
      .filter(c => c.required && !takenCourses.has(c.code) && arePrerequisitesMet(c))
      .sort((a, b) => {
        // Prioritize foundation courses early
        if (a.category === 'Foundation' && b.category !== 'Foundation') return -1;
        if (b.category === 'Foundation' && a.category !== 'Foundation') return 1;
        return 0;
      });

    availableCourses.push(...requiredCourses.slice(0, maxCourses));

    // If we still have room, add elective courses
    if (availableCourses.length < maxCourses) {
      const remainingSlots = maxCourses - availableCourses.length;
      const electiveCourses = areas[1].courses
        .filter(c =>
          !c.required &&
          !takenCourses.has(c.code) &&
          arePrerequisitesMet(c) &&
          categoryCredits[c.category] < GE_CATEGORIES.find(cat => cat.name === c.category)?.credits
        )
        .slice(0, remainingSlots);

      availableCourses.push(...electiveCourses);
    }

    return availableCourses;
  };

  // Generate remaining semesters
  while (currentSemester <= MAX_SEMESTERS && totalCredits < requirements.totalCredits) {
    const isSummer = currentSemester % 3 === 0;
    const semesterCourses: Course[] = [];

    if (!isSummer) {
      // Regular semester: 3 technical + 3 general education
      const technicalCourses = [...areas[0].courses, ...areas[2].courses]
        .filter(c => !takenCourses.has(c.code) && arePrerequisitesMet(c))
        .slice(0, 3);

      const genEdCourses = getAvailableGenEdCourses(3);

      semesterCourses.push(...technicalCourses, ...genEdCourses);
    } else if (includeSummer && remainingSummerTerms > 0) {
      // Summer: Lighter load, prioritize general education
      const genEdCourses = getAvailableGenEdCourses(2);
      const lightTechnicalCourses = areas[0].courses
        .filter(c =>
          !takenCourses.has(c.code) &&
          arePrerequisitesMet(c) &&
          c.credits <= 3 &&
          !c.code.startsWith('CSC')
        )
        .slice(0, 1);

      semesterCourses.push(...genEdCourses, ...lightTechnicalCourses);
      remainingSummerTerms--;
    }

    if (semesterCourses.length > 0) {
      // Update taken courses and credits
      semesterCourses.forEach(course => {
        takenCourses.add(course.code);
        if (course.category) {
          categoryCredits[course.category] += course.credits;
        }
      });

      const semesterCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0);
      semesterPlans.push({
        semester: currentSemester,
        courses: semesterCourses,
        credits: semesterCredits,
        type: isSummer ? 'summer' : 'regular'
      });
      totalCredits += semesterCredits;
    }

    currentSemester++;
  }

  return semesterPlans;
}
