import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Star,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useDemoStore } from '../../../context/DemoStoreContext';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminStats } = useDemoStore();

  // SOS state: hasActiveSOS toggle for demo
  const [hasActiveSOS, setHasActiveSOS] = useState(true);
  const [sosResolved, setSosResolved] = useState(false);


  // 30-day mock service demand line points
  const linePoints = [
    180, 210, 195, 230, 260, 240, 280, 310, 290, 320,
    305, 340, 360, 350, 375, 390, 370, 385, 410, 400,
    420, 390, 405, 415, 430, 410, 425, 415, 420, 428
  ];
  const maxPoint = 450;
  const minPoint = 150;

  // Generate SVG path for smoothed line
  const svgWidth = 500;
  const svgHeight = 160;
  const pathD = linePoints
    .map((val, idx) => {
      const x = (idx / (linePoints.length - 1)) * svgWidth;
      const y = svgHeight - ((val - minPoint) / (maxPoint - minPoint)) * (svgHeight - 30) - 15;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  // 1. Worker Earnings Distribution Data
  const earningsData = [
    { bracket: '< ₹15k', count: 112, percent: 12 },
    { bracket: '₹15k–₹25k', count: 320, percent: 34 },
    { bracket: '₹25k–₹35k', count: 364, percent: 39 },
    { bracket: '₹35k–₹50k', count: 108, percent: 12 },
    { bracket: '> ₹50k', count: 33, percent: 3 }
  ];

  // 2. Service Distribution by Area/Zone Data
  const zoneData = [
    { zone: 'Adyar (Ward 4)', jobs: 142, share: 33 },
    { zone: 'Besant Nagar', jobs: 98, share: 23 },
    { zone: 'Mylapore', jobs: 86, share: 20 },
    { zone: 'Velachery', jobs: 64, share: 15 },
    { zone: 'Thiruvanmiyur', jobs: 38, share: 9 }
  ];

  // 3. Worker Rating Distribution Data
  const ratingData = [
    { stars: '5 Stars', percent: 78, count: '973 workers' },
    { stars: '4 Stars', percent: 16, count: '200 workers' },
    { stars: '3 Stars', percent: 4, count: '50 workers' },
    { stars: '2 Stars', percent: 1.5, count: '19 workers' },
    { stars: '1 Star', percent: 0.5, count: '6 workers' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP 5 STAT CARDS IN A ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'var(--space-md)'
      }}>
        
        {/* Stat 1: Total Workers */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-black)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              WORKERS
            </span>
            <Users size={18} color="var(--color-text-secondary)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {adminStats.totalWorkers.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            +24 new this month
          </div>
        </Card>

        {/* Stat 2: Active Workers */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              ACTIVE WORKERS
            </span>
            <UserCheck size={18} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {adminStats.activeWorkers.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            75% live deployment
          </div>
        </Card>

        {/* Stat 3: Today's Jobs */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              TODAY'S JOBS
            </span>
            <Briefcase size={18} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-accent)' }}>
            {adminStats.todayJobs.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Live cooperative volume
          </div>
        </Card>

        {/* Stat 4: Completed */}
        <Card padding="md" style={{ borderLeft: '4px solid #1E8E3E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              COMPLETED
            </span>
            <CheckCircle2 size={18} color="#1E8E3E" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: '#1E8E3E' }}>
            {adminStats.completedJobs.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            Live resolution counter
          </div>
        </Card>

        {/* Stat 5: Pending */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              PENDING
            </span>
            <Clock size={18} color="var(--color-text-secondary)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {adminStats.pendingJobs.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            En route & in progress
          </div>
        </Card>


      </div>

      {/* 2. PROMINENT "🚨 SOS ALERTS" CORNER CARD / PANEL */}
      <Card padding="md" style={{
        border: hasActiveSOS && !sosResolved ? '2px solid var(--color-danger)' : '1px solid var(--color-border)',
        background: hasActiveSOS && !sosResolved ? '#FFFDFD' : 'var(--color-white)',
        boxShadow: hasActiveSOS && !sosResolved ? '0 4px 16px rgba(217, 48, 37, 0.12)' : 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: hasActiveSOS && !sosResolved ? 'var(--color-danger)' : 'var(--color-bg)',
              color: hasActiveSOS && !sosResolved ? 'white' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0, color: hasActiveSOS && !sosResolved ? 'var(--color-danger)' : 'var(--color-black)' }}>
                🚨 Live Operations SOS Safety Feed
              </h2>
              <span className="text-secondary" style={{ fontSize: '12px' }}>
                Automated safety dispatch monitoring for women workers & high-risk emergency requests
              </span>
            </div>
          </div>

          {/* Dev Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setHasActiveSOS(!hasActiveSOS);
              setSosResolved(false);
            }}
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {hasActiveSOS ? 'Simulate Normal State (No SOS)' : 'Simulate Live SOS Alert'}
          </button>
        </div>

        {/* SOS Feed Content */}
        {hasActiveSOS && !sosResolved ? (
          <div style={{
            background: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-md)'
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--color-danger)',
                animation: 'pulse 1s infinite',
                marginTop: 6
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Badge variant="danger" style={{ fontSize: '11px' }}>
                    🚨 WOMEN WORKER SAFETY SOS TRIGGERED
                  </Badge>
                  <span style={{ fontSize: '12px', color: 'var(--color-danger)', fontWeight: 'bold' }}>
                    2 min ago (Live)
                  </span>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 'bold', margin: '4px 0 2px' }}>
                  Sunita Shinde (Caregiver • Member ID #CLC-CG-108)
                </div>

                <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} color="var(--color-danger)" />
                  <span>Ward 4, Adyar 3rd Cross Road (Near Apollo Clinic)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <a href="tel:112">
                <Button variant="danger" icon={PhoneCall}>
                  Call Support Now (112)
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={() => {
                  alert('Ward 4 Emergency Response Team dispatched to Adyar 3rd Cross Road.');
                  setSosResolved(true);
                }}
              >
                Dispatch Ward Officer
              </Button>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--color-success)',
            fontWeight: 600,
            fontSize: '13px'
          }}>
            <CheckCircle2 size={18} />
            <span>✓ No active SOS alerts — All cooperative field operations running safely</span>
          </div>
        )}
      </Card>

      {/* 3. 2x2 GRID OF CHART CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        
        {/* Chart 1: 📈 Service Demand (Line Chart, Last 30 Days) */}
        <Card padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={18} color="var(--color-accent)" />
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                  Service Demand Trend
                </h3>
              </div>
              <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                Daily completed booking volume (Last 30 Days)
              </p>
            </div>

            <Badge variant="active" style={{ fontSize: '11px' }}>
              Peaked at 428/day
            </Badge>
          </div>

          {/* SVG Smoothed Line Chart */}
          <div style={{ width: '100%', height: '170px', position: 'relative' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2={svgWidth} y2="30" stroke="var(--color-border)" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2={svgWidth} y2="80" stroke="var(--color-border)" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2={svgWidth} y2="130" stroke="var(--color-border)" strokeDasharray="3 3" />

              {/* Area */}
              <path d={areaD} fill="url(#demandGradient)" />

              {/* Line */}
              <path d={pathD} fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />

              {/* Peak Indicator Point */}
              <circle cx={svgWidth} cy={svgHeight - ((428 - minPoint) / (maxPoint - minPoint)) * (svgHeight - 30) - 15} r="5" fill="var(--color-accent)" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            <span>Day 1 (180 jobs)</span>
            <span>Day 15 (360 jobs)</span>
            <span>Today (428 jobs)</span>
          </div>
        </Card>

        {/* Chart 2: 📊 Worker Earnings Distribution (Bar Chart) */}
        <Card padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={18} color="var(--color-black)" />
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                  Monthly Worker Wage Distribution
                </h3>
              </div>
              <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                Average monthly take-home earnings per active worker
              </p>
            </div>

            <Badge variant="success" style={{ fontSize: '11px' }}>
              ₹28,450 Avg/Mo
            </Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {earningsData.map((e) => (
              <div key={e.bracket} style={{ fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{e.bracket}</span>
                  <span className="text-secondary">{e.count} workers ({e.percent}%)</span>
                </div>
                <div style={{
                  width: '100%',
                  height: 12,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-bg)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${e.percent * 2.2}%`,
                    background: 'var(--color-black)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart 3: 📍 Service Distribution by Zone/Area */}
        <Card padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={18} color="var(--color-accent)" />
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                  Service Distribution by Ward & Zone
                </h3>
              </div>
              <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                Booking density across cooperative operational zones
              </p>
            </div>

            <span className="text-secondary" style={{ fontSize: '12px' }}>
              428 Active Total
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {zoneData.map((z) => (
              <div key={z.zone} style={{ fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontWeight: 'bold' }}>{z.zone}</span>
                  <span><strong>{z.jobs} jobs</strong> ({z.share}%)</span>
                </div>
                <div style={{
                  width: '100%',
                  height: 12,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-bg)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${z.share * 2.6}%`,
                    background: 'var(--color-accent)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart 4: ⭐ Worker Ratings Distribution */}
        <Card padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={18} color="#FFB800" fill="#FFB800" />
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                  Worker Rating Distribution
                </h3>
              </div>
              <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                Quality feedback scores submitted by verified customers
              </p>
            </div>

            <Badge variant="success" style={{ fontSize: '11px' }}>
              4.82 Overall Avg
            </Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ratingData.map((r) => (
              <div key={r.stars} style={{ fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{r.stars}</span>
                  <span className="text-secondary">{r.count} ({r.percent}%)</span>
                </div>
                <div style={{
                  width: '100%',
                  height: 12,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-bg)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${r.percent}%`,
                    background: r.stars.includes('5') ? '#1E8E3E' : (r.stars.includes('4') ? '#00E676' : 'var(--color-accent)'),
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};

export default AdminDashboard;
