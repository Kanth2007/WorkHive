import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ShieldCheck, Radio, CheckCircle2, User, Eye, Lock, ExternalLink } from 'lucide-react';

export const TrackingMap = ({
  workerName = 'Ravi Kumar',
  workerCategory = 'Plumbing',
  statusIndex = 0, // 0: Pending, 1: Accepted, 2: On the way, 3: Arrived, 4: Working, 5: Completed
  isSharingLocation = true,
  customerZone = 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar, Chennai',
  isPending = false
}) => {
  // Motion interpolation progress along path (0 to 1)
  const [progress, setProgress] = useState(0.2);
  const [mapMode, setMapMode] = useState('google'); // 'google' | 'radar'

  const isPendingState = isPending || statusIndex === 0;
  const isAccepted = statusIndex === 1;
  const isEnRoute = statusIndex === 2;
  const isArrivedOrPast = statusIndex >= 3;

  useEffect(() => {
    // Only animate moving dot while status is 'On the way' (isEnRoute) and sharing is active
    if (isEnRoute && isSharingLocation) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 0.95) return 0.15; // Loop for smooth simulated GPS transit
          return prev + 0.035;
        });
      }, 400);
      return () => clearInterval(interval);
    } else if (isArrivedOrPast) {
      // Once arrived or beyond, freeze dot at destination
      setProgress(1.0);
    } else {
      setProgress(0.05);
    }
  }, [isEnRoute, isArrivedOrPast, isSharingLocation]);

  // Quadratic Bezier Curve Path from Origin (Adyar Depot: x=60, y=130) to Destination (Customer: x=330, y=75)
  // Control point: x=190, y=35
  const p0 = { x: 60, y: 130 };
  const p1 = { x: 190, y: 35 };
  const p2 = { x: 330, y: 75 };

  // Calculate current coordinates (x, y) along bezier curve
  const t = Math.min(Math.max(progress, 0), 1);
  const currentX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const currentY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(customerZone)}&travelmode=driving`;

  return (
    <div style={{
      border: '1.5px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'white'
    }}>
      
      {/* 1. TOP LIVE SHARING STATUS BANNER WITH TRANSPARENT PRIVACY LABEL */}
      <div style={{
        background: isPendingState
          ? '#FFFBEB'
          : isSharingLocation && !isArrivedOrPast
          ? '#F0FDF4'
          : 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isPendingState ? (
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#F59E0B',
              boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)',
              display: 'inline-block'
            }} />
          ) : isSharingLocation && !isArrivedOrPast ? (
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
              color: isPendingState
                ? '#92400E'
                : isSharingLocation && !isArrivedOrPast
                ? '#15803D'
                : 'var(--color-black)'
            }}>
              {isPendingState
                ? '⏳ Dispatch Sent • Waiting for Worker Acceptance'
                : isArrivedOrPast
                ? `${workerName} has arrived at destination`
                : isEnRoute
                ? `${workerName} is en route via GPS`
                : `${workerName} accepted • Preparing tools`}
            </div>
            {/* Transparent Privacy Note */}
            <div className="text-secondary" style={{ fontSize: '11px', marginTop: 1 }}>
              {isPendingState
                ? `📍 Pinned Location: ${customerZone}`
                : isArrivedOrPast
                ? '🔒 Location sharing ended automatically upon arrival'
                : isSharingLocation
                ? '🔒 Sharing live GPS route • Stops automatically upon arrival'
                : 'GPS sharing activates when helper departs depot'}
            </div>
          </div>
        </div>

        {/* View Toggle Button */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            onClick={() => setMapMode('google')}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              background: mapMode === 'google' ? 'var(--color-accent)' : 'rgba(0,0,0,0.06)',
              color: mapMode === 'google' ? 'white' : 'var(--color-black)',
              cursor: 'pointer'
            }}
          >
            Google Map
          </button>
          <button
            type="button"
            onClick={() => setMapMode('radar')}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              background: mapMode === 'radar' ? 'var(--color-accent)' : 'rgba(0,0,0,0.06)',
              color: mapMode === 'radar' ? 'white' : 'var(--color-black)',
              cursor: 'pointer'
            }}
          >
            Live Radar
          </button>
        </div>
      </div>

      {/* 2. MAP CANVAS / GOOGLE MAP EMBED */}
      {mapMode === 'google' ? (
        <div style={{ position: 'relative', width: '100%', height: '220px', background: '#E5E7EB' }}>
          <iframe
            title="Google Maps Customer Live Route"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(customerZone)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
          
          {/* Floating ETA & Destination Pill */}
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
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={14} color="#D93025" />
              <span style={{ fontWeight: 600 }}>
                {isPendingState
                  ? '📍 Your Pinned Service Location'
                  : isArrivedOrPast
                  ? 'Arrived at your location'
                  : isEnRoute
                  ? 'En route via Sardar Patel Rd'
                  : 'Booking accepted • Preparing departure'}
              </span>
            </div>
            <span style={{ fontWeight: 'bold', color: isPendingState ? '#D97706' : 'var(--color-accent)' }}>
              {isPendingState ? '⏳ Pending Acceptance' : isArrivedOrPast ? '✓ Arrived' : isEnRoute ? 'ETA ~12 min (2.1 km)' : 'Accepted ✓'}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '220px', background: '#FAFAFA' }}>
          <svg
            viewBox="0 0 400 200"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="400" height="200" fill="url(#grid)" />

            {/* Roads Layout */}
            <path d="M 0 140 L 400 140" stroke="#E2E8F0" strokeWidth="8" />
            <path d="M 190 0 L 190 200" stroke="#E2E8F0" strokeWidth="8" />
            <path d="M 0 60 L 400 60" stroke="#E2E8F0" strokeWidth="6" />

            {/* Road Names */}
            <text x="10" y="135" fill="#94A3B8" fontSize="8" fontWeight="600">Sardar Patel Road</text>
            <text x="195" y="15" fill="#94A3B8" fontSize="8" fontWeight="600">LB Road</text>
            <text x="10" y="55" fill="#94A3B8" fontSize="8" fontWeight="600">2nd Main Road</text>

            {/* Bezier Route Track */}
            <path
              d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="4"
              strokeDasharray="4 4"
            />

            {/* Active Highlighted Traveled Path */}
            {!isPendingState && isSharingLocation && (
              <path
                d={`M ${p0.x} ${p0.y} Q ${(p0.x + currentX) / 2} ${(p0.y + currentY) / 2} ${currentX} ${currentY}`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="4"
              />
            )}

            {/* Origin Point: Cooperative Depot Node */}
            <g transform={`translate(${p0.x}, ${p0.y})`}>
              <circle r="7" fill="#64748B" stroke="white" strokeWidth="2" />
              <rect x="-30" y="10" width="60" height="14" rx="3" fill="#64748B" />
              <text x="0" y="20" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">
                Ward 4 Depot
              </text>
            </g>

            {/* Destination Point: Customer Residence (Prominent Pin) */}
            <g transform={`translate(${p2.x}, ${p2.y})`}>
              <circle
                r="18"
                fill="rgba(217, 48, 37, 0.2)"
                style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
              />
              <circle r="9" fill="#D93025" stroke="white" strokeWidth="2" />
              <circle r="14" fill="none" stroke="#D93025" strokeWidth="1.5" strokeDasharray="2 2" />
              <rect x="-45" y="12" width="90" height="15" rx="3" fill="#D93025" />
              <text x="0" y="23" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">
                📍 Pinned Location
              </text>
            </g>

            {/* Animated Moving Vehicle Dot */}
            {!isPendingState && isSharingLocation && (
              <g transform={`translate(${currentX}, ${currentY})`}>
                <circle
                  cx="0"
                  cy="0"
                  r="16"
                  fill="rgba(255, 106, 0, 0.25)"
                  style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="var(--color-accent)"
                  stroke="white"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                />

                <rect x="-35" y="-24" width="70" height="15" rx="3" fill="var(--color-black)" />
                <text x="0" y="-13" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {workerName.split(' ')[0]} ({isArrivedOrPast ? 'Arrived' : '2.1 km'})
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
              <MapPin size={14} color="#D93025" />
              <span>
                {isPendingState
                  ? '📍 Your Pinned Service Location'
                  : isArrivedOrPast
                  ? 'Arrived at your gate'
                  : isEnRoute
                  ? 'Traveling via Sardar Patel & LB Rd'
                  : 'Booking accepted • Awaiting departure'}
              </span>
            </div>
            <span style={{ fontWeight: 'bold', color: isPendingState ? '#D97706' : 'var(--color-accent)' }}>
              {isPendingState ? '⏳ Pending Acceptance' : isArrivedOrPast ? '✓ Arrived' : isEnRoute ? 'ETA ~12 min (2.1 km)' : 'Accepted ✓'}
            </span>
          </div>
        </div>
      )}

      {/* 3. DIRECT GOOGLE MAPS ROUTE LINK */}
      <div style={{
        padding: '8px 14px',
        background: '#F8FAFC',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span className="text-secondary" style={{ fontSize: '11px' }}>
          📍 Destination: <strong>{customerZone}</strong>
        </span>
        <a
          href={googleMapsRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '12px',
            fontWeight: 700,
            color: '#1A73E8',
            textDecoration: 'none'
          }}
        >
          <span>Open Google Maps</span>
          <ExternalLink size={13} />
        </a>
      </div>

    </div>
  );
};

export default TrackingMap;
