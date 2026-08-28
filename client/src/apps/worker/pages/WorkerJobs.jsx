import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { bookingsAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export const WorkerJobs = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tabFilter, setTabFilter] = useState('active'); // 'active' | 'completed'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await bookingsAPI.getAll();
        if (res.success && Array.isArray(res.data)) {
          setBookings(res.data);
        }
      } catch (err) {
        console.error('Error fetching worker jobs from MongoDB:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const activeJobs = bookings.filter(b => !['completed', 'paid', 'rated', 'cancelled'].includes(b.status));
  const pastJobs = bookings.filter(b => ['completed', 'paid', 'rated'].includes(b.status));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
          My Jobs
        </h1>
        <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
          Assigned cooperative jobs from live MongoDB database
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
        {[
          { id: 'active', label: `Active Jobs (${activeJobs.length})` },
          { id: 'completed', label: `Past Completed (${pastJobs.length})` }
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setTabFilter(f.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: tabFilter === f.id ? 'var(--color-black)' : 'var(--color-white)',
              color: tabFilter === f.id ? 'var(--color-white)' : 'var(--color-black)',
              border: `1px solid ${tabFilter === f.id ? 'var(--color-black)' : 'var(--color-border)'}`,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
          <Loader2 size={24} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-secondary" style={{ fontSize: '13px', marginTop: 8 }}>Loading jobs from MongoDB...</p>
        </div>
      ) : tabFilter === 'active' ? (
        activeJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Active Jobs Right Now"
            description="You are currently available in Ward 4. New requests will appear here in real-time."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {activeJobs.map((job) => (
              <Card key={job.bookingId || job._id} padding="md" style={{ border: '1.5px solid var(--color-accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Badge variant="active" style={{ marginBottom: 4 }}>
                      {job.status ? job.status.toUpperCase().replace('_', ' ') : 'IN PROGRESS'}
                    </Badge>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '2px 0' }}>
                      {job.serviceCategory || 'Cooperative Service'}
                    </h3>
                    <div className="text-secondary" style={{ fontSize: '13px' }}>
                      Customer: <strong>{job.customerName}</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    ₹{job.amount || 450}
                  </div>
                </div>

                <div style={{
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  margin: 'var(--space-sm) 0',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={14} color="var(--color-accent)" />
                    <span>{job.customerAddress || 'Ward 4, Adyar, Chennai'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} />
                    <span>{job.dateString || 'Today • Immediate'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <a href={`tel:${job.customerPhone || '+919840123456'}`} style={{ flex: 1 }}>
                    <Button variant="outline" size="small" icon={PhoneCall} fullWidth>
                      Call Customer
                    </Button>
                  </a>
                  <Button
                    variant="primary"
                    size="small"
                    icon={Navigation}
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/worker/job-management/${job.bookingId || job._id}`)}
                  >
                    Manage Job
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        pastJobs.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Past Jobs"
            description="Completed jobs and earnings will be listed here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {pastJobs.map((p) => (
              <Card key={p.bookingId || p._id} padding="sm">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{p.serviceCategory}</h3>
                    <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                      Customer: {p.customerName} • {p.dateString || 'Recently'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>₹{p.amount} paid via UPI</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600 }}>
                      ⭐ {p.rating || 5} Rating
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

    </div>
  );
};

export default WorkerJobs;
