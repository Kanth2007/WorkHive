import React from 'react';

export const LoadingState = ({
  text = 'Loading details, please wait a moment...',
  className = ''
}) => {
  return (
    <div className={`ss-loading-state ${className}`.trim()} aria-live="polite" aria-busy="true">
      <div className="ss-spinner" />
      <p className="ss-loading-text">{text}</p>
    </div>
  );
};

export default LoadingState;
