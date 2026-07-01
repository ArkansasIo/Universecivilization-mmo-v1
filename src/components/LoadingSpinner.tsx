import type { FC } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap: Record<string, string> = {
  sm: 'h-8 w-8 border-2',
  md: 'h-12 w-12 border-[3px]',
  lg: 'h-16 w-16 border-4',
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'lg', className = '' }) => (
  <div
    className={`inline-block rounded-full border-current border-t-transparent animate-spin ${sizeMap[size]} ${className}`}
    role="status"
    aria-label="loading"
  />
);

export default LoadingSpinner;
