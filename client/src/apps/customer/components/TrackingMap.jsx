import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Radio,
  CheckCircle2,
  User,
  Eye,
  Lock,
  ExternalLink,
  Compass,
  Zap,
  Clock,
  Route,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const TrackingMap = ({
  workerName = 'Ravi Kumar',
  workerCategory = 'Plumbing',
  statusIndex = 0, // 0: Pending, 1: Accepted, 2: On the way, 3: Arrived, 4: Working, 5: Completed
  isSharingLocation = true,
  customerZone = 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar, Chennai',
  isPending = false,
  isWorkerSide = false // true when rendered inside Worker Job Management
}) => {
  // Motion progress along route path (0 to 1)
  const [progress, setProgress] = useState(0.15);
  const [mapMode, setMapMode] = useState('live_route'); // 'live_route' | 'google_map' | 'directions'

  const isPendingState = isPending || statusIndex === 0;
  const isAccepted = statusIndex === 1;
  const isEnRoute = statusIndex === 2;
  const isArrivedOrPast = statusIndex >= 3;

  // Smooth live GPS animation loop when worker has accepted or is en route
  useEffect(() => {
    if ((isEnRoute || isAccepted) && isSharingLocation && !isPendingState) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 0.96) return 0.1; // Loop smoothly for continuous realistic GPS tracking
          return Number((prev + 0.025).toFixed(4));
        });
      }, 500);
      return () => clearInterval(interval);
    } else if (isArrivedOrPast) {
      setProgress(1.0); // Freeze at destination
    } else {
      setProgress(0.05); // Standby at depot
    }
  }, [isEnRoute, isAccepted, isArrivedOrPast, isSharingLocation, isPendingState]);

  // Cubic/Quadratic Bezier Route from Origin (Ward 4 Depot: x=50, y=140) to Destination (Customer: x=340, y=60)
  // Waypoint 1 (Sardar Patel Rd Turn): x=160, y=140
  // Waypoint 2 (LB Rd Junction): x=200, y=50
  // Destination (Customer Gate): x=340, y=60
  const p0 = { x: 50, y: 140 };
  const p1 = { x: 170, y: 140 };
  const p2 = { x: 210, y: 55 };
  const p3 = { x: 340, y: 60 };

  // Calculate coordinates along multi-segment route
  const getCoordinatesAtProgress = (t) => {
    if (t <= 0.5) {
      // First leg: Along Sardar Patel Road (p0 to p1)
      const localT = t / 0.5;
      return {
        x: p0.x + (p1.x - p0.x) * localT,
        y: p0.y + (p1.y - p0.y) * localT,
        currentRoad: 'Sardar Patel Road'
      };
    } else if (t <= 0.8) {
      // Second leg: Turning onto LB Road (p1 to p2)
      const localT = (t - 0.5) / 0.3;
      return {
        x: p1.x + (p2.x - p1.x) * localT,
        y: p1.y + (p2.y - p1.y) * localT,
        currentRoad: 'LB Road Signal'
      };
    } else {
      // Final leg: Turning into Kasturba Nagar 2nd Main Rd to Customer Gate (p2 to p3)
      const localT = (t - 0.8) / 0.2;
      return {
        x: p2.x + (p3.x - p2.x) * localT,
        y: p2.y + (p3.y - p2.y) * localT,
        currentRoad: 'Kasturba Nagar 2nd Main Rd'
      };
    }
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const currentPos = getCoordinatesAtProgress(clampedProgress);

  // Dynamic calculated metrics based on progress
  const remainingDistanceKm = isArrivedOrPast
    ? 0
    : isPendingState
    ? 2.1
    : Math.max(0.1, Number((2.1 * (1 - clampedProgress)).toFixed(1)));
  const remainingEtaMins = isArrivedOrPast
    ? 0
    : isPendingState
    ? 12
    : Math.max(1, Math.round(12 * (1 - clampedProgress)));
  const currentSpeed = isArrivedOrPast || isPendingState ? 0 : isEnRoute ? 32 : 18;

  const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(customerZone)}&travelmode=driving`;

  return (
    <div style={{
      border: '1.5px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'white',
      boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
    }}>
      
      {/* 1. TOP LIVE GPS STATUS HEADER */}
      <div style={{
        background: isPendingState
          ? '#FFFBEB'
          : isSharingLocation && !isArrivedOrPast
          ? 'linear-gradient(135deg, #111 0%, #1F2937 100%)'
          : 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: !isPendingState && isSharingLocation && !isArrivedOrPast ? 'white' : 'inherit'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isPendingState ? (
            <span style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#F59E0B',
              boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)',
              display: 'inline-block'
            }} />
          ) : isSharingLocation && !isArrivedOrPast ? (
            <span style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#22C55E',
              boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.35)',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite'
            }} />
          ) : (
            <span style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'var(--color-text-secondary)',
              display: 'inline-block'
            }} />
          )}

          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: isPendingState
                ? '#92400E'
                : isSharingLocation && !isArrivedOrPast
                ? 'white'
                : 'var(--color-black)'
            }}>
              {isPendingState
                ? '⏳ Waiting for Worker to Accept Dispatch'
                : isArrivedOrPast
                ? `📍 ${workerName} has arrived at Customer Gate`
                : isWorkerSide
                ? `🛵 Live GPS Navigation: Heading to Customer`
                : `🛵 ${workerName} Live Location Tracking Active`}
            </div>
            
            <div style={{
              fontSize: '11px',
              color: !isPendingState && isSharingLocation && !isArrivedOrPast ? '#9CA3AF' : 'var(--color-text-secondary)',
              marginTop: 2
            }}>
              {isPendingState
                ? `📍 Pinned Location: ${customerZone}`
                : isArrivedOrPast
                ? '✓ Arrived at destination • Location sharing ended'
                : `Live GPS telemetry • Active street: ${currentPos.currentRoad}`}
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
          <button
            type="button"
            onClick={() => setMapMode('live_route')}
            style={{
              padding: '5px 9px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              background: mapMode === 'live_route' ? 'var(--color-accent)' : 'transparent',
              color: mapMode === 'live_route' ? 'white' : isPendingState ? 'var(--color-black)' : 'white',
              cursor: 'pointer'
            }}
          >
            🗺️ Live GPS
          </button>
          <button
            type="button"
            onClick={() => setMapMode('google_map')}
            style={{
              padding: '5px 9px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              background: mapMode === 'google_map' ? 'var(--color-accent)' : 'transparent',
              color: mapMode === 'google_map' ? 'white' : isPendingState ? 'var(--color-black)' : 'white',
              cursor: 'pointer'
            }}
          >
            🛰️ Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapMode('directions')}
            style={{
              padding: '5px 9px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              background: mapMode === 'directions' ? 'var(--color-accent)' : 'transparent',
              color: mapMode === 'directions' ? 'white' : isPendingState ? 'var(--color-black)' : 'white',
              cursor: 'pointer'
            }}
          >
            🧭 Turns
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME TELEMETRY STATS BAR (ETA, DISTANCE, SPEED, CURRENT ROAD) */}
      {!isPendingState && (
        <div style={{
          background: '#F8FAFC',
          borderBottom: '1px solid var(--color-border)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <span className="text-secondary" style={{ fontSize: '10px', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
                REMAINING DISTANCE
              </span>
              <strong style={{ fontSize: '15px', color: 'var(--color-black)' }}>
                📍 {isArrivedOrPast ? '0 m (Arrived)' : `${remainingDistanceKm} km`}
              </strong>
            </div>

            <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: 14 }}>
              <span className="text-secondary" style={{ fontSize: '10px', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
                ESTIMATED ARRIVAL
              </span>
              <strong style={{ fontSize: '15px', color: 'var(--color-accent)' }}>
                ⚡ {isArrivedOrPast ? 'Arrived Just Now' : `${remainingEtaMins} mins ETA`}
              </strong>
            </div>

            <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: 14 }}>
              <span className="text-secondary" style={{ fontSize: '10px', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
                LIVE SPEED
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A' }}>
                🛵 {currentSpeed} km/h
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="text-secondary" style={{ fontSize: '10px', display: 'block', fontWeight: 800, textTransform: 'uppercase' }}>
              TRANSIT ROAD
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              {currentPos.currentRoad}
            </span>
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE MAP VIEWPORTS */}
      {mapMode === 'live_route' && (
        <div style={{ position: 'relative', width: '100%', height: '240px', background: '#F1F5F9', overflow: 'hidden' }}>
          <svg
            viewBox="0 0 400 200"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            {/* Background Street Grid Pattern */}
            <defs>
              <pattern id="streetGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
              </pattern>
              <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF8C00" stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect width="400" height="200" fill="#F8FAFC" />
            <rect width="400" height="200" fill="url(#streetGrid)" />

            {/* City Road Network Lines */}
            <path d="M 0 140 L 400 140" stroke="#CBD5E1" strokeWidth="12" />
            <path d="M 170 0 L 170 200" stroke="#CBD5E1" strokeWidth="12" />
            <path d="M 210 0 L 210 200" stroke="#CBD5E1" strokeWidth="10" />
            <path d="M 0 55 L 400 55" stroke="#CBD5E1" strokeWidth="10" />

            {/* Road Center Dashes */}
            <path d="M 0 140 L 400 140" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 6" />
            <path d="M 170 0 L 170 200" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 6" />
            <path d="M 210 0 L 210 200" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 6" />
            <path d="M 0 55 L 400 55" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Street Names Labels */}
            <text x="12" y="133" fill="#64748B" fontSize="9" fontWeight="700">Sardar Patel Road</text>
            <text x="176" y="20" fill="#64748B" fontSize="9" fontWeight="700">LB Road Signal</text>
            <text x="12" y="48" fill="#64748B" fontSize="9" fontWeight="700">Kasturba Nagar 2nd Main Rd</text>

            {/* Planned Full Route Line (Dashed) */}
            <path
              d={`M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="5"
              strokeDasharray="4 4"
              strokeLinejoin="round"
            />

            {/* Active Traveled Glowing Route Line */}
            {!isPendingState && (
              <path
                d={
                  clampedProgress <= 0.5
                    ? `M ${p0.x} ${p0.y} L ${currentPos.x} ${currentPos.y}`
                    : clampedProgress <= 0.8
                    ? `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${currentPos.x} ${currentPos.y}`
                    : `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${currentPos.x} ${currentPos.y}`
                }
                fill="none"
                stroke="url(#routeGlow)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 2px 4px rgba(255, 106, 0, 0.4))"
              />
            )}

            {/* 1. Origin Pin: Ward 4 Cooperative Depot Node */}
            <g transform={`translate(${p0.x}, ${p0.y})`}>
              <circle r="10" fill="#3B82F6" stroke="white" strokeWidth="2.5" />
              <rect x="-36" y="14" width="72" height="15" rx="3" fill="#1E293B" />
              <text x="0" y="25" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">
                Ward 4 Depot
              </text>
            </g>

            {/* 2. Destination Pin: Customer Residence (Prominent Pulsing Pin) */}
            <g transform={`translate(${p3.x}, ${p3.y})`}>
              <circle
                r="20"
                fill="rgba(217, 48, 37, 0.2)"
                style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
              />
              <circle r="11" fill="#D93025" stroke="white" strokeWidth="2.5" />
              <circle r="4" fill="white" />
              <rect x="-55" y="16" width="110" height="17" rx="4" fill="#D93025" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
              <text x="0" y="28" fill="white" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                📍 Customer Gate Pin
              </text>
            </g>

            {/* 3. LIVE MOVING WORKER VEHICLE MARKER */}
            {!isPendingState && (
              <g transform={`translate(${currentPos.x}, ${currentPos.y})`}>
                {/* Pulsing Radar Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r="20"
                  fill="rgba(255, 106, 0, 0.3)"
                  style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                />
                {/* Vehicle Circle Badge */}
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="var(--color-accent)"
                  stroke="white"
                  strokeWidth="3"
                  filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))"
                />
                <text x="0" y="4" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                  🛵
                </text>

                {/* Worker Live Distance Callout */}
                <rect x="-42" y="-28" width="84" height="16" rx="4" fill="var(--color-black)" />
                <text x="0" y="-17" fill="white" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  {workerName.split(' ')[0]} ({isArrivedOrPast ? 'Arrived' : `${remainingDistanceKm} km`})
                </text>
              </g>
            )}
          </svg>

          {/* Floating Destination / Live Position Pill */}
          <div style={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Navigation size={14} color="var(--color-accent)" />
              <span style={{ fontWeight: 700, color: 'var(--color-black)' }}>
                {isPendingState
                  ? '📍 Destination: Customer Gate (Pending Acceptance)'
                  : isArrivedOrPast
                  ? '📍 Worker Arrived at Customer Gate'
                  : `🛵 Live Transit: On ${currentPos.currentRoad}`}
              </span>
            </div>
            <span style={{ fontWeight: 800, color: isPendingState ? '#D97706' : 'var(--color-accent)' }}>
              {isPendingState ? '⏳ Pending Acceptance' : isArrivedOrPast ? '✓ Arrived' : `ETA ~${remainingEtaMins} min`}
            </span>
          </div>
        </div>
      )}

      {/* SATELLITE GOOGLE MAP VIEW */}
      {mapMode === 'google_map' && (
        <div style={{ position: 'relative', width: '100%', height: '240px', background: '#E5E7EB' }}>
          <iframe
            title="Google Maps Satellite Live Route"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(customerZone)}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
          />
          
          <div style={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} color="#D93025" />
              <span style={{ fontWeight: 700 }}>📍 {customerZone}</span>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--color-accent)' }}>
              {isArrivedOrPast ? '✓ Arrived' : `~${remainingDistanceKm} km away`}
            </span>
          </div>
        </div>
      )}

      {/* TURN-BY-TURN DIRECTIONS VIEW */}
      {mapMode === 'directions' && (
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '13px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#E0E7FF', color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0 }}>
              1
            </div>
            <div>
              <strong>Depart north from Ward 4 Depot along Sardar Patel Road</strong>
              <div className="text-secondary" style={{ fontSize: '11px' }}>Drive 800m • Light traffic flow</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '13px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#E0E7FF', color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0 }}>
              2
            </div>
            <div>
              <strong>Turn right at LB Road Junction onto Kasturba Nagar 2nd Main Road</strong>
              <div className="text-secondary" style={{ fontSize: '11px' }}>Continue for 1.1 km towards Adyar Signal</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '13px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0 }}>
              3
            </div>
            <div>
              <strong>Arrive at Customer Gate: {customerZone}</strong>
              <div className="text-secondary" style={{ fontSize: '11px' }}>Building entrance on the left • Enter customer arrival PIN</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DIRECT GOOGLE MAPS NAVIGATION LAUNCH BUTTON */}
      <div style={{
        padding: '10px 16px',
        background: '#F8FAFC',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
          <MapPin size={14} color="#D93025" />
          <span className="text-secondary">
            Destination: <strong style={{ color: 'var(--color-black)' }}>{customerZone}</strong>
          </span>
        </div>

        <a
          href={googleMapsRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#1A73E8',
            color: 'white',
            padding: '7px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(26, 115, 232, 0.25)'
          }}
        >
          <Navigation size={14} />
          <span>Open in Google Maps (Turn-by-Turn GPS)</span>
          <ExternalLink size={13} />
        </a>
      </div>

    </div>
  );
};

export default TrackingMap;
