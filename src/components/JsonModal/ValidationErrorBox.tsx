import React from 'react';

interface ValidationErrorBoxProps {
  errors: string[];
}

export const ValidationErrorBox: React.FC<ValidationErrorBoxProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="comic-error-box">
      <h3 className="font-bold font-comic-title text-2xl tracking-wide mb-1 uppercase">
        Validation Error:
      </h3>
      <ul className="list-disc pl-5 text-sm font-bold font-comic-label space-y-1">
        {errors.map((err, idx) => (
          <li key={idx}>{err}</li>
        ))}
      </ul>
    </div>
  );
};
