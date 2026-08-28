import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  ArrowDownLeft,
  Download,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Info,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useDemoStore } from '../../../context/DemoStoreContext';

export const WorkerEarnings = () => {
  const { workerStats } = useDemoStore();
  // Chart tab state: 'week' | 'month'
  const [chartView, setChartView] = useState('week');

  // 7-day data (Mon - Sun, today is Sat with dynamic earnings)
  const weekData = [
    { day: 'Mon', amount: 1200, height: 50 },
    { day: 'Tue', amount: 1450, height: 60 },
    { day: 'Wed', amount: 1100, height: 45 },
    { day: 'Thu', amount: 1600, height: 65 },
    { day: 'Fri', amount: 1220, height: 52 },
    { day: 'Sat', amount: workerStats.todayEarnings, height: 100, isToday: true },
    { day: 'Sun', amount: 0, height: 8, isOff: true }
  ];


  // Recent completed jobs
  const completedJobs = [
    {
      id: 'JOB-901',
      date: 'Today, 4:45 PM',
      service: 'Plumbing & Pipe Repair (Washbasin & Valve)',
      customer: 'Meera Krishnan (Adyar)',
      amount: '₹380',
      payoutSplit: '₹342 directly paid • ₹38 welfare fund',
      status: 'Paid via UPI'
    },
    {
      id: 'JOB-900',
      date: 'Today, 2:15 PM',
      service: 'Electrician (Ceiling Fan & Switchboard)',
      customer: 'Anand Sundaram (Besant Nagar)',
      amount: '₹450',
      payoutSplit: '₹405 directly paid • ₹45 welfare fund',
      status: 'Paid via UPI'
    },
    {
      id: 'JOB-899',
      date: 'Today, 11:30 AM',
      service: 'Light Fitting & Modular Sockets',
      customer: 'Kavita Raman (Kasturba Nagar)',
      amount: '₹350',
      payoutSplit: '₹315 directly paid • ₹35 welfare fund',
      status: 'Paid via UPI'
    },
    {
      id: 'JOB-898',
      date: 'Today, 9:00 AM',
      service: 'MCB Tripping Diagnostic & Repair',
      customer: 'Deepak Shah (Thiruvanmiyur)',
      amount: '₹670',
      payoutSplit: '₹603 directly paid • ₹67 welfare fund',
      status: 'Paid via Cash'
    },
    {
      id: 'JOB-895',
      date: 'Yesterday, 5:30 PM',
      service: 'Inverter Battery Setup',
      customer: 'Suresh Kumar (Ward 4)',
      amount: '₹550',
      payoutSplit: '₹495 directly paid • ₹55 welfare fund',
      status: 'Paid via UPI'
    },
    {
      id: 'JOB-894',
      date: '27 Aug 2026, 3:00 PM',
      service: 'Water Tank Float Valve Repair',
      customer: 'Ravi Shankar (Gandhi Nagar)',
      amount: '₹420',
      payoutSplit: '₹378 directly paid • ₹42 welfare fund',
      status: 'Paid via UPI'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
          My Earnings
        </h1>
        <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
          Daily direct settlements with 0% platform commission
        </p>
      </div>

      {/* 2. THREE SUMMARY NUMBERS (LARGE, EASY-TO-READ STAT CARDS) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        
        {/* Today's Big Highlight Card */}
        <Card padding="md" style={{ background: 'var(--color-black)', color: 'var(--color-white)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#BBB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                TODAY'S EARNINGS
              </span>
              <div style={{ fontSize: '34px', fontWeight: 'bold', color: 'var(--color-white)', margin: '4px 0 2px' }}>
                ₹{workerStats.todayEarnings.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#00E676', fontWeight: 600 }}>
                ✓ {workerStats.completedJobsToday} jobs completed & settled
              </div>
            </div>

            <Badge variant="success">
              Settled Today
            </Badge>
          </div>
        </Card>

        {/* 2-Column Grid for This Week and This Month */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
          <Card padding="md">
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              THIS WEEK
            </span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
              ₹{workerStats.weekEarnings.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
              +14% vs last week
            </div>
          </Card>

          <Card padding="md">
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              THIS MONTH
            </span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
              ₹{workerStats.monthEarnings.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
              Direct Bank Settlement
            </div>
          </Card>
        </div>
      </div>

      {/* 3. SIMPLE 7-DAY BAR CHART */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>
              Weekly Earnings Trend
            </h2>
            <p className="text-secondary" style={{ fontSize: '11px', margin: '2px 0 0' }}>
              Total: ₹8,420 • Daily average: ₹1,403
            </p>
          </div>

          <Badge variant="active" style={{ fontSize: '11px' }}>
            Sat: ₹1,850 Peak
          </Badge>
        </div>

        {/* Bar Chart Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '140px',
          padding: '10px 4px 0',
          borderBottom: '1px solid var(--color-border)'
        }}>
          {weekData.map((d) => (
            <div
              key={d.day}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                gap: 6
              }}
            >
              {/* Amount Label on top */}
              <span style={{
                fontSize: '10px',
                fontWeight: d.isToday ? 'bold' : 500,
                color: d.isToday ? 'var(--color-accent)' : 'var(--color-text-secondary)'
              }}>
                {d.amount > 0 ? `₹${d.amount}` : '-'}
              </span>

              {/* Bar Pillar */}
              <div
                style={{
                  width: '28px',
                  height: `${d.height}px`,
                  borderRadius: '4px 4px 0 0',
                  background: d.isToday
                    ? 'var(--color-accent)'
                    : (d.isOff ? 'var(--color-border)' : 'var(--color-black)'),
                  transition: 'height 0.3s ease',
                  position: 'relative'
                }}
              >
                {d.isToday && (
                  <div style={{
                    position: 'absolute',
                    top: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    boxShadow: '0 0 0 2px white'
                  }} />
                )}
              </div>

              {/* Day Label at bottom */}
              <span style={{
                fontSize: '11px',
                fontWeight: d.isToday ? 'bold' : 600,
                color: d.isToday ? 'var(--color-black)' : 'var(--color-text-secondary)',
                marginTop: 2
              }}>
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. PLAIN-LANGUAGE BREAKDOWN BOX (TWO-SEGMENT 90% / 10% HORIZONTAL BAR) */}
      <Card padding="md" style={{ border: '1.5px solid var(--color-border)', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
          <HeartHandshake size={18} color="var(--color-accent)" />
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>
            Transparent Wage Distribution
          </h2>
        </div>

        {/* Clear Plain-Language Breakdown Quotes */}
        <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#333', marginBottom: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-black)' }} />
            <span><strong>You keep 90% of every job</strong> (instant direct payout).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)' }} />
            <span><strong>10% goes into your Welfare Fund</strong> (insurance you can claim later).</span>
          </div>
        </div>

        {/* Two-Segment Horizontal Bar (90% / 10%) */}
        <div style={{
          width: '100%',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          display: 'flex',
          margin: 'var(--space-xs) 0 var(--space-xs)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          {/* 90% Segment */}
          <div style={{
            width: '90%',
            background: 'var(--color-black)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.3px'
          }}>
            90% Direct to You
          </div>

          {/* 10% Segment */}
          <div style={{
            width: '10%',
            background: 'var(--color-accent)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold'
          }} title="10% Welfare Fund">
            10%
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          <span>₹0 platform broker fee</span>
          <span>Accumulated Welfare: <strong>₹{workerStats.welfareBalance.toLocaleString()}</strong></span>
        </div>
      </Card>

      {/* 5. SCROLLABLE LIST OF RECENT COMPLETED JOBS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
            Recent Completed Jobs
          </h2>
          <span className="text-secondary" style={{ fontSize: '12px' }}>
            {workerStats.recentJobs.length} Settled Requests
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {workerStats.recentJobs.map((job) => (
            <Card key={job.id} padding="sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: 'var(--space-xs)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-black)' }}>
                    {job.service}
                  </div>
                  <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                    {job.customer} • {job.date}
                  </div>
                  <div style={{ fontSize: '11px', color: '#166534', marginTop: 2 }}>
                    ₹{job.earned} directly paid (90%) • ₹{job.welfare} welfare fund (10%)
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '17px', fontWeight: 'bold', color: 'var(--color-success)' }}>
                    ₹{job.gross || job.earned}
                  </div>
                  <Badge variant="success" style={{ fontSize: '10px', marginTop: 2 }}>
                    Settled
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>


    </div>
  );
};

export default WorkerEarnings;
