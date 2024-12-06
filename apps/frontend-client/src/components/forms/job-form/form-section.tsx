import { ReactNode } from 'react';

interface FormSectionProps {
  children: ReactNode;
  columns?: number;
}

export function FormSection({ children, columns = 2 }: FormSectionProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-6`}>{children}</div>
  );
}