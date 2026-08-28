import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const TopBar = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  actions,
  className = ''
}) => {
  return (
    <header className={`ss-topbar ${className}`.trim()}>
      <div className="ss-topbar-left">
        {showBack && (
          <button
            type="button"
            className="ss-topbar-back-btn"
            onClick={onBack}
            aria-label="Go Back"
          >
            <ArrowLeft size={20} strokeWidth={2.2} />
          </button>
        )}
        <div>
          <h1 className="ss-topbar-title">{title}</h1>
          {subtitle && <p className="ss-topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="ss-topbar-actions">{actions}</div>}
    </header>
  );
};

export default TopBar;
