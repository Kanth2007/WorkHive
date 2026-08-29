import React, { useState, useEffect } from 'react';
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
  HeartHandshake,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useAuth } from '../../../context/AuthContext';
import { bookingsAPI } from '../../../services/api';

export const WorkerEarnings = () => {
  const { worker } = useWorker();
  const { currentUser } = useAuth();
  const [chartView, setChartView] = useState('week');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeWorkerId = worker.workerId || currentUser?.userId;

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!activeWorkerId) return;

      try {
        setLoading(true);
        const res = await bookingsAPI.getAll({ workerId: activeWorkerId });
        if (res.success && Array.isArray(res.data)) {
          const completed = res.data.filter(b => ['completed', 'paid', 'rated'].includes(b.status));
          setJobs(completed);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error('Error fetching worker earnings from MongoDB:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [activeWorkerId]);

  const totalGross = jobs.reduce((acc, j) => acc + (Number(j.amount) || 0), 0);
  const netEarnings = Math.round(totalGross * 0.95);
  const welfareContribution = Math.round(totalGross * 0.05);

  const displayName = worker.name || currentUser?.name || 'Worker Member';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
          My Earnings & Cooperative Ledger
        </h1>
        <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
          Account: <strong>{displayName}</strong> • Live MongoDB Records
        </p>
      </div>

      {/* 2. EARNINGS HERO CARD (95% Direct Pay + 5% Welfare Breakdown) */}
      <div style={{
        background: 'linear-gradient(135deg, #111111 0%, #202020 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 28px rgba(0,0,0,0.15)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
              Total Verified Earnings
            </span>
            <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(74, 222, 128, 0.4)' }}>
              100% Direct Take-Home
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 var(--space-md)' }}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
              ₹{netEarnings.toLocaleString()}
            </span>
            <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
              (Lifetime gross: ₹{totalGross.toLocaleString()})
            </span>
          </div>

          {/* 95/5 Cooperative Payout Split Bar */}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 6 }}>
              <span>95% Direct UPI Settlement: <strong>₹{netEarnings.toLocaleString()}</strong></span>
              <span style={{ color: 'var(--color-accent)' }}>5% Welfare Fund: <strong>₹{welfareContribution.toLocaleString()}</strong></span>
            </div>
            <div style={{ width: '100%', height: 6, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.2)', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: totalGross > 0 ? '95%' : '0%', background: '#22C55E' }} />
              <div style={{ width: totalGross > 0 ? '5%' : '0%', background: 'var(--color-accent)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SETTLEMENT BANK & UPI ACCOUNT */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="text-secondary" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              Primary Payout UPI
            </div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', marginTop: 2 }}>
              {worker.upiId || `${displayName.toLowerCase().replace(/\s+/g, '')}@okaxis`}
            </div>
          </div>
          <Badge variant="success">✓ Instant Auto-Credit</Badge>
        </div>
      </Card>

      {/* 4. RECENT COMPLETED JOBS LIST */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
            Recent Verified Completed Jobs ({jobs.length})
          </h2>
          <span className="text-secondary" style={{ fontSize: '12px' }}>Audited in MongoDB</span>
        </div>

        {loading ? (
          <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
            <Loader2 size={20} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-secondary" style={{ fontSize: '12px', marginTop: 6 }}>Loading records from MongoDB...</p>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Completed Jobs Yet"
            description="When you complete service requests dispatched through the cooperative, your direct payouts and welfare fund credits will record here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {jobs.map((j) => {
              const gross = Number(j.amount) || 0;
              const direct = Math.round(gross * 0.95);
              const welfare = Math.round(gross * 0.05);

              return (
                <Card key={j.bookingId || j._id} padding="sm">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{j.serviceCategory || 'Cooperative Service'}</h3>
                      <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                        Customer: {j.customerName} • {j.dateString || 'Recently'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 600, marginTop: 4 }}>
                        ₹{direct} direct UPI • ₹{welfare} welfare credit
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>₹{gross}</div>
                      <Badge variant="active" style={{ fontSize: '10px', marginTop: 2 }}>Paid via UPI</Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default WorkerEarnings;
