import React, { useState, useEffect } from 'react';
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
  Bell,
  Sparkles
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useAuth } from '../../../context/AuthContext';
import { useDemoStore } from '../../../context/DemoStoreContext';
import { bookingsAPI } from '../../../services/api';

export const WorkerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { worker, toggleAvailability } = useWorker();
  const { currentUser } = useAuth();
  const { activeBooking, workerStats, updateBookingStatus } = useDemoStore();

  const isOnline = worker.isOnline;
  const [toast, setToast] = useState(location.state?.toastMessage || null);
  const [pendingJob, setPendingJob] = useState(null);
  const [workerJobsCount, setWorkerJobsCount] = useState(worker.completedJobs || 0);

  useEffect(() => {
    const fetchIncomingAndStats = async () => {
      try {
        const activeWorkerId = worker.workerId || currentUser?.userId;
        if (!activeWorkerId) return;

        const res = await bookingsAPI.getAll({ workerId: activeWorkerId });
        if (res.success && Array.isArray(res.data)) {
          const pending = res.data.find(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'in_progress');
          if (pending) {
            setPendingJob({
              id: pending.bookingId || pending._id,
              customerName: pending.customerName,
              customerPhone: pending.customerPhone,
              serviceCategory: pending.serviceCategory,
              serviceDetails: pending.serviceDetails,
              customerAddress: pending.customerAddress,
              amount: pending.amount,
              status: pending.status,
              arrivalPin: pending.arrivalPin
            });
          } else {
            // If activeBooking in demo store belongs to this worker, show it
            if (activeBooking && (activeBooking.workerId === activeWorkerId || !activeBooking.workerId)) {
              setPendingJob(activeBooking);
            } else {
              setPendingJob(null);
            }
          }
          const completed = res.data.filter(b => ['completed', 'paid', 'rated'].includes(b.status));
          setWorkerJobsCount(completed.length);
        }
      } catch (err) {
        console.warn('Worker dashboard DB sync warning:', err.message);
      }
    };

    fetchIncomingAndStats();
  }, [worker.workerId, currentUser?.userId, activeBooking]);

  const incomingJob = pendingJob;

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
              • {worker.locality || 'Ward 4'} ({worker.societyReg || '#TN-CHE-COOP-HQ-001'})
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
            color: worker.verificationStatus === 'verified' ? 'var(--color-success)' : 'var(--color-accent)',
            fontWeight: 'bold',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={14} />
          <span>{worker.verificationStatus === 'verified' ? '✓ Verified Member' : 'Pending Verification'}</span>
        </button>
      </div>

      {/* 3. TOP SUMMARY CARDS */}
      <div className="ss-stat-grid">

        {/* Card 1: Today's Jobs */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>ACTIVE TRADE</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {worker.skill || currentUser?.skill || 'General'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            {worker.name || currentUser?.name || 'Worker'}
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
            {workerJobsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Audited in MongoDB
          </div>
        </Card>

        {/* Card 4: Rating */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>MEMBER RATING</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {worker.rating ? `${worker.rating} ⭐` : '5.0 ⭐'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            Top Member in Ward 4
          </div>
        </Card>
      </div>

      {/* 4. PROMINENT NEW JOB REQUEST BANNER / CARD (WHEN ONLINE & AVAILABLE) */}
      {isOnline && incomingJob ? (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Badge variant="danger" style={{ marginBottom: 6 }}>
                  🚨 ACTION REQUIRED • {incomingJob.serviceCategory || 'Service Request'}
                </Badge>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px' }}>
                  {incomingJob.serviceDetails || incomingJob.serviceCategory}
                </h3>
                <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                  Customer: <strong>{incomingJob.customerName}</strong>
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  ₹{incomingJob.amount}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                  90% Direct Pay (₹{Math.round(incomingJob.amount * 0.9)})
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              margin: 'var(--space-md) 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={16} color="var(--color-accent)" />
                <span>{incomingJob.customerAddress}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} />
                <span>Immediate service requested</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <Button
                variant="primary"
                fullWidth
                icon={Navigation}
                onClick={() => {
                  updateBookingStatus('accepted');
                  navigate(`/worker/job-management/${incomingJob.id}`);
                }}
              >
                Accept & Start Job
              </Button>
            </div>
          </Card>
        </div>
      ) : isOnline ? (
        <Card padding="md" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', textAlign: 'center', padding: '24px' }}>
          <Radio size={28} color="#16A34A" style={{ margin: '0 auto 8px', display: 'block' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#166534', margin: 0 }}>
            You are Online in {worker.locality || 'Ward 4'}
          </h3>
          <p style={{ fontSize: '12px', color: '#15803D', margin: '4px 0 0' }}>
            Ready and waiting for customer dispatches. New booking requests will appear here in real-time.
          </p>
        </Card>
      ) : null}

    </div>
  );
};

export default WorkerDashboard;
