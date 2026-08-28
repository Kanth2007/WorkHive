import React from 'react';

export const BottomTabBar = ({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <nav className={`ss-bottom-nav ${className}`.trim()} aria-label="Bottom Navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            className={`ss-nav-tab ${isActive ? 'active' : ''}`}
            onClick={() => onChange && onChange(tab.id)}
            aria-selected={isActive}
          >
            <div className="ss-nav-tab-icon">
              {Icon && <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomTabBar;
