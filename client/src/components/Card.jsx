import React from 'react';

export const Card = ({
  children,
  header,
  footer,
  padding = 'default',
  interactive = false,
  onClick,
  className = '',
  ...props
}) => {
  const paddingClass = padding === 'none' 
    ? 'ss-card-padding-none' 
    : padding === 'sm' 
      ? 'ss-card-padding-sm' 
      : padding === 'lg' 
        ? 'ss-card-padding-lg' 
        : '';
  const interactiveClass = interactive ? 'ss-card-interactive' : '';

  return (
    <div
      className={`ss-card ${paddingClass} ${interactiveClass} ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {header && <div className="ss-card-header">{header}</div>}
      <div className="ss-card-body">{children}</div>
      {footer && <div className="ss-card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
