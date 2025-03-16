/**
 * PDF Parser and Document Generation Utilities
 *
 * This file provides functionality for:
 * - Parsing imported degree plan documents
 * - Generating exportable degree plan documents
 * - Defining the course and prerequisite data structures
 * - Converting between different data formats
 *
 * It handles the import and export functionality of the application,
 * allowing users to save their degree plans and import them later.
 */

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export interface PrerequisiteCourse {
  type: 'course';
  value: string;
}

export interface Course {
  course_code: string;
  course_name: string;
  credits: number;
  prerequisites: (PrerequisiteCourse[] | PrerequisiteCourse)[];
  corequisites: string[];
  sections: Array<{
    instructor: string;
    schedule: string;
  }>;
}

export interface MajorRequirements {
  name: string;
  code: string;
  school: string;
  totalCredits: number;
  courses: Course[];
}

export interface School {
  name: string;
  majors: {
    name: string;
    code: string;
  }[];
}

function parseFileName(fileName: string): { name: string; code: string } {
  // Remove .pdf extension and split by underscore
  const parts = fileName.replace('.pdf', '').split('_');
  const code = parts[0];
  const name = parts.slice(1).join(' '); // Join the rest with spaces
  return { name, code };
}

export async function getSchools(): Promise<School[]> {
  const basePath = path.join(process.cwd(), 'public', 'flowcharts', 'Flowsharts_By_major');
  const schools = fs.readdirSync(basePath);

  return schools.map(school => {
    const schoolPath = path.join(basePath, school);
    const files = fs.readdirSync(schoolPath)
      .filter(file => file.endsWith('.pdf'));

    const majors = files.map(file => parseFileName(file));

    return {
      name: school,
      majors
    };
  });
}

export async function parseMajorPDF(schoolName: string, majorCode: string): Promise<MajorRequirements> {
  try {
    // Find the PDF file that starts with the major code
    const schoolPath = path.join(
      process.cwd(),
      'public',
      'flowcharts',
      'Flowsharts_By_major',
      schoolName
    );

    const files = fs.readdirSync(schoolPath);
    const majorFile = files.find(file => file.startsWith(majorCode + '_'));

    if (!majorFile) {
      throw new Error(`No PDF file found for major code ${majorCode}`);
    }

    const pdfPath = path.join(schoolPath, majorFile);
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const courses: Course[] = [];
    let totalCredits = 0;

    // Extract text from each page
    for (const page of pages) {
      const { width, height } = page.getSize();
      const textContent = await page.getTextContent();

      // Parse the text content to extract course information
      const lines = textContent.split('\n');
      for (const line of lines) {
        // Example pattern: "CS 101 Introduction to Programming (3)"
        const courseMatch = line.match(/([A-Z]{2,4}\s+\d{3})\s+(.+?)\s+\((\d+)\)/);
        if (courseMatch) {
          const [_, code, name, credits] = courseMatch;
          courses.push({
            course_code: code,
            course_name: name,
            credits: parseInt(credits),
            prerequisites: [], // You'll need to parse prerequisites from the PDF
            corequisites: [], // You'll need to parse corequisites from the PDF
            sections: [], // You'll need to parse sections from the PDF
          });
          totalCredits += parseInt(credits);
        }
      }
    }

    const { name } = parseFileName(majorFile);

    return {
      name,
      code: majorCode,
      school: schoolName,
      totalCredits,
      courses,
    };
  } catch (error) {
    console.error(`Error parsing PDF for ${schoolName}/${majorCode}:`, error);
    throw new Error(`Failed to parse major requirements for ${majorCode}`);
  }
}

export async function getAvailableMajors(): Promise<string[]> {
  const flowchartsDir = path.join(process.cwd(), 'public', 'flowcharts');
  const files = fs.readdirSync(flowchartsDir);
  return files
    .filter(file => file.endsWith('.pdf'))
    .map(file => file.replace('.pdf', ''));
}
