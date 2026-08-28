import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  showDot = true,
  className = '',
  ...props
}) => {
  const variantClass = `ss-badge-${variant}`;

  return (
    <span className={`ss-badge ${variantClass} ${className}`.trim()} {...props}>
      {showDot && <span className="ss-badge-dot" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
