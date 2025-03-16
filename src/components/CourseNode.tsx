return (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`relative z-20 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border ${
      type === 'summer' ? 'border-amber-200/50' : 'border-emerald-200/50'
    } hover:shadow-xl transition-all duration-300`}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className={`font-semibold text-lg ${
          type === 'summer' ? 'text-amber-900' : 'text-emerald-900'
        }`}>
          {course.course_code}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{course.course_name}</p>
        <div className="flex items-center mt-2 space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            type === 'summer'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            {course.credits} Credits
          </span>
          {/* Prerequisites tooltip */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="relative group">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-help ${
                type === 'summer'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                Prerequisites
              </span>
              <div className="absolute left-0 w-48 p-3 mt-2 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-30">
                <p className="text-xs text-gray-600">
                  {course.prerequisites.map(p =>
                    Array.isArray(p) ? p.map(x => x.value).join(' OR ') : p.value
                  ).join(' AND ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className={`text-red-500 hover:text-red-700 w-8 h-8 rounded-full hover:bg-red-50 transition-colors duration-200 flex items-center justify-center`}
      >
        ×
      </button>
    </div>
  </motion.div>
);
