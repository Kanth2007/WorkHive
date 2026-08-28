import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Star,
  Zap,
  PhoneCall,
  Radio,
  Sliders,
  AlertCircle,
  Bell
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useDemoStore } from '../../../context/DemoStoreContext';

export const WorkerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { worker, toggleAvailability } = useWorker();
  const { activeBooking, workerStats, updateBookingStatus } = useDemoStore();

  // Local online state synced with WorkerContext
  const isOnline = worker.isOnline;

  const [toast, setToast] = useState(location.state?.toastMessage || null);

  // Dynamic incoming job state derived from live demo store if present
  const incomingJob = activeBooking || {
    id: 'REQ-8821',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98401 23456',
    serviceCategory: 'Plumbing & Pipe Repair',
    serviceDetails: 'Kitchen pipe leakage under sink & tap replacement',
    customerAddress: 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar (1.8 km)',
    amount: 450,
    status: 'pending'
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Toast message if present */}
      {toast && (
        <div style={{
          background: 'var(--color-black)',
          color: 'white',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            style={{ color: 'var(--color-accent)', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* 1. BIG OBVIOUS ONLINE / OFFLINE TOGGLE SWITCH AT TOP */}
      <Card padding="md" style={{
        background: isOnline ? '#F9FFF9' : '#F5F5F5',
        border: `1.5px solid ${isOnline ? 'var(--color-success)' : 'var(--color-border)'}`,
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: isOnline ? '#00E676' : '#9E9E9E',
              boxShadow: isOnline ? '0 0 0 4px rgba(0, 230, 118, 0.25)' : 'none'
            }} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--color-black)' }}>
                {isOnline ? 'You are Online' : 'You are Offline'}
              </h2>
              <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                {isOnline ? 'Ready to accept nearby customer requests' : 'On break • No new requests will arrive'}
              </p>
            </div>
          </div>

          {/* Big Toggle Switch */}
          <button
            type="button"
            onClick={toggleAvailability}
            style={{
              width: 60,
              height: 34,
              borderRadius: 'var(--radius-full)',
              background: isOnline ? 'var(--color-success)' : '#D0D0D0',
              position: 'relative',
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.25s ease',
              padding: 3
            }}
            title="Toggle Online / Offline status"
            aria-label="Toggle Online/Offline"
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: 3,
              left: isOnline ? 29 : 3,
              transition: 'left 0.25s ease',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              color: isOnline ? 'var(--color-success)' : '#757575'
            }}>
              {isOnline ? 'ON' : 'OFF'}
            </div>
          </button>

        </div>
      </Card>

      {/* 2. COOPERATIVE AFFILIATION LINE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-black)'
          }}>
            <Building2 size={16} />
          </div>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Chennai Labour Cooperative
            </span>
            <span className="text-secondary" style={{ fontSize: '11px', marginLeft: 6 }}>
              • Ward 4 (#CLC-EL-402)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/worker/verification')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontSize: '11px',
            color: 'var(--color-success)',
            fontWeight: 'bold',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={14} />
          <span>✓ Verified</span>
        </button>
      </div>

      {/* 3. TOP SUMMARY CARDS (Responsive 4-col desktop, 2-col mobile) */}
      <div className="ss-stat-grid">

        {/* Card 1: Today's Jobs */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>TODAY'S JOBS</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {workerStats.completedJobsToday}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            ✓ {workerStats.completedJobsToday} completed today
          </div>
        </Card>

        {/* Card 2: Today's Earnings */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>TODAY'S EARNINGS</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            ₹{workerStats.todayEarnings.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600 }}>
            100% Direct Payout
          </div>
        </Card>

        {/* Card 3: Completed Jobs */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>COMPLETED JOBS</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            127
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Lifetime cooperative jobs
          </div>
        </Card>

        {/* Card 4: Rating */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>MEMBER RATING</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            4.8 ⭐
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            Top 5% in Adyar Ward
          </div>
        </Card>
      </div>

      {/* 4. PROMINENT NEW JOB REQUEST BANNER / CARD (WHEN ONLINE & AVAILABLE) */}
      {isOnline && incomingJob && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-danger)',
                animation: 'pulse 1.2s infinite'
              }} />
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-danger)' }}>
                ⚡ New Job Request Available!
              </h2>
            </div>
            <Badge variant="danger" style={{ fontSize: '11px' }}>
              Instant Dispatch
            </Badge>
          </div>

          <Card padding="md" style={{
            border: '2px solid var(--color-accent)',
            boxShadow: '0 4px 16px rgba(255, 106, 0, 0.15)',
            background: '#FFFDFB'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Badge variant="active" style={{ marginBottom: 4 }}>
                  ⚡ Smart Match Assigned
                </Badge>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '2px 0' }}>
                  {incomingJob.serviceCategory || 'Plumbing & Pipe Repair'}
                </h3>
                <div className="text-secondary" style={{ fontSize: '13px' }}>
                  Customer: <strong>{incomingJob.customerName || 'Priya Sundaram'}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  ₹{incomingJob.amount || 450}
                </div>
                <span className="text-secondary" style={{ fontSize: '11px' }}>Fixed Wage</span>
              </div>
            </div>

            {/* Location & Time Snippet */}
            <div style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              margin: 'var(--space-sm) 0',
              fontSize: '13px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={15} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <span>{incomingJob.customerAddress || 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={15} style={{ flexShrink: 0 }} />
                <span>Immediate / ASAP (within 30 mins)</span>
              </div>
            </div>

            {/* Problem note snippet */}
            <p style={{ fontSize: '13px', color: '#444', margin: '0 0 var(--space-md)', lineHeight: 1.4 }}>
              <strong>Problem:</strong> {incomingJob.serviceDetails || 'Kitchen pipe leakage under sink'}
            </p>

            {/* Action Buttons: View Details & Instant Accept */}
            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <Button
                variant="primary"
                size="large"
                icon={ArrowRight}
                iconPosition="right"
                fullWidth
                onClick={() => {
                  updateBookingStatus('accepted');
                  navigate(`/worker/job-management/${incomingJob.id || 'BK-1048'}`);
                }}
              >
                Accept Job (₹{incomingJob.amount || 450})
              </Button>
            </div>
          </Card>
        </div>
      )}


      {/* If Offline Banner */}
      {!isOnline && (
        <Card padding="lg" style={{ textAlign: 'center', background: '#FAFAFA' }}>
          <Radio size={32} color="#9E9E9E" style={{ margin: '0 auto 8px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px' }}>
            You are currently offline
          </h3>
          <p className="text-secondary" style={{ fontSize: '13px', margin: '0 0 var(--space-md)' }}>
            Switch the toggle above to <strong>Online</strong> when you're ready to receive customer booking requests.
          </p>
          <Button
            variant="primary"
            size="small"
            onClick={toggleAvailability}
          >
            Go Online Now
          </Button>
        </Card>
      )}

      {/* 5. COOPERATIVE WELFARE & SAFETY NOTICE */}
      <div style={{
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }}>
        <ShieldCheck size={26} color="#16A34A" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#166534' }}>
            ₹5,00,000 On-Duty Insurance Active
          </div>
          <div className="text-secondary" style={{ fontSize: '12px' }}>
            Nominee: Sunita Patil (Spouse) • Chennai Labour Cooperative Welfare Scheme.
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/worker/welfare')}
          style={{ fontSize: '11px', color: '#166534', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          View &gt;
        </button>
      </div>

    </div>
  );
};

export default WorkerDashboard;
