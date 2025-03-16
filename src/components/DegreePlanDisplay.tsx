'use client';

import { useDegreePlanStore } from '@/lib/store';
import { csMajorData } from '@/data/csMajor';

export default function DegreePlanDisplay() {
  const {
    selectedMajor,
    selectedMinor,
    includeSummer,
    transferCredits,
    majorRequirements,
    minorRequirements,
  } = useDegreePlanStore();

  if (!majorRequirements) {
    return (
      <div className="text-center text-gray-500 py-8">
        Select a specialization track to view your degree plan
      </div>
    );
  }

  // Group courses by semester
  const coursesBySemester = majorRequirements.courses.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {} as Record<number, typeof majorRequirements.courses>);

  // Calculate total credits
  const totalCredits = majorRequirements.courses.reduce((sum, course) => sum + course.credits, 0);
  const transferCreditsTotal = transferCredits.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {majorRequirements.name} Degree Plan
        </h2>
        <div className="text-sm text-gray-600">
          <p>Total Credits Required: {majorRequirements.totalCredits} SCH</p>
          <p>Transfer Credits Applied: {transferCreditsTotal} SCH</p>
          <p>Remaining Credits: {majorRequirements.totalCredits - transferCreditsTotal} SCH</p>
        </div>
      </div>

      {/* Course Sequence */}
      <div className="space-y-4">
        {Object.entries(coursesBySemester)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([semester, courses]) => (
            <div key={semester} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Semester {semester}
              </h3>
              <div className="space-y-4">
                {courses.map((course) => {
                  const isTransferCredit = transferCredits.some(
                    (tc) => tc.code === course.code
                  );
                  return (
                    <div
                      key={course.code}
                      className={`p-4 rounded-lg border ${
                        isTransferCredit
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {course.code} - {course.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Credits: {course.credits} SCH
                          </p>
                          {course.prerequisites.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              Prerequisites: {course.prerequisites.join(', ')}
                            </p>
                          )}
                        </div>
                        {isTransferCredit && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Transfer Credit
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {/* Specialization Info */}
      {selectedMajor === 'CS' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Specialization Track Information
          </h3>
          <div className="prose prose-sm">
            <p>
              Your degree plan includes specialized courses in your chosen track. These courses
              are designed to provide in-depth knowledge and practical skills in your area of
              interest.
            </p>
            <p className="mt-2">
              Make sure to complete all prerequisites before enrolling in specialization courses.
              Some courses may require junior standing or completion of core CS courses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
