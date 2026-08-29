import React, { useState, useEffect } from 'react';
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
  BellRing,
  Loader2,
  HeartHandshake
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { adminAPI, bookingsAPI, workersAPI, complaintsAPI } from '../../../services/api';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalWorkers: 0,
    activeWorkers: 0,
    todayJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    totalEarningsDistributed: 0,
    welfareFundBalance: 0,
    coopSurplus: 0
  });

  const [emergencyBookings, setEmergencyBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.allSettled([
        adminAPI.getStats(),
        bookingsAPI.getAll()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && Array.isArray(bookingsRes.value.data)) {
        const all = bookingsRes.value.data;
        const emergencies = all.filter(b => b.isEmergency && ['pending', 'accepted', 'in_progress'].includes(b.status));
        setEmergencyBookings(emergencies);
        setRecentBookings(all.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching admin dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDashboard();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 0. QUICK ACTIONS BAR */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-sm)',
        background: 'var(--color-white)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)'
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--color-black)' }}>
            District Operations Overview
          </h1>
          <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
            Chennai Central Cooperative Command Tower • Real-time Telemetry
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/services')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-black)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Briefcase size={15} />
            <span>+ Add / Manage Jobs & Services</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/workers')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-bg)',
              color: 'var(--color-black)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Users size={15} />
            <span>Manage Workers</span>
          </button>
        </div>
      </div>

      {/* PENDING WORKERS NOTIFICATION BANNER */}
      {stats.pendingWorkers > 0 && (
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #F59E0B',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#92400E' }}>
                {stats.pendingWorkers} Worker Application{stats.pendingWorkers > 1 ? 's' : ''} Awaiting Admin Verification
              </div>
              <p style={{ fontSize: '11px', color: '#78350F', margin: '2px 0 0' }}>
                Newly registered workers must be verified by the admin committee before being placed on the live fleet map or receiving jobs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/workers')}
            style={{
              background: '#D97706',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Review & Verify →
          </button>
        </div>
      )}

      {/* 1. TOP 5 STAT CARDS IN A ROW (LIVE FROM MONGODB) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'var(--space-md)'
      }}>
        
        {/* Stat 1: Verified Workers */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-black)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              VERIFIED WORKERS
            </span>
            <Users size={18} color="var(--color-text-secondary)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {(stats.verifiedWorkers || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: stats.pendingWorkers > 0 ? 'var(--color-accent)' : 'var(--color-success)', fontWeight: 600 }}>
            {stats.pendingWorkers > 0 ? `${stats.pendingWorkers} Pending Verification` : 'All Approved in MongoDB'}
          </div>
        </Card>

        {/* Stat 2: Active Workers */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              ONLINE WORKERS
            </span>
            <UserCheck size={18} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {stats.activeWorkers.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            Ready for dispatch
          </div>
        </Card>

        {/* Stat 3: Total Bookings */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              TOTAL BOOKINGS
            </span>
            <Briefcase size={18} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-accent)' }}>
            {stats.todayJobs.toLocaleString()}
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
            {stats.completedJobs.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            Settled via Direct UPI
          </div>
        </Card>

        {/* Stat 5: Pending */}
        <Card padding="md" style={{ borderLeft: '4px solid var(--color-text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
              PENDING / DISPATCH
            </span>
            <Clock size={18} color="var(--color-text-secondary)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-black)' }}>
            {stats.pendingJobs.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            En route & in progress
          </div>
        </Card>

      </div>

      {/* 2. COOPERATIVE CAPITAL & WELFARE METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        <Card padding="md" style={{ background: 'var(--color-black)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600 }}>
                Direct Worker Take-Home (90%)
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0' }}>
                ₹{stats.totalEarningsDistributed.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '10px', borderRadius: '50%', color: '#4ADE80' }}>
              <TrendingUp size={24} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#D1D5DB' }}>
            100% directly transferred to worker UPI accounts
          </div>
        </Card>

        <Card padding="md" style={{ border: '1.5px solid var(--color-accent)', background: '#FFFDFB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="text-secondary" style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
                Cooperative Welfare Reserve (10%)
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-accent)', margin: '4px 0' }}>
                ₹{stats.welfareFundBalance.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(255, 106, 0, 0.12)', padding: '10px', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <HeartHandshake size={24} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Funds cashless medical insurance & tool subsidies
          </div>
        </Card>
      </div>

      {/* 3. EMERGENCY SOS DISPATCH MONITOR */}
      <Card padding="md" style={{
        border: emergencyBookings.length > 0 ? '2px solid var(--color-danger)' : '1px solid var(--color-border)',
        background: emergencyBookings.length > 0 ? '#FFFDFD' : 'var(--color-white)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: emergencyBookings.length > 0 ? 'var(--color-danger)' : 'var(--color-bg)',
              color: emergencyBookings.length > 0 ? 'white' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0, color: emergencyBookings.length > 0 ? 'var(--color-danger)' : 'var(--color-black)' }}>
                🚨 Live Operations SOS Safety Feed
              </h2>
              <span className="text-secondary" style={{ fontSize: '12px' }}>
                Automated emergency tracking ({emergencyBookings.length} Active in MongoDB)
              </span>
            </div>
          </div>

          <Button variant="outline" size="small" icon={RefreshCw} onClick={fetchLiveDashboard}>
            Refresh
          </Button>
        </div>

        {emergencyBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {emergencyBookings.map(em => (
              <div key={em.bookingId || em._id} style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#991B1B' }}>
                    🚨 {em.serviceCategory} • {em.serviceDetails}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7F1D1D', marginTop: 2 }}>
                    Customer: {em.customerName} ({em.customerPhone}) • Address: {em.customerAddress}
                  </div>
                </div>
                <Badge variant="danger">{em.status?.toUpperCase()}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
            ✓ No urgent SOS emergencies active in the district. All operations nominal.
          </div>
        )}
      </Card>

      {/* 4. RECENT BOOKINGS AUDIT TRAIL */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
            Recent Cooperative Service Dispatches ({recentBookings.length})
          </h2>
          <button
            type="button"
            onClick={() => navigate('/admin/bookings')}
            style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View All Bookings →
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Bookings in Database"
            description="When customers book services, real-time live dispatches and worker assignment audit trails will appear here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {recentBookings.map((b) => (
              <Card key={b.bookingId || b._id} padding="sm">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{b.serviceCategory}</span>
                      <Badge variant={['completed', 'paid'].includes(b.status) ? 'success' : 'active'} style={{ fontSize: '10px' }}>
                        {b.status?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                      Customer: {b.customerName} • Worker: {b.workerName || 'Awaiting Worker'} • {b.dateString || 'Recently'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>₹{b.amount}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                      90% Direct Pay
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
