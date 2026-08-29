import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ShieldCheck, Radio, CheckCircle2, User, Eye, Lock } from 'lucide-react';

export const TrackingMap = ({
  workerName = 'Ravi Kumar',
  workerCategory = 'Plumbing',
  statusIndex = 1, // 0: Confirmed, 1: On the way, 2: Arrived, 3: Working, 4: Completed
  isSharingLocation = true,
  customerZone = 'Kasturba Nagar (Adyar)'
}) => {
  // Motion interpolation progress along path (0 to 1)
  const [progress, setProgress] = useState(0.2);

  useEffect(() => {
    // Only animate moving dot while status is 'On the way' (statusIndex === 1) and sharing is active
    if (statusIndex === 1 && isSharingLocation) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 0.95) return 0.15; // Loop for smooth simulated GPS transit
          return prev + 0.035;
        });
      }, 400);
      return () => clearInterval(interval);
    } else if (statusIndex >= 2) {
      // Once arrived or beyond, freeze dot at destination
      setProgress(1.0);
    } else {
      setProgress(0.1);
    }
  }, [statusIndex, isSharingLocation]);

  // Quadratic Bezier Curve Path from Origin (Adyar Depot: x=70, y=140) to Destination (Customer: x=340, y=70)
  // Control point: x=190, y=30
  const p0 = { x: 60, y: 130 };
  const p1 = { x: 190, y: 35 };
  const p2 = { x: 330, y: 75 };

  // Calculate current coordinates (x, y) along bezier curve
  const t = Math.min(Math.max(progress, 0), 1);
  const currentX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const currentY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  const isArrivedOrPast = statusIndex >= 2;

  return (
    <div style={{
      border: '1.5px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'white'
    }}>
      
      {/* 1. TOP LIVE SHARING STATUS BANNER WITH TRANSPARENT PRIVACY LABEL */}
      <div style={{
        background: isSharingLocation && !isArrivedOrPast ? '#F0FDF4' : 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isSharingLocation && !isArrivedOrPast ? (
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#00E676',
              boxShadow: '0 0 0 3px rgba(0, 230, 118, 0.3)',
              display: 'inline-block'
            }} />
          ) : (
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--color-text-secondary)',
              display: 'inline-block'
            }} />
          )}

          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: isSharingLocation && !isArrivedOrPast ? '#15803D' : 'var(--color-black)'
            }}>
              {isArrivedOrPast
                ? `${workerName} has arrived at destination`
                : isSharingLocation
                ? `${workerName} is sharing live location`
                : `${workerName} is preparing to depart`}
            </div>
            {/* Transparent Privacy Note */}
            <div className="text-secondary" style={{ fontSize: '11px', marginTop: 1 }}>
              {isArrivedOrPast
                ? '🔒 Location sharing ended automatically upon arrival'
                : isSharingLocation
                ? '🔒 Sharing live GPS en route • Stops automatically upon arrival'
                : 'GPS sharing activates when helper departs depot'}
            </div>
          </div>
        </div>

        {/* Filtered Category Badge (Ensuring only relevant category workers are scoped) */}
        <span style={{
          fontSize: '11px',
          fontWeight: 'bold',
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-black)'
        }}>
          {workerCategory} Dispatch
        </span>
      </div>

      {/* 2. REALISTIC GEOSPATIAL VECTOR MAP CANVAS */}
      <div style={{ position: 'relative', height: '220px', background: '#F8FAFC', overflow: 'hidden' }}>
        <svg
          viewBox="0 0 400 220"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Map Grid Roads */}
          <line x1="0" y1="60" x2="400" y2="60" stroke="#E2E8F0" strokeWidth="8" />
          <line x1="0" y1="150" x2="400" y2="150" stroke="#E2E8F0" strokeWidth="8" />
          <line x1="90" y1="0" x2="90" y2="220" stroke="#E2E8F0" strokeWidth="8" />
          <line x1="220" y1="0" x2="220" y2="220" stroke="#E2E8F0" strokeWidth="8" />
          <line x1="310" y1="0" x2="310" y2="220" stroke="#E2E8F0" strokeWidth="8" />

          {/* Adyar Canal Waterway */}
          <path d="M 0 190 Q 200 175 400 195 L 400 220 L 0 220 Z" fill="#E0F2FE" />
          <text x="180" y="208" fill="#0284C7" fontSize="9" fontWeight="600" opacity="0.8">
            Adyar Canal
          </text>

          {/* Locality Text Labels */}
          <text x="30" y="45" fill="#94A3B8" fontSize="10" fontWeight="bold">WARD 4 DEPOT</text>
          <text x="250" y="35" fill="#94A3B8" fontSize="10" fontWeight="bold">KASTURBA NAGAR</text>

          {/* Dynamic Transit Route Curve */}
          <path
            d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3.5"
            strokeDasharray={isArrivedOrPast ? 'none' : '6 4'}
          />

          {/* Origin Pin: Ward 4 Depot */}
          <circle cx={p0.x} cy={p0.y} r="5" fill="var(--color-black)" />
          <text x={p0.x} y={p0.y + 16} textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="bold">
            Depot
          </text>

          {/* Destination Pin: Customer Home */}
          <g transform={`translate(${p2.x}, ${p2.y})`}>
            <circle cx="0" cy="0" r="14" fill="rgba(37, 99, 235, 0.15)" />
            <circle cx="0" cy="0" r="6" fill="#2563EB" stroke="white" strokeWidth="2" />
            <text x="0" y="-12" textAnchor="middle" fill="#2563EB" fontSize="10" fontWeight="bold">
              Your Home
            </text>
          </g>

          {/* Worker Live Moving Dot */}
          {isSharingLocation && (
            <g transform={`translate(${currentX}, ${currentY})`}>
              {/* Radar pulse while moving */}
              {!isArrivedOrPast && (
                <circle cx="0" cy="0" r="16" fill="rgba(255, 106, 0, 0.2)">
                  <animate attributeName="r" values="8;18" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="1.2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Main Worker Dot */}
              <circle
                cx="0"
                cy="0"
                r="8"
                fill="var(--color-accent)"
                stroke="white"
                strokeWidth="2.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              />

              {/* Worker Name Mini Label */}
              <rect x="-35" y="-24" width="70" height="15" rx="3" fill="var(--color-black)" />
              <text x="0" y="-13" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                {workerName.split(' ')[0]} ({isArrivedOrPast ? 'Arrived' : '1.4 km'})
              </text>
            </g>
          )}
        </svg>

        {/* Floating ETA & Distance Pill */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 12,
          right: 12,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Navigation size={14} color="var(--color-accent)" />
            <span>
              {isArrivedOrPast
                ? 'Arrived at your gate'
                : isSharingLocation
                ? 'Traveling via 2nd Main Road'
                : 'Awaiting departure'}
            </span>
          </div>
          <span style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>
            {isArrivedOrPast ? '✓ Arrived' : 'ETA ~12 min (1.4 km)'}
          </span>
        </div>
      </div>

    </div>
  );
};

export default TrackingMap;
