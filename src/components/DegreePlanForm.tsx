'use client';

import { useState } from 'react';
import { useDegreePlanStore } from '@/lib/store';
import { csMajorData } from '@/data/csMajor';

export default function DegreePlanForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const {
    selectedMajor,
    selectedMinor,
    includeSummer,
    transferCredits,
    setSelectedMajor,
    setSelectedMinor,
    setIncludeSummer,
    setTransferCredits,
    setMajorRequirements,
    setMinorRequirements,
  } = useDegreePlanStore();

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setSelectedMajor('CS');
    setMajorRequirements(csMajorData);
  };

  const handleTransferCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const credits = e.target.value.split(',').map(code => code.trim()).filter(Boolean);
    setTransferCredits(credits.map(code => ({
      code,
      name: `Transfer Credit: ${code}`,
      credits: 3, // Default credit value
      prerequisites: [],
      semester: 0,
    })));
  };

  return (
    <div className="space-y-6">
      {/* CS Major Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Computer Science Major
        </label>
        <div className="text-sm text-gray-600 mb-4">
          Total Credits Required: {csMajorData.totalCredits} SCH
        </div>
      </div>

      {/* Specialization Selection */}
      <div>
        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Specialization Track
        </label>
        <select
          id="specialization"
          value={selectedSpecialization || ''}
          onChange={(e) => handleSpecializationChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={loading}
        >
          <option value="">Select a specialization...</option>
          <option value="ai">Artificial Intelligence</option>
          <option value="bigdata">Big Data Analytics</option>
          <option value="software">Software Engineering</option>
          <option value="systems">Computer Systems</option>
        </select>
      </div>

      {/* Summer Courses Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Include Summer Courses
          </label>
          <p className="text-sm text-gray-500">
            Add summer courses to your degree plan
          </p>
        </div>
        <button
          onClick={() => setIncludeSummer(!includeSummer)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            includeSummer ? 'bg-green-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              includeSummer ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Transfer Credits */}
      <div>
        <label htmlFor="transferCredits" className="block text-sm font-medium text-gray-700 mb-2">
          Transfer Credits
        </label>
        <input
          type="text"
          id="transferCredits"
          value={transferCredits.map(c => c.code).join(', ')}
          onChange={handleTransferCreditsChange}
          placeholder="Enter course codes (comma-separated)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the course codes of your transfer credits
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center text-green-600">
          <svg
            className="animate-spin h-5 w-5 mr-3"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading requirements...
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
