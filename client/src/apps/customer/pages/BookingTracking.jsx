import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Check,
  X,
  Send,
  FastForward,
  CreditCard,
  Sparkles,
  Zap,
  PhoneCall
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { workersAPI, bookingsAPI } from '../../../services/api';
import { useDemoStore } from '../../../context/DemoStoreContext';
import TrackingMap from '../components/TrackingMap';

export const BookingTracking = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeBooking } = useDemoStore();

  const [liveBooking, setLiveBooking] = useState(null);

  // Fetch live booking document from MongoDB
  useEffect(() => {
    if (!bookingId) return;

    let isMounted = true;
    const fetchBooking = async () => {
      try {
        const res = await bookingsAPI.getById(bookingId);
        if (res.success && res.data && isMounted) {
          setLiveBooking(res.data);
        }
      } catch (err) {
        console.warn('Booking tracking fetch error:', err.message);
      }
    };

    fetchBooking();
    const interval = setInterval(fetchBooking, 2500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [bookingId]);

  const targetWorkerId = liveBooking?.workerId || searchParams.get('workerId') || activeBooking?.workerId;
  const isEmergency = searchParams.get('emergency') === 'true' || liveBooking?.isEmergency;

  const [worker, setWorker] = useState({
    id: targetWorkerId || 'worker',
    name: liveBooking?.workerName || 'Cooperative Worker',
    phone: '+91 98401 11223',
    skill: liveBooking?.serviceCategory || 'Professional Services',
    badge: 'Verified Cooperative Worker',
    rating: 5.0,
    reviewsCount: 1,
    avatar: 'WK'
  });

  useEffect(() => {
    if (targetWorkerId) {
      workersAPI.getById(targetWorkerId).then(res => {
        if (res.success && res.data) {
          setWorker({
            id: res.data.workerId || res.data._id,
            name: res.data.name,
            phone: res.data.phone || '+91 98401 11223',
            skill: res.data.skill,
            badge: res.data.badge || 'Verified Cooperative Worker',
            rating: res.data.rating || 5.0,
            reviewsCount: res.data.reviewsCount || 1,
            avatar: res.data.avatar || 'WK'
          });
        }
      }).catch(() => {});
    }
  }, [targetWorkerId]);

  // Dynamic Customer Location and Arrival PIN
  const customerAddress = liveBooking?.customerAddress || activeBooking?.customerAddress || 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar, Chennai';
  const arrivalPin = liveBooking?.arrivalPin || activeBooking?.arrivalPin || '8821';

  // Derive statusIndex from live MongoDB document or active store matching this specific bookingId
  const rawStatus = liveBooking?.status || (activeBooking?.bookingId === bookingId || activeBooking?.id === bookingId ? activeBooking?.status : 'pending');
  const isPending = rawStatus === 'pending';

  const getDerivedStatusIndex = () => {
    if (rawStatus === 'pending') return 0;
    if (rawStatus === 'accepted') return 1;
    if (rawStatus === 'on_the_way') return 2;
    if (rawStatus === 'arrived') return 3;
    if (rawStatus === 'working' || rawStatus === 'in_progress') return 4;
    if (rawStatus === 'completed' || rawStatus === 'paid' || rawStatus === 'rated') return 5;
    return 0; // Fresh booking starts at step 0 (Pending Acceptance)
  };

  const statusIndex = getDerivedStatusIndex();
  const isSharingLocation = liveBooking ? (liveBooking.isLocationSharing ?? true) : (activeBooking?.bookingId === bookingId ? activeBooking.isLocationSharing : true);


  // Mock Chat Modal State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'worker',
      text: isEmergency
        ? 'Namaste! Received your priority emergency request. On my vehicle right now, arriving in 10-12 mins.'
        : 'Namaste! I have picked up the spare switches and fuse from the Adyar depot.',
      time: '4:18 PM'
    },
    {
      id: 2,
      sender: 'worker',
      text: isEmergency
        ? 'Please turn off the main switch breaker if there is severe sparking.'
        : 'I am on my two-wheeler now, reaching your apartment in about 15-18 mins.',
      time: '4:20 PM'
    }
  ]);

  const [newMsg, setNewMsg] = useState('');

  const statusSteps = [
    {
      id: 'pending',
      title: 'Pending Worker Acceptance',
      desc: 'Dispatched to nearby cooperative workers • Awaiting acceptance',
      etaText: 'Awaiting Acceptance'
    },
    {
      id: 'accepted',
      title: 'Booking Accepted',
      desc: 'Worker confirmed and is preparing tools & parts',
      etaText: 'Accepted ✓'
    },
    {
      id: 'on_the_way',
      title: 'On the way',
      desc: 'Worker is traveling to your location with GPS route',
      etaText: 'ETA: 12 min'
    },
    {
      id: 'arrived',
      title: 'Arrived at Gate',
      desc: 'Worker reached your gate / entrance',
      etaText: 'Verify PIN'
    },
    {
      id: 'work_started',
      title: 'Work Started',
      desc: 'Active service execution in progress',
      etaText: 'In Progress'
    },
    {
      id: 'completed',
      title: 'Completed',
      desc: 'Work finished & verified by you',
      etaText: 'Ready for payment'
    }
  ];

  // When status reaches completed, auto-route option or proceed button
  useEffect(() => {
    if (statusIndex === 4) {
      const timer = setTimeout(() => {
        // Optional subtle prompt or keep user in control
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [statusIndex, navigate, bookingId, worker.id]);

  const handleSimulateNextStep = () => {
    setStatusIndex((prev) => (prev < 4 ? prev + 1 : 4));
  };

  const handleResetStep = () => {
    setStatusIndex(0);
  };

  const handleSendChat = (e) => {
    if (e) e.preventDefault();
    if (!newMsg.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: newMsg.trim(),
      time: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setNewMsg('');

    // Simulate worker quick reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'worker',
          text: 'Got it! See you shortly.',
          time: 'Just now'
        }
      ]);
    }, 1200);
  };

  const handleProceedToPayment = () => {
    navigate(`/customer/payment-checkout/${bookingId || 'BK-1048'}?workerId=${worker.id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER & PROTOTYPE STEP SIMULATOR CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={() => navigate('/customer/home')}
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
            aria-label="Back to Home"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Job Live Status</h1>
            <p className="text-secondary" style={{ fontSize: '12px' }}>
              Booking ID: #{bookingId || 'BK-1048'}
            </p>
          </div>
        </div>

        {/* Prototype Judge/Demo Simulator Button (small and clean) */}
        <button
          type="button"
          onClick={handleSimulateNextStep}
          disabled={statusIndex === 4}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 10px',
            borderRadius: 'var(--radius-full)',
            background: statusIndex === 4 ? 'var(--color-bg)' : 'var(--color-accent)',
            color: statusIndex === 4 ? 'var(--color-text-secondary)' : 'var(--color-white)',
            fontSize: '11px',
            fontWeight: 'bold',
            border: 'none',
            cursor: statusIndex === 4 ? 'not-allowed' : 'pointer',
            boxShadow: statusIndex === 4 ? 'none' : '0 2px 6px rgba(255, 106, 0, 0.25)'
          }}
          title="Click to advance status for demo"
        >
          <FastForward size={13} />
          <span>{statusIndex === 4 ? 'Job Finished' : 'Simulate Next Step'}</span>
        </button>
      </div>

      {/* 2. TOP WORKER / PENDING STATUS CARD */}
      <Card padding="md" style={{
        border: isPending ? '1.5px solid #F59E0B' : '1px solid var(--color-border)',
        background: isPending ? '#FFFBEB' : 'var(--color-white)'
      }}>
        {isPending ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  ⏳
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#92400E' }}>
                      Dispatching to Verified Workers
                    </h3>
                  </div>
                  <div style={{ fontSize: '12px', color: '#B45309', marginTop: 2 }}>
                    Awaiting worker acceptance • Live route starts upon acceptance
                  </div>
                </div>
              </div>

              <span style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                color: '#92400E',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)'
              }}>
                ⏳ Pending Acceptance
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#78350F', borderTop: '1px solid #FDE68A', paddingTop: 8 }}>
              Your service request for <strong>{liveBooking?.serviceCategory || worker.skill || 'Services'}</strong> has been sent to cooperative helpers in your area. Once accepted, worker details will update automatically.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-black)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {worker.avatar}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0 }}>
                    {worker.name}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: '12px', fontWeight: 600, marginTop: 2 }}>
                  <CheckCircle2 size={13} />
                  <span>✓ Verified Helper (Accepted)</span>
                </div>
                <div className="text-secondary" style={{ fontSize: '12px' }}>
                  {worker.skill} • ⭐ {worker.rating}
                </div>
              </div>
            </div>

            {/* Call and Chat Icon Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={`tel:${worker.phone || '+919840111223'}`}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-black)',
                  cursor: 'pointer'
                }}
                title="Call Helper"
                aria-label="Call Helper"
              >
                <PhoneCall size={20} />
              </a>

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-accent-subtle)',
                  border: '1px solid rgba(255, 106, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)',
                  cursor: 'pointer'
                }}
                title="Open Chat"
                aria-label="Chat with Worker"
              >
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 3. CUSTOMER PIN LOCATION & ARRIVAL VERIFICATION CARD */}
      <Card padding="md" style={{ border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(217, 48, 37, 0.12)',
              color: '#D93025',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                📍 Customer Pinned Service Location
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-black)', marginTop: 2 }}>
                {customerAddress}
              </div>
              <div className="text-secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                Worker navigation route is mapped to this exact address
              </div>
            </div>
          </div>

          {/* 4-Digit Arrival Security PIN */}
          <div style={{
            background: '#FFF7ED',
            border: '1.5px solid #FDBA74',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            textAlign: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#9A3412', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Arrival PIN
            </span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#EA580C', letterSpacing: '2px' }}>
              {arrivalPin}
            </span>
          </div>
        </div>
      </Card>

      {/* 4. REAL TRACKING MAP COMPONENT (ANIMATED LIVE GPS & TRANSPARENT PRIVACY NOTICE) */}
      <TrackingMap
        workerName={worker.name}
        workerCategory={worker.skill || 'Plumbing'}
        statusIndex={statusIndex}
        isSharingLocation={isSharingLocation}
        customerZone={customerAddress}
        isPending={isPending}
      />


      {/* 4. VERTICAL STATUS TRACKER (5 STEPS) */}
      <Card padding="md">
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--space-md)' }}>
          Service Timeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          {statusSteps.map((stepItem, index) => {
            const isCompleted = index < statusIndex;
            const isCurrent = index === statusIndex;
            const isPending = index > statusIndex;

            return (
              <div
                key={stepItem.id}
                style={{
                  display: 'flex',
                  gap: 'var(--space-md)',
                  alignItems: 'flex-start',
                  position: 'relative',
                  paddingBottom: index < statusSteps.length - 1 ? 'var(--space-lg)' : '4px'
                }}
              >
                {/* Connecting Line */}
                {index < statusSteps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '13px',
                    top: '28px',
                    bottom: 0,
                    width: 2,
                    background: isCompleted ? 'var(--color-success)' : '#E0E0E0'
                  }} />
                )}

                {/* Status Dot / Icon */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 2,
                  background: isCompleted
                    ? 'var(--color-success)'
                    : isCurrent
                      ? 'var(--color-accent)'
                      : 'var(--color-bg)',
                  color: isCompleted || isCurrent ? 'var(--color-white)' : 'var(--color-text-secondary)',
                  border: isPending ? '1.5px solid var(--color-border)' : 'none',
                  boxShadow: isCurrent ? '0 0 0 4px var(--color-accent-subtle)' : 'none',
                  transition: 'all 0.25s ease'
                }}>
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : isCurrent ? (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{index + 1}</span>
                  )}
                </div>

                {/* Text Details & ETA Highlight */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontWeight: isCurrent ? 'bold' : isCompleted ? 600 : 500,
                      fontSize: '15px',
                      color: isCurrent ? 'var(--color-black)' : isCompleted ? 'var(--color-black)' : 'var(--color-text-secondary)'
                    }}>
                      {stepItem.title}
                    </span>

                    {/* ETA or Status Highlight */}
                    {isCurrent && (
                      <span style={{
                        background: 'var(--color-accent-subtle)',
                        color: 'var(--color-accent)',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {stepItem.etaText}
                      </span>
                    )}

                    {isCompleted && (
                      <span style={{ color: 'var(--color-success)', fontSize: '12px', fontWeight: 600 }}>
                        ✓ Done
                      </span>
                    )}
                  </div>

                  <p className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                    {stepItem.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </Card>

      {/* 5. ARRIVAL PIN & VERIFICATION HELPER (WHEN ARRIVED OR ON THE WAY) */}
      {statusIndex <= 2 && (
        <div style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              SECURITY ARRIVAL PIN
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-black)', marginTop: 2 }}>
              Share this 4-digit code when worker arrives
            </div>
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: 'var(--color-accent)',
            letterSpacing: '2px',
            background: 'var(--color-white)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)'
          }}>
            8821
          </div>
        </div>
      )}

      {/* 6. COMPLETED STATE -> PROCEED TO PAYMENT BUTTON */}
      {statusIndex === 4 && (
        <Card padding="lg" style={{ background: '#F9FFF9', border: '1.5px solid var(--color-success)', textAlign: 'center' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-sm)'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px' }}>
            Job Finished & Verified!
          </h2>
          <p className="text-secondary" style={{ fontSize: '13px', marginBottom: 'var(--space-md)' }}>
            {worker.name} has completed the repair work. Please proceed to settle the standard fee directly.
          </p>

          <Button
            variant="primary"
            size="large"
            icon={CreditCard}
            fullWidth
            onClick={handleProceedToPayment}
          >
            Proceed to Payment (₹450)
          </Button>
        </Card>
      )}

      {/* MOCK CHAT SCREEN MODAL */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--color-white)',
            width: '100%',
            maxWidth: '440px',
            height: '80vh',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Chat Top Header */}
            <div style={{
              padding: 'var(--space-md)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'var(--color-black)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {worker.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', margin: 0 }}>Chat with {worker.name}</h3>
                  <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                    Online • En Route
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                style={{ padding: 4, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div style={{ flex: 1, padding: 'var(--space-md)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '80%'
                    }}
                  >
                    <div style={{
                      background: isUser ? 'var(--color-black)' : 'var(--color-bg)',
                      color: isUser ? 'var(--color-white)' : 'var(--color-black)',
                      padding: '10px 14px',
                      borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '13px',
                      lineHeight: 1.4
                    }}>
                      {msg.text}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'var(--color-text-secondary)',
                      marginTop: 2,
                      textAlign: isUser ? 'right' : 'left'
                    }}>
                      {msg.time}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 'var(--space-xs)' }}>
              <input
                type="text"
                className="ss-input"
                placeholder="Type a message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                autoFocus
              />
              <Button type="submit" variant="primary" icon={Send}>
                Send
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingTracking;
