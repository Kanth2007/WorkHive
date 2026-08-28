import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  size = 'default',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const variantClass = `ss-button-${variant}`;
  const sizeClass = size === 'large' ? 'ss-button-large' : size === 'small' ? 'ss-button-small' : '';
  const fullWidthClass = fullWidth ? 'ss-button-full' : '';

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return <span className="ss-button-icon">{Icon}</span>;
    }
    const IconComponent = Icon;
    return (
      <span className="ss-button-icon">
        <IconComponent size={20} strokeWidth={2.2} />
      </span>
    );
  };

  return (
    <button
      type={type}
      className={`ss-button ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children && <span>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;
