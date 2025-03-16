import { Course, MajorRequirements } from '@/lib/pdfParser';

export const csMajorData: MajorRequirements = {
  name: "Computer Science",
  code: "CS",
  school: "CSC-based Academic Programs",
  totalCredits: 134,
  courses: [
    // First Semester (Fixed)
    {
      code: 'ARA 1301',
      name: 'Arabic Language I',
      credits: 3,
      prerequisites: [],
      semester: 1,
    },
    {
      code: 'MTH 1303',
      name: 'Calculus I',
      credits: 3,
      prerequisites: [],
      semester: 1,
    },
    {
      code: 'CSC 1401',
      name: 'Introduction to Programming',
      credits: 3,
      prerequisites: [],
      semester: 1,
    },
    {
      code: 'FAS 1301',
      name: 'Freshman Arabic Seminar',
      credits: 1,
      prerequisites: [],
      semester: 1,
    },
    {
      code: 'FYE 1301',
      name: 'First Year Experience',
      credits: 1,
      prerequisites: [],
      semester: 1,
    },
    // Mathematics Requirements (15 SCH)
    {
      code: "MTH 1304",
      name: "Discrete Mathematics",
      credits: 3,
      prerequisites: ["MTH 1303"],
      semester: 2
    },
    {
      code: "MTH 2301",
      name: "Calculus II: Multivariable Calculus",
      credits: 3,
      prerequisites: ["MTH 1303"],
      semester: 3
    },
    {
      code: "MTH 2320",
      name: "Linear Algebra",
      credits: 3,
      prerequisites: ["MTH 1303"],
      semester: 3
    },
    {
      code: "MTH 3301",
      name: "Probability and Statistics for Engineers",
      credits: 3,
      prerequisites: ["MTH 2301", "MTH 2320"],
      semester: 4
    },

    // Sciences and Engineering Requirements (15 SCH)
    {
      code: "PHY 1401",
      name: "Physics I",
      credits: 3,
      prerequisites: ["MTH 1303"],
      semester: 2
    },
    {
      code: "PHY 1402",
      name: "Physics II",
      credits: 3,
      prerequisites: ["PHY 1401"],
      semester: 3
    },
    {
      code: "EGR 2302",
      name: "Engineering Economics",
      credits: 3,
      prerequisites: ["MTH 1303"],
      semester: 4
    },

    // Computer Science Core (53 SCH)
    {
      code: "CSC 2302",
      name: "Data Structures",
      credits: 3,
      prerequisites: ["CSC 1401"],
      semester: 3
    },
    {
      code: "CSC 2306",
      name: "Object Oriented Programming",
      credits: 3,
      prerequisites: ["CSC 1401", "CSC 2302"],
      semester: 4
    },
    {
      code: "CSC 2305",
      name: "Computer Organization and Architecture",
      credits: 3,
      prerequisites: ["CSC 1401"],
      semester: 4
    },
    {
      code: "CSC 3315",
      name: "Languages and Compilers",
      credits: 3,
      prerequisites: ["CSC 2302", "CSC 2305"],
      semester: 5
    },
    {
      code: "CSC 3351",
      name: "Operating Systems",
      credits: 3,
      prerequisites: ["CSC 2302", "CSC 2306"],
      semester: 6
    },
    {
      code: "CSC 3374",
      name: "Advanced and Distributed Programming Paradigms",
      credits: 3,
      prerequisites: ["CSC 2306"],
      semester: 6
    },
    {
      code: "CSC 3323",
      name: "Analysis of Algorithms",
      credits: 3,
      prerequisites: ["CSC 2302", "MTH 1304"],
      semester: 5
    },
    {
      code: "CSC 3324",
      name: "Software Engineering",
      credits: 3,
      prerequisites: ["CSC 2306"],
      semester: 5
    },
    {
      code: "CSC 3371",
      name: "Computer Communications and Networks",
      credits: 3,
      prerequisites: ["CSC 2305"],
      semester: 6
    },
    {
      code: "CSC 3326",
      name: "Database Systems",
      credits: 3,
      prerequisites: ["CSC 2302"],
      semester: 6
    },
    {
      code: "EGR 4402",
      name: "Capstone Design",
      credits: 4,
      prerequisites: ["CSC 3324", "CSC 3351", "CSC 3371"],
      semester: 8
    },

    // Specialization Tracks (9 SCH)
    // AI Track
    {
      code: "CSC 3309",
      name: "Introduction to Artificial Intelligence",
      credits: 3,
      prerequisites: ["CSC 2306", "CSC 3323", "MTH 3301", "CSC 3371"],
      semester: 7
    },
    {
      code: "CSC 3347",
      name: "Machine Learning and Data Mining",
      credits: 3,
      prerequisites: ["CSC 3309"],
      semester: 7
    },
    {
      code: "CSC 3310",
      name: "Artificial Neural Networks",
      credits: 3,
      prerequisites: ["CSC 3309"],
      semester: 8
    },

    // Big Data Track
    {
      code: "CSC 3331",
      name: "Introduction to Big Data Environment and Applications",
      credits: 3,
      prerequisites: ["CSC 3326"],
      semester: 7
    },
    {
      code: "CSC 4352",
      name: "Big Data Analytics",
      credits: 3,
      prerequisites: ["CSC 3331"],
      semester: 7
    },
    {
      code: "CSC 3329",
      name: "IoT & Big Data Streaming",
      credits: 3,
      prerequisites: ["CSC 3331"],
      semester: 8
    },

    // Software Engineering Track
    {
      code: "CSC 4307",
      name: "Agile Software Engineering and DevOps",
      credits: 3,
      prerequisites: ["CSC 3326", "CSC 3351"],
      semester: 7
    },
    {
      code: "CSC 4309",
      name: "Enterprise Cloud and Mobile Applications",
      credits: 3,
      prerequisites: ["CSC 4307"],
      semester: 7
    },
    {
      code: "CSC 3357",
      name: "Object-oriented Design",
      credits: 3,
      prerequisites: ["CSC 2306"],
      semester: 8
    }
  ]
};
