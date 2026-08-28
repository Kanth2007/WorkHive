import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  BrainCircuit,
  MapPin,
  Send,
  CloudRain,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Users,
  ShieldCheck,
  Building2,
  Radio,
  ExternalLink
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';

export const DemandForecast = () => {
  const navigate = useNavigate();

  // Selected Category for chart
  const [selectedCategory, setSelectedCategory] = useState('Plumbing');
  const [toastMessage, setToastMessage] = useState(null);
  const [isNotified, setIsNotified] = useState(false);

  // 1. Next 7 Days Forecast Categories
  const categoryTrends = [
    {
      name: 'Plumbing',
      icon: '🔧',
      trend: 'up',
      percent: '23%',
      expectedJobs: '1,420 jobs',
      driver: 'Monsoon rainfall & tank overflow surge',
      color: '#FF6A00'
    },
    {
      name: 'Electrical',
      icon: '⚡',
      trend: 'up',
      percent: '14%',
      expectedJobs: '980 jobs',
      driver: 'High humidity load on MCB & voltage stabilizers',
      color: '#FF6A00'
    },
    {
      name: 'Caregiving',
      icon: '👩‍⚕️',
      trend: 'up',
      percent: '18%',
      expectedJobs: '740 jobs',
      driver: 'Post-operative & senior health support requests',
      color: '#FF6A00'
    },
    {
      name: 'Cleaning',
      icon: '🧹',
      trend: 'up',
      percent: '16%',
      expectedJobs: '690 jobs',
      driver: 'Post-rain waterlogging & deep sanitization',
      color: '#FF6A00'
    },
    {
      name: 'Technician',
      icon: '🔧',
      trend: 'up',
      percent: '11%',
      expectedJobs: '530 jobs',
      driver: 'Appliance drainage & washer repairs',
      color: '#FF6A00'
    },
    {
      name: 'Carpentry',
      icon: '🪚',
      trend: 'down',
      percent: '6%',
      expectedJobs: '310 jobs',
      driver: 'Seasonal dip in indoor renovations during monsoon',
      color: '#757575'
    },
    {
      name: 'Painting',
      icon: '🎨',
      trend: 'down',
      percent: '9%',
      expectedJobs: '220 jobs',
      driver: 'Rain delays exterior wall waterproofing works',
      color: '#757575'
    }
  ];

  // 2. Next 7 Days Forecast Chart Data for Plumbing
  const next7Days = [
    { day: 'Mon (1 Sep)', demand: 142, confidence: '96%' },
    { day: 'Tue (2 Sep)', demand: 155, confidence: '95%' },
    { day: 'Wed (3 Sep)', demand: 168, confidence: '94%' },
    { day: 'Thu (4 Sep)', demand: 182, confidence: '93%' },
    { day: 'Fri (5 Sep)', demand: 210, confidence: '92%' },
    { day: 'Sat (6 Sep)', demand: 245, confidence: '91%', isPeak: true },
    { day: 'Sun (7 Sep)', demand: 238, confidence: '90%', isPeak: true }
  ];

  // SVG dimensions for chart
  const svgWidth = 540;
  const svgHeight = 170;
  const maxVal = 260;
  const minVal = 120;

  const pathD = next7Days
    .map((d, idx) => {
      const x = (idx / (next7Days.length - 1)) * svgWidth;
      const y = svgHeight - ((d.demand - minVal) / (maxVal - minVal)) * (svgHeight - 35) - 15;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  const handleNotifyCoordinators = () => {
    setIsNotified(true);
    setToastMessage('📢 Broadcast sent! 12 standby cooperative plumbers alerted for North Chennai & Ward 4 depot.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER & TOAST */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
              Predictive Demand Forecast
            </h1>
            <Badge variant="active" style={{ fontSize: '11px' }}>
              AI Engine v2.4 Active
            </Badge>
          </div>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Cooperative workforce capacity planning based on weather models and historical booking telemetry
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: 'var(--color-success)', fontWeight: 'bold' }}>
          <BrainCircuit size={16} />
          <span>94.2% Prediction Accuracy</span>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          background: 'var(--color-black)',
          color: 'white',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. TOP: "NEXT 7 DAYS" FORECAST LIST PER CATEGORY */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              Next 7 Days Category Forecast
            </h2>
            <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
              Projected booking shifts across cooperative trades
            </p>
          </div>
          <span className="text-secondary" style={{ fontSize: '12px' }}>
            Period: 1 Sep – 7 Sep 2026
          </span>
        </div>

        {/* Categories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-xs)'
        }}>
          {categoryTrends.map((cat) => {
            const isUp = cat.trend === 'up';
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                  border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-black)' }}>
                      {cat.name}
                    </span>
                  </div>

                  {/* Trend Indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: isUp ? 'var(--color-accent)' : 'var(--color-text-secondary)'
                  }}>
                    {isUp ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    <span>{isUp ? `↑ ${cat.percent}` : `↓ ${cat.percent}`}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
                  <span className="text-secondary" style={{ fontSize: '11px' }}>{cat.expectedJobs}</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', maxWidth: '140px', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.driver}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. FORECASTED DEMAND CURVE FOR TOP CATEGORY (PLUMBING) OVER NEXT 7 DAYS */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '18px' }}>🔧</span>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                {selectedCategory} Demand Trajectory (Next 7 Days)
              </h2>
            </div>
            <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
              Projected daily requests peaking on weekend (Sat–Sun)
            </p>
          </div>

          <Badge variant="active" style={{ fontSize: '11px' }}>
            Weekend Peak: 245 jobs/day
          </Badge>
        </div>

        {/* SVG Forecast Chart */}
        <div style={{ width: '100%', height: '180px', position: 'relative' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="30" x2={svgWidth} y2="30" stroke="var(--color-border)" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2={svgWidth} y2="80" stroke="var(--color-border)" strokeDasharray="3 3" />
            <line x1="0" y1="130" x2={svgWidth} y2="130" stroke="var(--color-border)" strokeDasharray="3 3" />

            {/* Area Fill */}
            <path d={areaD} fill="url(#forecastGrad)" />

            {/* Line Curve */}
            <path d={pathD} fill="none" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" />

            {/* Data Points */}
            {next7Days.map((d, idx) => {
              const cx = (idx / (next7Days.length - 1)) * svgWidth;
              const cy = svgHeight - ((d.demand - minVal) / (maxVal - minVal)) * (svgHeight - 35) - 15;
              return (
                <g key={d.day}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={d.isPeak ? 6 : 4}
                    fill={d.isPeak ? 'var(--color-accent)' : 'var(--color-black)'}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill={d.isPeak ? 'var(--color-accent)' : 'var(--color-black)'}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {d.demand}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Days Axis */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 8 }}>
          {next7Days.map((d) => (
            <span key={d.day} style={{ fontWeight: d.isPeak ? 'bold' : 500, color: d.isPeak ? 'var(--color-black)' : 'inherit' }}>
              {d.day.split(' ')[0]}
            </span>
          ))}
        </div>
      </Card>

      {/* 4. "AI RECOMMENDATION" CARD (DISTINCTLY STYLED, ACCENT ICON, VISIBLE REASONING) */}
      <div style={{
        background: '#FFFDFB',
        border: '2px solid var(--color-accent)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        boxShadow: '0 6px 20px rgba(255, 106, 0, 0.1)'
      }}>
        
        {/* Recommendation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255, 106, 0, 0.15)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BrainCircuit size={26} strokeWidth={2.2} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                AI DISPATCH RECOMMENDATION
              </span>
              {/* Exact plain-language actionable sentence */}
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '2px 0 0', color: 'var(--color-black)' }}>
                Deploy 12 additional plumbers in North Chennai during the weekend.
              </h2>
            </div>
          </div>

          <Badge variant="active" style={{ fontSize: '11px' }}>
            Action Required
          </Badge>
        </div>

        {/* Visible AI Reasoning Breakdown */}
        <div style={{
          background: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Why This Recommendation? (Transparent AI Reasoning)
          </span>

          {/* Factor 1: Weather Telemetry */}
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'flex-start', fontSize: '13px' }}>
            <CloudRain size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Meteorological Forecast: </strong>
              <span>Heavy coastal showers (45–65 mm) predicted Fri–Sun, historically generating a 3.4x spike in water tank overflow and drainage blockage requests.</span>
            </div>
          </div>

          {/* Factor 2: Historical Society Data */}
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'flex-start', fontSize: '13px' }}>
            <Calendar size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Historical Cooperative Records: </strong>
              <span>August 2024 & 2025 society logs show a +28% surge in emergency plumbing calls across North Chennai & Ward 4 zones during monsoon weekends.</span>
            </div>
          </div>

          {/* Factor 3: Current Capacity Deficit */}
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'flex-start', fontSize: '13px' }}>
            <Users size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Workforce Capacity Gap: </strong>
              <span>Currently only 18 active plumbers are scheduled for Saturday. 30 are required to maintain a &lt;15 min emergency arrival response.</span>
            </div>
          </div>
        </div>

        {/* Actions Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          
          {/* Link to Affected Zone on Map */}
          <button
            type="button"
            onClick={() => navigate('/admin/bookings')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '13px',
              color: 'var(--color-accent)',
              fontWeight: 'bold',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <MapPin size={15} />
            <span>View affected zone on map (North Chennai & Ward 4) &gt;</span>
          </button>

          {/* Notify Cooperative Coordinators Button */}
          <Button
            variant="primary"
            icon={Send}
            onClick={handleNotifyCoordinators}
            disabled={isNotified}
          >
            {isNotified ? '✓ Coordinators Notified' : 'Notify Cooperative Coordinators'}
          </Button>

        </div>

      </div>

    </div>
  );
};

export default DemandForecast;
