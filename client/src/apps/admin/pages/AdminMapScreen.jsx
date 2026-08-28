import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Users,
  Briefcase,
  Play,
  RotateCcw,
  Sparkles,
  Navigation,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Layers,
  ArrowRight,
  Compass
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';

export const AdminMapScreen = () => {
  // 18 Seeded Mock Pins (Customers 🔵, Available Workers 🟢, Active Jobs 🟠)
  const [pins, setPins] = useState([
    // Customers 🔵
    { id: 'c1', type: 'customer', name: 'Anand Sundaram', detail: 'Needs Electrician (Regulator Fix)', zone: 'Besant Nagar', x: 58, y: 44, active: true },
    { id: 'c2', type: 'customer', name: 'Meera Krishnan', detail: 'Plumbing (Tap Leakage)', zone: 'Kasturba Nagar', x: 38, y: 35 },
    { id: 'c3', type: 'customer', name: 'Deepak Shah', detail: 'AC Diagnostic Inspection', zone: 'Thiruvanmiyur', x: 62, y: 72 },
    { id: 'c4', type: 'customer', name: 'Priya Natarajan', detail: 'Main Board Sparking', zone: 'Mylapore', x: 32, y: 18 },
    { id: 'c5', type: 'customer', name: 'Divya S.', detail: 'House Deep Cleaning', zone: 'Adyar 3rd Cross', x: 44, y: 52 },
    { id: 'c6', type: 'customer', name: 'Suresh Kumar', detail: 'Washing Machine Drainage', zone: 'Velachery', x: 22, y: 65 },

    // Available Workers 🟢
    { id: 'w1', type: 'available_worker', name: 'Arun (Worker #42)', skill: 'Electrical', rating: 4.8, zone: 'Besant Nagar (1.4 km)', x: 66, y: 38, isTargetWorker: true },
    { id: 'w2', type: 'available_worker', name: 'Ravi Kumar', skill: 'Plumbing', rating: 4.8, zone: 'Adyar Ward 4', x: 42, y: 32 },
    { id: 'w3', type: 'available_worker', name: 'Karthik R.', skill: 'Gardening', rating: 4.8, zone: 'Kasturba Nagar', x: 36, y: 42 },
    { id: 'w4', type: 'available_worker', name: 'Sunita Shinde', skill: 'Caregiver', rating: 4.9, zone: 'Adyar Depot', x: 48, y: 46 },
    { id: 'w5', type: 'available_worker', name: 'Santosh More', skill: 'Technician', rating: 4.6, zone: 'Mylapore', x: 28, y: 22 },
    { id: 'w6', type: 'available_worker', name: 'Lata Gaikwad', skill: 'Cleaning', rating: 4.9, zone: 'Velachery Depot', x: 18, y: 58 },
    { id: 'w7', type: 'available_worker', name: 'Selvan T.', skill: 'Electrical', rating: 4.7, zone: 'Thiruvanmiyur', x: 68, y: 66 },
    { id: 'w8', type: 'available_worker', name: 'Murugan P.', skill: 'Electrical', rating: 4.6, zone: 'Velachery East', x: 26, y: 74 },

    // Active Jobs 🟠
    { id: 'j1', type: 'active_job', name: 'Job #BK-1046', detail: 'Caregiver Dispatch • Sunita S.', zone: 'Adyar 3rd Cross', x: 50, y: 54 },
    { id: 'j2', type: 'active_job', name: 'Job #BK-1047', detail: 'Electrical Repair • Arun', zone: 'Besant Nagar', x: 60, y: 42 },
    { id: 'j3', type: 'active_job', name: 'Job #BK-1036', detail: 'Sanitization • Lata G.', zone: 'Kasturba Nagar', x: 40, y: 48 },
    { id: 'j4', type: 'active_job', name: 'Job #BK-1038', detail: 'Emergency Burst Pipe • Ravi K.', zone: 'Adyar Main Road', x: 46, y: 28 }
  ]);

  // Selected Pin for Tooltip
  const [selectedPin, setSelectedPin] = useState(pins[0]);

  // Animated Matching Simulation State (Steps 0, 1, 2, 3)
  const [simStep, setSimStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Simulation Sequence Steps
  const matchingSequence = [
    {
      step: 1,
      title: 'Customer needs electrician',
      desc: 'Anand Sundaram in Besant Nagar requested an urgent switchboard & regulator repair.',
      badge: 'Request Broadcasted',
      highlightedType: 'customer',
      activePinId: 'c1'
    },
    {
      step: 2,
      title: 'System identifies 8 available electricians',
      desc: 'Smart-Match scanned active online cooperative workers within a 4.5 km service radius.',
      badge: '8 Candidates Found',
      highlightedType: 'electricians',
      candidateCount: 8
    },
    {
      step: 3,
      title: 'Finds closest suitable worker',
      desc: 'Algorithm optimized for closest transit (1.4 km), 4.8 ⭐ member rating, and verified wireman license.',
      badge: 'Routing Calculated (1.4 km)',
      highlightedType: 'closest',
      activePinId: 'w1'
    },
    {
      step: 4,
      title: 'Assigns Worker #42',
      desc: 'Arun (#CLC-EL-102 • Worker #42) assigned. Job dispatched with 100% fair transparent payout.',
      badge: '✓ Dispatched & Confirmed',
      highlightedType: 'assigned',
      activePinId: 'w1'
    }
  ];

  // Auto-play timer effect
  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setSimStep((prev) => {
          if (prev >= 3) {
            setIsAutoPlaying(false);
            return 3;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleNextStep = () => {
    setSimStep((prev) => (prev < 3 ? prev + 1 : 0));
  };

  const handleRestart = () => {
    setSimStep(0);
    setIsAutoPlaying(false);
  };

  const handleStartAutoPlay = () => {
    setSimStep(0);
    setIsAutoPlaying(true);
  };

  const currentSeq = matchingSequence[simStep];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER & MAP CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
              Cooperative Live Fleet & Matching Map
            </h1>
            <Badge variant="success" style={{ fontSize: '11px' }}>
              ● Live Telemetry
            </Badge>
          </div>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Real-time geospatial distribution of customers, active dispatches, and available cooperative members
          </p>
        </div>

        {/* 2. LEGEND (3 PIN TYPES) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          background: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Customer Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
            <span>🔵 Customers (6)</span>
          </div>

          {/* Available Worker Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
            <span>🟢 Available Workers (8)</span>
          </div>

          {/* Active Job Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 600 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
            <span>🟠 Active Jobs (4)</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: MAP CANVAS + ANIMATED SIMULATION SIDEBAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 'var(--space-md)',
        alignItems: 'start'
      }}>
        
        {/* MAP CANVAS CONTAINER */}
        <Card padding="none" style={{ position: 'relative', height: '580px', overflow: 'hidden', border: '1.5px solid var(--color-border)' }}>
          
          {/* Map Graphic Canvas (Mock City Grid: Adyar, Besant Nagar, Bay of Bengal, Rivers) */}
          <svg
            viewBox="0 0 800 580"
            style={{
              width: '100%',
              height: '100%',
              background: '#F4F5F7',
              userSelect: 'none'
            }}
          >
            {/* Coastline / Bay of Bengal */}
            <path
              d="M 620 0 Q 640 180 610 320 Q 590 440 630 580 L 800 580 L 800 0 Z"
              fill="#E0F2FE"
            />
            <text x="690" y="280" fill="#0284C7" fontSize="14" fontWeight="bold" letterSpacing="3" transform="rotate(90, 690, 280)">
              BAY OF BENGAL
            </text>

            {/* Adyar River Estuary */}
            <path
              d="M 0 240 Q 220 250 380 230 Q 520 220 620 240 L 610 270 Q 480 250 360 265 Q 180 280 0 270 Z"
              fill="#BAE6FD"
            />
            <text x="180" y="258" fill="#0369A1" fontSize="11" fontWeight="600" opacity="0.8">
              Adyar River Channel
            </text>

            {/* Road Network Grid */}
            {/* Major Arteries */}
            <line x1="120" y1="0" x2="260" y2="580" stroke="#E2E8F0" strokeWidth="12" />
            <line x1="380" y1="0" x2="420" y2="580" stroke="#E2E8F0" strokeWidth="14" />
            <line x1="0" y1="140" x2="630" y2="120" stroke="#E2E8F0" strokeWidth="12" />
            <line x1="0" y1="420" x2="610" y2="440" stroke="#E2E8F0" strokeWidth="12" />
            
            {/* Secondary Roads */}
            <line x1="280" y1="0" x2="280" y2="580" stroke="#CBD5E1" strokeWidth="4" strokeDasharray="6 4" />
            <line x1="500" y1="0" x2="520" y2="580" stroke="#CBD5E1" strokeWidth="5" />
            <line x1="0" y1="340" x2="600" y2="340" stroke="#CBD5E1" strokeWidth="4" />
            <line x1="0" y1="500" x2="620" y2="500" stroke="#CBD5E1" strokeWidth="4" />

            {/* Neighborhood Boundaries & Labels */}
            <g opacity="0.6">
              {/* Mylapore */}
              <circle cx="260" cy="110" r="70" fill="none" stroke="#94A3B8" strokeDasharray="4 4" />
              <text x="230" y="110" fill="#475569" fontSize="13" fontWeight="bold">MYLAPORE</text>

              {/* Adyar (Ward 4) */}
              <circle cx="360" cy="340" r="90" fill="rgba(255,106,0,0.04)" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="5 5" />
              <text x="310" y="345" fill="var(--color-black)" fontSize="14" fontWeight="bold">ADYAR (WARD 4)</text>

              {/* Besant Nagar */}
              <circle cx="490" cy="300" r="75" fill="none" stroke="#94A3B8" strokeDasharray="4 4" />
              <text x="440" y="295" fill="#475569" fontSize="13" fontWeight="bold">BESANT NAGAR</text>

              {/* Kasturba Nagar */}
              <text x="280" y="220" fill="#64748B" fontSize="11" fontWeight="600">Kasturba Nagar</text>

              {/* Velachery */}
              <text x="140" y="440" fill="#475569" fontSize="13" fontWeight="bold">VELACHERY</text>

              {/* Thiruvanmiyur */}
              <text x="480" y="480" fill="#475569" fontSize="13" fontWeight="bold">THIRUVANMIYUR</text>
            </g>

            {/* SIMULATION RADAR / ROUTING OVERLAYS */}
            {/* Step 2: Radar Search Pulse from Customer Pin */}
            {simStep === 1 && (
              <circle
                cx={58 * 8}
                cy={44 * 5.8}
                r="140"
                fill="rgba(37, 99, 235, 0.12)"
                stroke="#2563EB"
                strokeWidth="2"
                strokeDasharray="6 4"
              >
                <animate attributeName="r" values="40;160" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Step 3 & 4: Route Line between Customer Anand (c1) and Assigned Worker Arun (w1) */}
            {(simStep === 2 || simStep === 3) && (
              <g>
                <line
                  x1={58 * 8}
                  y1={44 * 5.8}
                  x2={66 * 8}
                  y2={38 * 5.8}
                  stroke="var(--color-accent)"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                >
                  <animate attributeName="stroke-dashoffset" values="24;0" dur="1s" repeatCount="indefinite" />
                </line>
                {/* Distance Badge in Map Center */}
                <rect x={(58 + 66) * 4 - 36} y={(44 + 38) * 2.9 - 14} width="72" height="24" rx="12" fill="var(--color-black)" />
                <text x={(58 + 66) * 4} y={(44 + 38) * 2.9 + 3} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">
                  1.4 km
                </text>
              </g>
            )}

            {/* PINS RENDERING */}
            {pins.map((pin) => {
              const px = (pin.x / 100) * 800;
              const py = (pin.y / 100) * 580;
              const isSelected = selectedPin?.id === pin.id;
              
              // Simulation Highlighting Flags
              const isSimTargetWorker = pin.id === 'w1' && (simStep === 2 || simStep === 3);
              const isSimCustomer = pin.id === 'c1';
              const isCandidateWorker = simStep === 1 && pin.skill === 'Electrical';

              let pinColor = '#2563EB'; // Customer 🔵
              if (pin.type === 'available_worker') pinColor = '#16A34A'; // Worker 🟢
              if (pin.type === 'active_job') pinColor = 'var(--color-accent)'; // Job 🟠

              if (isSimTargetWorker) pinColor = 'var(--color-accent)';

              return (
                <g
                  key={pin.id}
                  transform={`translate(${px}, ${py})`}
                  onClick={() => setSelectedPin(pin)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Highlight halo when selected or during simulation */}
                  {(isSelected || isSimTargetWorker || isSimCustomer || isCandidateWorker) && (
                    <circle
                      cx="0"
                      cy="-12"
                      r={isSimTargetWorker ? 24 : 18}
                      fill={isSimTargetWorker ? 'rgba(255,106,0,0.3)' : 'rgba(37,99,235,0.2)'}
                      stroke={pinColor}
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Pin Shape */}
                  <path
                    d="M 0 0 C -8 -10 -12 -16 -12 -22 C -12 -30 -6 -36 0 -36 C 6 -36 12 -30 12 -22 C 12 -16 8 -10 0 0 Z"
                    fill={pinColor}
                    stroke="white"
                    strokeWidth="2"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                  />

                  {/* Pin Center Dot / Symbol */}
                  <circle cx="0" cy="-22" r="4.5" fill="white" />

                  {/* Pin Mini Label */}
                  <text
                    x="0"
                    y="14"
                    textAnchor="middle"
                    fill="var(--color-black)"
                    fontSize="10"
                    fontWeight="bold"
                    style={{
                      paintOrder: 'stroke',
                      stroke: 'white',
                      strokeWidth: 3,
                      strokeLinejoin: 'round'
                    }}
                  >
                    {pin.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Pin Info Tooltip / Inspector Box */}
          {selectedPin && (
            <div style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              background: 'var(--color-white)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              maxWidth: '300px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: selectedPin.type === 'customer' ? '#2563EB' : (selectedPin.type === 'available_worker' ? '#16A34A' : 'var(--color-accent)')
                }}>
                  {selectedPin.type === 'customer' && '🔵 Customer Pin'}
                  {selectedPin.type === 'available_worker' && '🟢 Available Worker Pin'}
                  {selectedPin.type === 'active_job' && '🟠 Active Dispatch'}
                </span>
                <span className="text-secondary" style={{ fontSize: '11px' }}>{selectedPin.zone}</span>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                {selectedPin.name}
              </div>

              <p style={{ fontSize: '12px', color: '#555', margin: '2px 0 8px' }}>
                {selectedPin.detail || `${selectedPin.skill} • Rating: ${selectedPin.rating} ⭐`}
              </p>

              <button
                type="button"
                onClick={handleStartAutoPlay}
                style={{
                  fontSize: '11px',
                  color: 'var(--color-accent)',
                  fontWeight: 'bold',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Simulate Smart-Match from here &gt;
              </button>
            </div>
          )}

        </Card>

        {/* 4. ANIMATED / STEP-THROUGH SMART MATCHING DEMO PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Header Card with Simulation Playback */}
          <Card padding="md" style={{ border: '2px solid var(--color-accent)', background: '#FFFDFB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={18} color="var(--color-accent)" />
                  <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                    Smart-Match Live Flow
                  </h2>
                </div>
                <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                  Interactive sequence demonstration
                </p>
              </div>

              <Badge variant="active" style={{ fontSize: '10px' }}>
                Step {simStep + 1} of 4
              </Badge>
            </div>

            {/* Playback Controls */}
            <div style={{ display: 'flex', gap: '6px', marginTop: 'var(--space-sm)' }}>
              <Button
                variant={isAutoPlaying ? 'outline' : 'primary'}
                size="small"
                icon={Play}
                style={{ flex: 1 }}
                onClick={handleStartAutoPlay}
              >
                {isAutoPlaying ? 'Auto-Playing...' : 'Auto-Play Simulation'}
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={handleNextStep}
              >
                Next &gt;
              </Button>
              <Button
                variant="outline"
                size="small"
                icon={RotateCcw}
                onClick={handleRestart}
                title="Restart simulation"
              />
            </div>
          </Card>

          {/* Step Sequence Cards (Appearing One by One) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {matchingSequence.map((item, idx) => {
              const isCurrent = simStep === idx;
              const isPast = simStep > idx;

              return (
                <Card
                  key={item.step}
                  padding="md"
                  style={{
                    border: isCurrent ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    background: isCurrent ? 'white' : (isPast ? '#FAFAFA' : '#F5F5F5'),
                    opacity: isCurrent || isPast ? 1 : 0.6,
                    transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.25s ease',
                    boxShadow: isCurrent ? 'var(--shadow-md)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                    {/* Step Number Circle */}
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: isCurrent ? 'var(--color-accent)' : (isPast ? '#16A34A' : 'var(--color-border)'),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {isPast ? '✓' : item.step}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        {/* Step Title matching exact requirement */}
                        <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: 'var(--color-black)' }}>
                          "{item.title}"
                        </h3>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 6px', lineHeight: 1.4 }}>
                        {item.desc}
                      </p>

                      {/* Badge indicator */}
                      <Badge variant={isCurrent ? 'active' : (isPast ? 'success' : 'neutral')} style={{ fontSize: '10px' }}>
                        {item.badge}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Assigned Highlight Card (when step 4 is reached) */}
          {simStep === 3 && (
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #22C55E',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              animation: 'fadeIn 0.3s ease'
            }}>
              <ShieldCheck size={26} color="#16A34A" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#15803D' }}>
                  ✓ Arun (Worker #42) Dispatched!
                </div>
                <div style={{ fontSize: '11px', color: '#166534', marginTop: 1 }}>
                  1.4 km away in Besant Nagar • ETA 8 mins
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminMapScreen;
