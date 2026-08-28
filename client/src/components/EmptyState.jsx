import React from 'react';
import { PackageOpen, Plus } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items to show yet',
  description = 'When you book a service or receive new requests, they will appear here.',
  actionText,
  onAction,
  actionIcon: ActionIcon = Plus,
  className = ''
}) => {
  return (
    <div className={`ss-empty-state ${className}`.trim()}>
      <div className="ss-empty-icon-wrap">
        <Icon size={32} strokeWidth={1.8} />
      </div>
      <h3 className="ss-empty-title">{title}</h3>
      <p className="ss-empty-desc">{description}</p>
      {actionText && onAction && (
        <Button
          variant="primary"
          icon={ActionIcon}
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
