import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ModalBackdrop from './ModalBackdrop';
import ModalContainer from './ModalContainer';
import ModalHeader from './ModalHeader';
import ModalSearch from './ModalSearch';
import ModalContent from './ModalContent';
import CourseCard from './CourseCard';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  semester: string;
  courses: any[];
  addCourse: (semester: string, course: any) => void;
}

export default function AddCourseModal({
  isOpen,
  onClose,
  semester,
  courses,
  addCourse,
}: AddCourseModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredCourses = courses.filter((course) =>
    (course.course_code + course.course_name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course.course_code);
    setTimeout(() => {
      addCourse(semester, course);
      onClose();
    }, 300);
  };

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[999999] isolate">
          <ModalBackdrop onClose={onClose} />
          <ModalContainer>
            <ModalHeader semester={semester} />
            <ModalSearch
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ModalContent>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.course_code}
                  course={course}
                  isSelected={selectedCourse === course.course_code}
                  onSelect={() => handleCourseSelect(course)}
                />
              ))}
            </ModalContent>
          </ModalContainer>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.getElementById('modal-root') || document.body);
}
