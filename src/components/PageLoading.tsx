import type { FC, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PageLoadingProps {
  message?: string;
  subtitle?: string;
  className?: string;
  messageClassName?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

const PageLoading: FC<PageLoadingProps> = ({
  message,
  subtitle,
  className = '',
  messageClassName = '',
  spinnerSize = 'lg',
  children,
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="text-center">
      {children ?? <LoadingSpinner size={spinnerSize} className="mb-4" />}
      {message && <div className={`text-xl ${messageClassName}`}>{message}</div>}
      {subtitle && <p className="text-sm mt-2 opacity-60">{subtitle}</p>}
    </div>
  </div>
);

export default PageLoading;
