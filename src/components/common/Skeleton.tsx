import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animate = true,
  ...props
}) => {
  const baseStyles = 'bg-slate-200 dark:bg-slate-800';
  const animationStyle = animate ? 'animate-pulse' : '';

  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl h-48 w-full',
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
    ...props.style,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyle} ${className}`}
      style={style}
      {...props}
    />
  );
};
