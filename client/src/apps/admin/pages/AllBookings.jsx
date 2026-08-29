import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation,
  MapPin,
  PhoneCall,
  User,
  ShieldCheck,
  CreditCard,
  X,
  FileText,
  Building2,
  Check,
  ChevronRight,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { bookingsAPI } from '../../../services/api';

export const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Accepted' | 'In progress' | 'Completed' | 'Cancelled' | 'Emergency'

  // Selected Booking for Side Panel Inspection
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await bookingsAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(b => {
          const rawStatus = b.status || 'pending';
          const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).replace(/_/g, ' ');
          
          let stepperStep = 0;
          if (rawStatus === 'accepted') stepperStep = 0;
          if (rawStatus === 'on_the_way') stepperStep = 1;
          if (rawStatus === 'arrived') stepperStep = 2;
          if (rawStatus === 'working' || rawStatus === 'in_progress') stepperStep = 3;
          if (rawStatus === 'completed' || rawStatus === 'paid' || rawStatus === 'rated') stepperStep = 4;

          return {
            id: b.bookingId || b._id,
            bookingId: b.bookingId || b._id,
            customer: b.customerName,
            customerPhone: b.customerPhone,
            worker: b.workerName || 'Assigned Worker',
            workerCoopId: '#CLC-COOP',
            service: b.serviceCategory,
            problemSnippet: b.serviceDetails || 'Service request',
            location: b.customerAddress,
            zone: 'Ward 4, Adyar',
            status: formattedStatus,
            amount: `₹${b.amount || 450}`,
            isEmergency: b.isEmergency || false,
            date: b.dateString || 'Today',
            paymentStatus: b.status === 'completed' || b.status === 'paid' || b.status === 'rated'
              ? 'Paid via UPI (100% Direct Settled)'
              : 'Pending Completion',
            stepperStep,
            timeline: [
              { title: 'Booking Confirmed', time: '4:15 PM', passed: stepperStep >= 0 },
              { title: 'Worker on the Way', time: '4:18 PM', passed: stepperStep >= 1 },
              { title: 'Arrived at Location', time: '4:30 PM', passed: stepperStep >= 2 },
              { title: 'Work in Progress', time: '4:33 PM', passed: stepperStep >= 3 },
              { title: 'Completed & Paid', time: '4:45 PM', passed: stepperStep >= 4 }
            ]
          };
        });
        setBookings(mapped);
      }
    } catch (err) {
      console.error('Error fetching bookings from MongoDB:', err);
      setError('Unable to load bookings from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Emergency'
        ? b.isEmergency
        : b.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.worker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
            All Service Bookings
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Real-time cooperative dispatch operations and customer service requests
          </p>
        </div>

        <Badge variant="active" style={{ fontSize: '12px' }}>
          {bookings.length} Total Bookings in Ward 4
        </Badge>
      </div>

      {/* 2. SEARCH BAR & FILTER CHIPS */}
      <Card padding="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Bar */}
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                className="ss-input"
                style={{ paddingLeft: '38px', height: '42px', fontSize: '13px' }}
                placeholder="Search by customer name, worker, service, or Booking ID (e.g. BK-1048)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 13 }} />
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'All', label: `All (${bookings.length})` },
                { id: 'Pending', label: `Pending (${bookings.filter((b) => b.status === 'Pending').length})` },
                { id: 'Accepted', label: `Accepted (${bookings.filter((b) => b.status === 'Accepted').length})` },
                { id: 'In progress', label: `In progress (${bookings.filter((b) => b.status === 'In progress').length})` },
                { id: 'Completed', label: `Completed (${bookings.filter((b) => b.status === 'Completed').length})` },
                { id: 'Cancelled', label: `Cancelled (${bookings.filter((b) => b.status === 'Cancelled').length})` },
                { id: 'Emergency', label: `🚨 Emergency (${bookings.filter((b) => b.isEmergency).length})` }
              ].map((chip) => {
                const isSelected = statusFilter === chip.id;
                const isEmergencyChip = chip.id === 'Emergency';

                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setStatusFilter(chip.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected
                        ? (isEmergencyChip ? 'var(--color-danger)' : 'var(--color-black)')
                        : (isEmergencyChip ? 'var(--color-danger-bg)' : 'var(--color-bg)'),
                      color: isSelected
                        ? 'white'
                        : (isEmergencyChip ? 'var(--color-danger)' : 'var(--color-black)'),
                      border: `1.5px solid ${isSelected ? (isEmergencyChip ? 'var(--color-danger)' : 'var(--color-black)') : (isEmergencyChip ? 'var(--color-danger)' : 'var(--color-border)')}`,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </Card>

      {/* 3. FULL-WIDTH BOOKINGS TABLE */}
      <Card padding="none" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1.5px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Customer</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Assigned Worker</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Service & Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Location / Ward</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, index) => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: b.isEmergency ? '#FFFDFD' : (index % 2 === 0 ? 'white' : '#FCFCFC'),
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = b.isEmergency ? '#FEE2E2' : '#F5F5F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = b.isEmergency ? '#FFFDFD' : (index % 2 === 0 ? 'white' : '#FCFCFC'))}
                >
                  {/* Customer Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                      {b.isEmergency && (
                        <span title="🚨 Emergency Service Request" style={{ color: 'var(--color-danger)', fontSize: '14px', flexShrink: 0 }}>
                          🚨
                        </span>
                      )}
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-black)' }}>{b.customer}</div>
                        <div className="text-secondary" style={{ fontSize: '11px' }}>{b.id} • {b.date}</div>
                      </div>
                    </div>
                  </td>

                  {/* Worker Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-black)' }}>{b.worker}</div>
                      <div className="text-secondary" style={{ fontSize: '11px' }}>{b.workerCoopId}</div>
                    </div>
                  </td>

                  {/* Service Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{b.service}</div>
                      <div className="text-secondary" style={{ fontSize: '11px', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.problemSnippet}
                      </div>
                    </div>
                  </td>

                  {/* Location Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={13} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
                      <span className="text-secondary" style={{ fontSize: '12px' }}>{b.zone}</span>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td style={{ padding: '12px 16px' }}>
                    <Badge
                      variant={
                        b.status === 'Completed'
                          ? 'success'
                          : b.status === 'In progress' || b.status === 'Accepted'
                          ? 'active'
                          : b.status === 'Cancelled'
                          ? 'danger'
                          : 'neutral'
                      }
                      style={{ fontSize: '11px' }}
                    >
                      {b.status}
                    </Badge>
                  </td>

                  {/* Amount Column */}
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: 'var(--color-black)' }}>
                    {b.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. DETAIL PANEL (CLICKING A ROW OPENS FULL BOOKING TIMELINE & PAYMENT DETAILS) */}
      {selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: 'var(--color-white)',
            width: '100%',
            maxWidth: '520px',
            height: '100vh',
            overflowY: 'auto',
            padding: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {selectedBooking.isEmergency && (
                    <Badge variant="danger" style={{ fontSize: '10px' }}>
                      🚨 Emergency Service
                    </Badge>
                  )}
                  <Badge variant={selectedBooking.status === 'Completed' ? 'success' : 'active'}>
                    {selectedBooking.status}
                  </Badge>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0' }}>
                  Booking #{selectedBooking.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Service & Problem Summary */}
            <Card padding="md" style={{ background: 'var(--color-bg)' }}>
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--color-black)' }}>
                {selectedBooking.service}
              </div>
              <p style={{ fontSize: '13px', color: '#444', margin: '4px 0 0', lineHeight: 1.4 }}>
                {selectedBooking.problemSnippet}
              </p>
            </Card>

            {/* Customer & Worker Contact Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
              
              {/* Customer Box */}
              <div style={{ background: 'var(--color-bg)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600 }}>CUSTOMER</span>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: 2 }}>{selectedBooking.customer}</div>
                <div className="text-secondary" style={{ fontSize: '11px' }}>{selectedBooking.customerPhone}</div>
                <div style={{ marginTop: 6 }}>
                  <a href={`tel:${selectedBooking.customerPhone}`}>
                    <Button variant="outline" size="small" icon={PhoneCall}>Call</Button>
                  </a>
                </div>
              </div>

              {/* Worker Box */}
              <div style={{ background: 'var(--color-bg)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600 }}>COOP WORKER</span>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: 2 }}>{selectedBooking.worker}</div>
                <div className="text-secondary" style={{ fontSize: '11px' }}>{selectedBooking.workerCoopId}</div>
                <div style={{ marginTop: 6 }}>
                  <Button variant="outline" size="small">Roster Profile</Button>
                </div>
              </div>

            </div>

            {/* Location */}
            <div style={{ background: 'var(--color-bg)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
              <span className="text-secondary" style={{ fontWeight: 600 }}>DESTINATION ADDRESS</span>
              <div style={{ fontWeight: 'bold', marginTop: 2 }}>{selectedBooking.location}</div>
            </div>

            {/* FULL BOOKING TIMELINE STEPPER (MATCHING CUSTOMER & WORKER TRACKING) */}
            <Card padding="md">
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
                Service Lifecycle Stepper
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {selectedBooking.timeline.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: step.passed ? 'var(--color-success)' : 'var(--color-border)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {step.passed ? '✓' : idx + 1}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, fontSize: '13px' }}>
                      <span style={{ fontWeight: step.passed ? 600 : 400, color: step.passed ? 'var(--color-black)' : 'var(--color-text-secondary)' }}>
                        {step.title}
                      </span>
                      <span className="text-secondary" style={{ fontSize: '11px' }}>
                        {step.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* PAYMENT STATUS & FAIR COOP SETTLEMENT BREAKDOWN */}
            <Card padding="md" style={{ background: 'var(--color-black)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#BBB', textTransform: 'uppercase' }}>TOTAL CHARGE</span>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', color: 'white' }}>
                    {selectedBooking.amount}
                  </div>
                </div>
                <Badge variant="success" style={{ fontSize: '10px' }}>
                  {selectedBooking.paymentStatus.includes('Paid') ? 'Settled' : 'Authorized'}
                </Badge>
              </div>

              <div style={{ fontSize: '12px', color: '#DDD', marginBottom: 'var(--space-sm)' }}>
                Status: {selectedBooking.paymentStatus}
              </div>

              {/* Wage Distribution */}
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                fontSize: '11px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Worker Direct Take-Home (90%):</span>
                  <span className="text-bold">90% Direct UPI</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Member Welfare Fund (10%):</span>
                  <span className="text-bold">10% Subsidized</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00E676' }}>
                  <span>Platform Intermediary Fee:</span>
                  <span className="text-bold">₹0</span>
                </div>
              </div>
            </Card>

          </div>
        </div>
      )}

    </div>
  );
};

export default AllBookings;
