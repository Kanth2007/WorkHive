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
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useAuth } from '../../../context/AuthContext';
import { useDemoStore } from '../../../context/DemoStoreContext';
import { bookingsAPI, workersAPI } from '../../../services/api';

export const WorkerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { worker, toggleAvailability } = useWorker();
  const { currentUser } = useAuth();
  const { activeBooking, updateBookingStatus } = useDemoStore();

  const isOnline = worker.isOnline;
  const [toast, setToast] = useState(location.state?.toastMessage || null);
  const [pendingJob, setPendingJob] = useState(null);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [liveWorker, setLiveWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeWorkerId = worker.workerId || currentUser?.userId;

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!activeWorkerId) return;

      try {
        setLoading(true);

        // 1. Fetch live worker profile to get ratings and reviews from MongoDB
        try {
          const workerRes = await workersAPI.getById(activeWorkerId);
          if (workerRes.success && workerRes.data) {
            setLiveWorker(workerRes.data);
          }
        } catch (wErr) {
          console.warn('Worker profile live fetch warning:', wErr.message);
        }

        // 2. Fetch live bookings
        const res = await bookingsAPI.getAll({ workerId: activeWorkerId });
        const pending = res.data.find(b => ['pending', 'accepted', 'in_progress', 'on_the_way', 'arrived', 'working'].includes(b.status));
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
          setPendingJob(null);
        }

        const completed = res.data.filter(b => ['completed', 'paid', 'rated'].includes(b.status));
        setCompletedJobsCount(completed.length);
        const earned = Math.round(completed.reduce((sum, b) => sum + (Number(b.amount) || 0), 0) * 0.9);
        setTodayEarnings(earned);
      } catch (err) {
        console.warn('Worker dashboard live fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [activeWorkerId, activeBooking]);

  const displayName = liveWorker?.name || worker.name || currentUser?.name || 'Worker Member';
  const displaySkill = liveWorker?.skill || worker.skill || currentUser?.skill || 'General Services';
  const displayLocality = liveWorker?.locality || worker.locality || currentUser?.locality || 'Ward 4, Chennai';
  const currentRating = liveWorker?.rating ?? worker.rating;
  const reviewsCount = liveWorker?.reviewsCount ?? (liveWorker?.reviews?.length || 0);
  const displayRating = currentRating ? `${currentRating} ⭐` : '5.0 ⭐';
  const recentReviews = liveWorker?.reviews || [];

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
                {isOnline ? `Ready to accept nearby customer requests in ${displayLocality}` : 'On break • No new requests will arrive'}
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
              Chennai Labour Cooperative Society
            </span>
            <span className="text-secondary" style={{ fontSize: '11px', marginLeft: 6 }}>
              • {displayLocality}
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
          <span>{worker.verificationStatus === 'verified' ? '✓ Verified Member' : 'Pending KYC'}</span>
        </button>
      </div>

      {/* 3. TOP SUMMARY CARDS (100% Dynamic from MongoDB) */}
      <div className="ss-stat-grid">

        {/* Card 1: Trade */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>ACTIVE TRADE</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {displaySkill}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            {displayName}
          </div>
        </Card>

        {/* Card 2: Today's Earnings */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>TOTAL EARNINGS</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            ₹{todayEarnings.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600 }}>
            100% Direct Payout
          </div>
        </Card>

        {/* Card 3: Completed Jobs */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>COMPLETED JOBS</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {completedJobsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Live MongoDB Records
          </div>
        </Card>

        {/* Card 4: Rating */}
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>MEMBER RATING</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {displayRating}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            Cooperative Member
          </div>
        </Card>
      </div>

      {/* 4. PROMINENT NEW JOB REQUEST BANNER / CARD (WHEN ONLINE & AVAILABLE) */}
      {isOnline && pendingJob && ['pending', 'accepted', 'in_progress', 'on_the_way', 'arrived', 'working'].includes(pendingJob.status) ? (
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
                  🚨 ACTION REQUIRED • {pendingJob.serviceCategory || 'Service Request'}
                </Badge>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px' }}>
                  {pendingJob.serviceDetails || pendingJob.serviceCategory}
                </h3>
                <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                  Customer: <strong>{pendingJob.customerName}</strong>
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  ₹{pendingJob.amount}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                  90% Direct Pay (₹{Math.round(pendingJob.amount * 0.9)})
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
                <span>{pendingJob.customerAddress}</span>
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
                  navigate(`/worker/job-management/${pendingJob.id}`);
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
            You are Online in {displayLocality}
          </h3>
          <p style={{ fontSize: '12px', color: '#15803D', margin: '4px 0 0' }}>
            Ready and waiting for customer dispatches. Real-time booking requests from MongoDB will appear here.
          </p>
        </Card>
      ) : (
        <Card padding="md" style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', textAlign: 'center', padding: '24px' }}>
          <Radio size={28} color="#94A3B8" style={{ margin: '0 auto 8px', display: 'block' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#475569', margin: 0 }}>
            You are Currently Offline
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
            Toggle the green Online switch above to start receiving customer job dispatches in {displayLocality}.
          </p>
        </Card>
      )}

      {/* 5. RECENT CUSTOMER REVIEWS & FEEDBACK */}
      {recentReviews.length > 0 && (
        <Card padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={18} color="#FFB800" fill="#FFB800" />
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Customer Reviews ({recentReviews.length})</h3>
            </div>
            <Badge variant="success" style={{ fontSize: '11px' }}>
              {displayRating} Average
            </Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {recentReviews.slice(0, 5).map((rev, idx) => (
              <div
                key={idx}
                style={{
                  borderBottom: idx < Math.min(recentReviews.length, 5) - 1 ? '1px solid var(--color-border)' : 'none',
                  paddingBottom: 'var(--space-xs)',
                  paddingTop: idx > 0 ? 'var(--space-xs)' : 0
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-black)' }}>
                      {rev.customerName || 'Customer Member'}
                    </span>
                    <span className="text-secondary" style={{ fontSize: '11px' }}>
                      • {rev.locality || 'Ward 4, Chennai'}
                    </span>
                  </div>
                  <span className="text-secondary" style={{ fontSize: '11px' }}>
                    {rev.date || 'Recent'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '2px 0 4px' }}>
                  <span style={{ color: '#FFB800', fontWeight: 'bold', fontSize: '13px' }}>
                    {'★'.repeat(Math.round(rev.rating || 5))}{'☆'.repeat(Math.max(0, 5 - Math.round(rev.rating || 5)))}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    ({rev.rating || 5}.0)
                  </span>
                </div>

                {rev.comment && (
                  <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.4, margin: '0 0 4px' }}>
                    "{rev.comment}"
                  </p>
                )}

                {Array.isArray(rev.compliments) && rev.compliments.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {rev.compliments.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        style={{
                          fontSize: '10px',
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-full)',
                          padding: '2px 8px',
                          color: 'var(--color-success)',
                          fontWeight: 600
                        }}
                      >
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
};

export default WorkerDashboard;
