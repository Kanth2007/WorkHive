import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bell,
  MapPin,
  Clock,
  Navigation,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Star,
  Zap,
  Check,
  X,
  CreditCard,
  Building2,
  ArrowLeft,
  Timer
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';

export const JobRequestScreen = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Simulated 30-second countdown timer for visual urgency
  const [secondsLeft, setSecondsLeft] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const job = {
    id: jobId || 'REQ-8821',
    category: 'Plumbing & Pipe Repair',
    description: 'Bathroom washbasin pipe leakage & main stopcock valve replacement.',
    customerName: 'Meera Krishnan',
    customerRating: '4.7 ⭐',
    customerBookings: '14 verified bookings',
    distance: '2.1 km away (12 min travel)',
    location: 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar, Chennai - 600020',
    requestedTime: 'Today • Immediate / ASAP (within 30 mins)',
    earning: '₹380',
    duration: '1-2 Hours estimated',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80'
    ]
  };

  const handleAccept = () => {
    navigate(`/worker/job-management/${job.id}`);
  };

  const handleReject = () => {
    navigate('/worker', { state: { toastMessage: 'Request declined. Your availability remains active for new matches.' } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP NOTIFICATION HEADER WITH COUNTDOWN TIMER */}
      <div style={{
        background: 'var(--color-black)',
        color: 'var(--color-white)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bell size={18} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              🔔 New Service Request
            </div>
            <div style={{ fontSize: '11px', color: '#BBB' }}>
              Direct Cooperative Smart Match
            </div>
          </div>
        </div>

        {/* 30-Second Countdown Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(255, 106, 0, 0.2)',
          border: '1px solid var(--color-accent)',
          color: 'var(--color-accent)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          <Timer size={14} />
          <span>{secondsLeft}s remaining</span>
        </div>
      </div>

      {/* 2. MAIN REQUEST CARD */}
      <Card padding="md" style={{ border: '2px solid var(--color-accent)', background: '#FFFDFB' }}>
        
        {/* Service Title & Estimated Earning */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Badge variant="active" style={{ marginBottom: 4 }}>
              Urgent Service Request
            </Badge>
            <h1 style={{ fontSize: '19px', fontWeight: 'bold', margin: '2px 0 4px', color: 'var(--color-black)' }}>
              {job.category}
            </h1>
            <p style={{ fontSize: '14px', color: '#444', margin: 0, lineHeight: 1.4 }}>
              {job.description}
            </p>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 'var(--space-sm)' }}>
            <span className="text-secondary" style={{ fontSize: '11px' }}>ESTIMATED EARNING</span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-accent)', margin: '1px 0' }}>
              {job.earning}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 600 }}>
              100% Direct Payout
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--color-border)', margin: 'var(--space-md) 0' }} />

        {/* Customer Rating & Distance Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <div style={{ background: 'var(--color-bg)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
            <span className="text-secondary" style={{ fontSize: '11px' }}>CUSTOMER</span>
            <div style={{ fontWeight: 'bold', fontSize: '13px', margin: '2px 0' }}>{job.customerName}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600 }}>
              {job.customerRating} • {job.customerBookings}
            </div>
          </div>

          <div style={{ background: 'var(--color-bg)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
            <span className="text-secondary" style={{ fontSize: '11px' }}>DISTANCE</span>
            <div style={{ fontWeight: 'bold', fontSize: '13px', margin: '2px 0', color: 'var(--color-black)' }}>
              {job.distance}
            </div>
            <div className="text-secondary" style={{ fontSize: '11px' }}>
              {job.location.split(',')[1]}
            </div>
          </div>
        </div>

        {/* Requested Time */}
        <div style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 12px',
          marginBottom: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          fontSize: '13px'
        }}>
          <Clock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />
          <div>
            <span className="text-secondary">Requested Time: </span>
            <strong style={{ color: 'var(--color-black)' }}>{job.requestedTime}</strong>
          </div>
        </div>

        {/* Attached Photos */}
        <div>
          <label className="ss-label" style={{ display: 'block', marginBottom: '6px' }}>
            Customer Attached Photos (2)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
            {job.photos.map((url, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  height: '110px'
                }}
              >
                <img
                  src={url}
                  alt={`Attached problem issue ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>

      </Card>

      {/* 3. COOPERATIVE TRANSPARENCY NOTICE */}
      <div style={{
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '12px',
        color: '#166534'
      }}>
        <ShieldCheck size={16} style={{ flexShrink: 0 }} />
        <span>₹5,00,000 on-duty cooperative insurance applies to this job.</span>
      </div>

      {/* 4. TWO BIG ACTION BUTTONS AT BOTTOM: ACCEPT (PRIMARY) & REJECT (SECONDARY) */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
        
        {/* Reject Button (Secondary Outline) */}
        <Button
          variant="outline"
          size="large"
          icon={X}
          style={{ flex: 1, height: '54px', fontSize: '15px' }}
          onClick={handleReject}
        >
          Reject
        </Button>

        {/* Accept Button (Primary Accent) */}
        <Button
          variant="primary"
          size="large"
          icon={CheckCircle2}
          style={{ flex: 2, height: '54px', fontSize: '16px', fontWeight: 'bold' }}
          onClick={handleAccept}
        >
          Accept ({job.earning})
        </Button>

      </div>

    </div>
  );
};

export default JobRequestScreen;
