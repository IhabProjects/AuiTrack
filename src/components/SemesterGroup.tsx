return (
  <div className="relative group semester-card">
    {/* Background effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />

    <div className="base-card">
      {/* Semester header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gradient">{semester}</h3>
            <div className="flex items-center mt-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary/90 border border-primary/20">
                {plan?.credits || 0} / {type === 'summer' ? 6 : 18} Credits
              </span>
            </div>
          </div>
          <button
            onClick={onAddCourse}
            className="btn-primary interactive-hover"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Course</span>
            </div>
          </button>
        </div>
      </div>

      {/* Courses list */}
      <div className="p-6 space-y-4">
        <AnimatePresence>
          {plan?.courses.map((course) => (
            <CourseNode
              key={course.course_code}
              course={course}
              onRemove={() => removeCourse(semester, course.course_code)}
              type={type}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
