import React from 'react';
import { Users } from 'lucide-react';

export const Sidebar = ({
  brandName = 'Sahakari Seva',
  brandSub = 'Cooperative Admin Portal',
  navItems = [],
  activeItem,
  onSelect,
  footerContent,
  className = ''
}) => {
  return (
    <aside className={`ss-sidebar ${className}`.trim()}>
      <div className="ss-sidebar-brand">
        <div className="ss-brand-logo-mark">
          <Users size={22} strokeWidth={2.4} />
        </div>
        <div>
          <div className="ss-brand-title">{brandName}</div>
          <div className="ss-brand-sub">{brandSub}</div>
        </div>
      </div>

      <nav className="ss-sidebar-nav">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`ss-sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onSelect && onSelect(item.id)}
            >
              {Icon && (
                <span className="ss-sidebar-icon">
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                </span>
              )}
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: isActive ? 'var(--color-accent)' : 'var(--color-bg)',
                  color: isActive ? 'var(--color-white)' : 'var(--color-black)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="ss-sidebar-footer">
        {footerContent || (
          <div>
            <div className="text-medium">Ward 4 Cooperative Society</div>
            <div className="text-secondary" style={{ fontSize: '12px' }}>Reg. #MH-PUN-2024-889</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
