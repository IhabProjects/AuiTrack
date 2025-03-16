import { ReactNode } from 'react';

interface ModalContentProps {
  children: ReactNode;
}

export default function ModalContent({ children }: ModalContentProps) {
  return (
    <div className="relative">
      {/* Top fade effect */}
      <div
        className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent)',
        }}
      />

      {/* Content area */}
      <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      </div>

      {/* Bottom fade effect */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent)',
        }}
      />
    </div>
  );
}
