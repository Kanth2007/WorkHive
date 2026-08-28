import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, AlertCircle, PhoneCall, ChevronRight, Navigation, Star, FileText, Loader2 } from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { bookingsAPI } from '../../../services/api';

export const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(b => ({
          id: b.bookingId || b._id,
          service: b.serviceCategory || 'Cooperative Service',
          worker: b.workerName || 'Ravi Kumar',
          workerId: b.workerId || 'ravi-kumar',
          rating: b.rating || 4.8,
          fee: `₹${b.amount || 450}`,
          date: b.dateString || 'Today',
          status: b.status === 'completed' || b.status === 'paid' || b.status === 'rated' ? 'completed' : 'in-progress',
          statusLabel: b.status === 'completed' || b.status === 'paid' || b.status === 'rated' ? 'Completed' : 'In Progress'
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.error('Error fetching customer bookings from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return b.status === 'in-progress';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>My Bookings</h1>
        <p className="text-secondary" style={{ fontSize: '13px' }}>Track ongoing and past cooperative requests</p>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'active', label: 'In Progress' },
          { id: 'completed', label: 'Past Completed' }
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: filter === f.id ? 'var(--color-black)' : 'var(--color-white)',
              color: filter === f.id ? 'var(--color-white)' : 'var(--color-black)',
              border: `1px solid ${filter === f.id ? 'var(--color-black)' : 'var(--color-border)'}`,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Booking cards or Loading / Empty state */}
      {loading ? (
        <div style={{ padding: 'var(--space-xl) 0', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" color="var(--color-accent)" style={{ margin: '0 auto var(--space-sm)' }} />
          <p className="text-secondary" style={{ fontSize: '14px' }}>Loading your booking history...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          message={filter === 'active' ? "You don't have any active bookings right now." : "No past service bookings on record."}
          actionLabel="Book a Service"
          onAction={() => navigate('/customer/home')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {filteredBookings.map((b) => {
            const isActive = b.status === 'in-progress';

            return (
              <Card key={b.id} padding="md">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                  <div>
                    <Badge variant={isActive ? 'active' : 'success'}>
                      {b.statusLabel}
                    </Badge>
                    <h3 style={{ fontSize: '17px', marginTop: 4 }}>{b.service}</h3>
                  </div>
                  <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>{b.id}</span>
                </div>

                <div style={{
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  margin: 'var(--space-sm) 0',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-secondary">Assigned Helper:</span>
                    <span className="text-bold">{b.worker} ({b.rating} ★)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <span className="text-secondary">Schedule:</span>
                    <span>{b.date}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--space-xs)'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{b.fee}</span>
                  {isActive ? (
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <Button
                        variant="primary"
                        size="small"
                        icon={Navigation}
                        onClick={() => navigate(`/customer/tracking/${b.id}?workerId=${b.workerId}`)}
                      >
                        Track Live
                      </Button>
                      <a href="tel:+919840122334">
                        <Button variant="outline" size="small" icon={PhoneCall}>
                          Call
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <span className="text-secondary" style={{ fontSize: '12px' }}>Receipt Generated</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
