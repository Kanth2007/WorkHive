import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  Sparkles,
  Building
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { mockSmartMatchWorkers } from '../data/mockWorkers';


export const BookingScreen = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { user } = useCustomer();

  const worker = mockSmartMatchWorkers.find((w) => w.id === workerId) || mockSmartMatchWorkers[0];

  const [address, setAddress] = useState(user.addressDetails || 'Flat 402, Sunshine Apartments, Adyar');
  const [phone, setPhone] = useState(user.contact || '+91 98220 11223');
  const [instructions, setInstructions] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-white)',
            cursor: 'pointer'
          }}
          aria-label="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Review & Confirm Booking</h1>
          <p className="text-secondary" style={{ fontSize: '12px' }}>Zero upfront payment needed</p>
        </div>
      </div>

      {!isConfirmed ? (
        <>
          {/* Worker summary mini-card */}
          <Card padding="md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-black)',
                  color: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {worker.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', margin: 0 }}>{worker.name}</h3>
                  <div className="text-secondary" style={{ fontSize: '12px' }}>
                    {worker.skill} • {worker.rating} ★
                  </div>
                </div>
              </div>
              <Badge variant="active">{worker.matchScore}% Match</Badge>
            </div>
          </Card>

          {/* Service & Address Details */}
          <Card padding="md">
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
              Service Location & Time
            </h3>

            <div className="ss-form-group">
              <label className="ss-label">Service Address</label>
              <input
                type="text"
                className="ss-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat / Street address"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Contact Phone (for worker call upon arrival)</label>
              <input
                type="tel"
                className="ss-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label">Special instructions or problem note (Optional)</label>
              <input
                type="text"
                className="ss-input"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Switchboard in kitchen sparking"
              />
            </div>
          </Card>

          {/* Pricing Transparency Breakdown */}
          <Card padding="md">
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
              Society Price Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Standard Society Visit Fee:</span>
                <span className="text-bold">{worker.priceEstimate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Platform / Intermediary Fee:</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>₹0 (Cooperative)</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 'var(--space-sm)',
                borderTop: '1px solid var(--color-border)',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                <span>Total to Pay:</span>
                <span>{worker.priceEstimate}</span>
              </div>
            </div>

            <div style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              marginTop: 'var(--space-md)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)'
            }}>
              💡 <strong>Payment terms:</strong> Pay after the worker inspects and finishes the job. Cash or direct UPI to worker.
            </div>
          </Card>

          {/* Confirm Button */}
          <Button
            variant="primary"
            size="large"
            icon={CheckCircle2}
            fullWidth
            onClick={handleConfirm}
          >
            Confirm & Schedule ({worker.priceEstimate})
          </Button>
        </>
      ) : (
        /* Confirmation Screen */
        <Card padding="lg" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <div>
            <Badge variant="success" style={{ marginBottom: 'var(--space-xs)' }}>
              Booking Confirmed
            </Badge>
            <h2 style={{ fontSize: '22px', margin: '4px 0' }}>
              {worker.name} is on the way!
            </h2>
            <p className="text-secondary" style={{ fontSize: '14px' }}>
              Assigned through Ward 4 Cooperative Society. Arrival in <strong>30 minutes</strong>.
            </p>
          </div>

          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'left',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="text-secondary">Booking ID:</span>
              <span className="text-bold">BK-1049</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="text-secondary">Service Address:</span>
              <span className="text-bold">{address}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Total Amount:</span>
              <span className="text-bold">{worker.priceEstimate} (Pay after work)</span>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/customer/bookings')}
          >
            Go to My Bookings
          </Button>
        </Card>
      )}

    </div>
  );
};

export default BookingScreen;
