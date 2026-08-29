import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, AlertCircle, PhoneCall, ChevronRight, Navigation, Star, FileText, Loader2, Sparkles } from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { bookingsAPI } from '../../../services/api';
import { useCustomer } from '../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';

export const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useCustomer();
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const activePhone = currentUser?.phone || user?.contact || user?.phone;
      const activeId = currentUser?.userId || user?.userId;
      const activeName = currentUser?.name || user?.name;

      if (!activePhone && !activeId && !activeName) {
        setBookings([]);
        return;
      }

      const queryParams = {};
      if (activePhone) queryParams.customerPhone = activePhone;
      if (activeId) queryParams.customerId = activeId;
      if (activeName && !['Member', 'Customer'].includes(activeName)) queryParams.customerName = activeName;

      const res = await bookingsAPI.getAll(queryParams);
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(b => ({
          id: b.bookingId || b._id,
          bookingId: b.bookingId || b._id,
          service: b.serviceCategory || b.serviceDetails || 'Cooperative Service',
          worker: b.workerName || 'Assigned Worker',
          workerId: b.workerId || '',
          rating: b.rating || 0,
          fee: `₹${b.amount || 450}`,
          date: b.dateString || 'Today',
          status: b.status === 'completed' || b.status === 'paid' || b.status === 'rated' ? 'completed' : 'in-progress',
          statusLabel: (b.status || 'pending').toUpperCase().replace('_', ' '),
          rawStatus: b.status
        }));
        setBookings(mapped);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching customer bookings from MongoDB:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [user?.contact, user?.phone, currentUser?.phone, currentUser?.userId]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return b.status === 'in-progress';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>My Bookings</h1>
        <p className="text-secondary" style={{ fontSize: '13px' }}>
          Customer: <strong>{user?.name || currentUser?.name || 'Customer'}</strong> • Live MongoDB Records
        </p>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
        {[
          { id: 'all', label: `All Requests (${bookings.length})` },
          { id: 'active', label: `In Progress (${bookings.filter(b => b.status === 'in-progress').length})` },
          { id: 'completed', label: `Past Completed (${bookings.filter(b => b.status === 'completed').length})` }
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

      {loading ? (
        <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
          <Loader2 size={24} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-secondary" style={{ fontSize: '13px', marginTop: 8 }}>Loading your bookings from MongoDB...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Bookings Found"
          description={
            filter === 'all'
              ? "You haven't made any service bookings yet. Browse our verified cooperative workers and book in seconds!"
              : `You have no ${filter === 'active' ? 'in-progress' : 'completed'} bookings.`
          }
          actionLabel="Find a Service"
          onAction={() => navigate('/customer/search')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {filteredBookings.map((b) => (
            <Card key={b.id} padding="md" style={{ border: b.status === 'in-progress' ? '1.5px solid var(--color-accent)' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Badge variant={b.status === 'completed' ? 'success' : 'active'} style={{ marginBottom: 4 }}>
                    {b.statusLabel}
                  </Badge>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '2px 0' }}>{b.service}</h3>
                  <div className="text-secondary" style={{ fontSize: '13px' }}>
                    Worker: <strong>{b.worker}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{b.fee}</div>
                  <div className="text-secondary" style={{ fontSize: '12px' }}>{b.date}</div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 'var(--space-xs)' }}>
                {b.status === 'in-progress' ? (
                  <Button
                    variant="primary"
                    size="small"
                    icon={Navigation}
                    fullWidth
                    onClick={() => navigate(`/customer/track/${b.bookingId || b.id}`)}
                  >
                    Track Live Arrival
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="small"
                    icon={Star}
                    fullWidth
                    onClick={() => navigate(`/customer/rating/${b.bookingId || b.id}`)}
                  >
                    {b.rating > 0 ? `Rated ${b.rating} ⭐` : 'Rate Service'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
