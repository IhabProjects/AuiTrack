Instructions for Building the Degree Planning Web App with Next.js
This document provides a detailed guide for building a web application using Next.js to help students at Akhwayn University create their degree plans. The app will allow students to input their major, minor, and preferences, and generate a downloadable .doc file of their degree plan. The Flowcharts_By_Major folder (PDF files) will be used to understand prerequisites and course requirements.

Technology Stack
Frontend
Framework: Next.js (for server-side rendering, API routes, and static generation)

UI Library: Tailwind CSS (for responsive and pre-styled components)

State Management: React Context API or Zustand (lightweight state management)

Routing: Next.js file-based routing

Backend
Framework: Next.js API Routes (for backend logic)

PDF Parsing: Use pdf-lib or pdf-parse to extract data from the Flowcharts_By_Major PDFs.

DOCX Generation: Use the docx library to generate the .doc file based on the provided template.

Database: Optional (e.g., MongoDB for saving user data and preferences)

Hosting and Deployment
Platform: Vercel (optimized for Next.js apps)

Database: MongoDB Atlas (if using a database)

Core Features
1. User Input
Dropdown or searchable list for selecting a major.

Optional dropdown for selecting a minor.

Toggle for including/excluding summer courses.

Input for transfer credits or waived courses.

2. PDF Parsing
Extract prerequisite and course data from the Flowcharts_By_Major PDFs.

Map courses to semesters based on prerequisites and user preferences.

3. Roadmap Generation
Generate a semester-by-semester plan based on:

Major requirements (from PDFs).

Minor requirements (if selected).

Student preferences (e.g., summer courses).

Prerequisite rules.

4. DOCX Export
Use the provided Degree Plan Template to generate a .doc file.

Populate the template with:

Student information (name, ID, major, etc.).

Yearly course breakdown (semester-wise).

Additional components (electives, minor courses, internships, etc.).

Graduation requirements.

5. Download Button
Provide a button to download the generated .doc file.

Project Structure
Here’s the proposed folder structure for the Next.js app:

Copy
/degree-plan-app
├── /public
│   ├── /flowcharts (PDF files for each major)
│   └── /templates (Degree Plan Template.docx)
├── /src
│   ├── /components (Reusable UI components)
│   ├── /context (React Context for state management)
│   ├── /pages
│   │   ├── /api (Next.js API routes)
│   │   ├── index.js (Home page)
│   │   └── plan.js (Degree plan generation page)
│   ├── /styles (Tailwind CSS or custom styles)
│   └── /utils (Helper functions, e.g., PDF parsing, DOCX generation)
├── next.config.js (Next.js configuration)
├── package.json
└── tailwind.config.js (Tailwind CSS configuration)
Development Plan
Phase 1: Setup and Planning
Initialize Next.js Project:

bash
Copy
npx create-next-app degree-plan-app
cd degree-plan-app
Install Dependencies:

bash
Copy
npm install tailwindcss pdf-lib docx
Configure Tailwind CSS:

Follow the Tailwind CSS installation guide for Next.js.

Add PDFs and Templates:

Place the Flowcharts_By_Major PDFs in /public/flowcharts.

Place the Degree Plan Template.docx in /public/templates.
