import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  PhoneCall,
  MessageSquare,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  Zap,
  KeyRound,
  Check,
  CreditCard,
  Building2,
  FileCheck2,
  ChevronRight,
  Send,
  X,
  Sparkles,
  TrendingUp,
  Star,
  Award,
  Radio,
  Wrench,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useDemoStore } from '../../../context/DemoStoreContext';
import { bookingsAPI } from '../../../services/api';

export const JobManagement = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { updateWorker } = useWorker();
  const { activeBooking, updateBookingStatus, setLocationSharing } = useDemoStore();

  // 5 Status Steps: 0: Accepted, 1: On the way, 2: Arrived, 3: Working, 4: Completed
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (activeBooking) {
      if (activeBooking.status === 'on_the_way') return 1;
      if (activeBooking.status === 'arrived') return 2;
      if (activeBooking.status === 'working') return 3;
      if (activeBooking.status === 'completed' || activeBooking.status === 'paid' || activeBooking.status === 'rated') return 4;
    }
    return 0; // Default to Accepted
  });
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'customer', text: 'Hi! Please call when you reach the gate, security requires approval.', time: '4:15 PM' },
    { sender: 'worker', text: 'Sure madam, I am on the way. ETA is around 12 minutes.', time: '4:16 PM' }
  ]);
  const [newChatText, setNewChatText] = useState('');

  const steps = [
    { id: 'accepted', label: 'Accepted', icon: CheckCircle2 },
    { id: 'on_the_way', label: 'On the way', icon: Navigation },
    { id: 'arrived', label: 'Arrived', icon: MapPin },
    { id: 'working', label: 'Working', icon: Wrench },
    { id: 'completed', label: 'Completed', icon: Sparkles }
  ];

  const [liveBooking, setLiveBooking] = useState(null);

  useEffect(() => {
    if (jobId) {
      bookingsAPI.getById(jobId).then(res => {
        if (res.success && res.data) {
          setLiveBooking(res.data);
        }
      }).catch(() => {});
    }
  }, [jobId]);

  // Dynamic job data from database or active store
  const job = {
    id: liveBooking?.bookingId || activeBooking?.id || jobId || 'Job',
    customer: liveBooking?.customerName || activeBooking?.customerName || 'Customer Member',
    phone: liveBooking?.customerPhone || activeBooking?.customerPhone || '',
    category: liveBooking?.serviceCategory || activeBooking?.serviceCategory || 'Service',
    problem: liveBooking?.serviceDetails || activeBooking?.serviceDetails || 'Service request',
    address: liveBooking?.customerAddress || activeBooking?.customerAddress || 'Ward 4, Chennai',
    distance: 'Nearby',
    rate: liveBooking?.amount ? `₹${liveBooking.amount}` : activeBooking?.amount ? `₹${activeBooking.amount}` : '₹450',
    arrivalPin: liveBooking?.arrivalPin || activeBooking?.arrivalPin || '1234'
  };

  // Dedicated Live Location Sharing State (Separate from general status stepper)
  const [isSharingLocation, setIsSharingLocation] = useState(() => {
    return activeBooking ? activeBooking.isLocationSharing : true;
  });

  const toggleLocationSharing = () => {
    const nextState = !isSharingLocation;
    setIsSharingLocation(nextState);
    setLocationSharing(nextState);
    localStorage.setItem('sahakari_location_sharing', nextState ? 'true' : 'false');
    window.dispatchEvent(new Event('storage'));
  };

  const handleNextAction = async () => {
    if (currentStepIndex < 4) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);

      const statusMap = ['accepted', 'on_the_way', 'arrived', 'working', 'completed'];
      const nextStatus = statusMap[nextIndex];

      const updatePayload = { status: nextStatus };

      if (nextIndex === 1) {
        setIsSharingLocation(true);
        updatePayload.isLocationSharing = true;
        updateBookingStatus('on_the_way', { isLocationSharing: true });
      } else if (nextIndex === 2) {
        setIsSharingLocation(false);
        updatePayload.isLocationSharing = false;
        updateBookingStatus('arrived', { isLocationSharing: false });
        localStorage.setItem('sahakari_location_sharing', 'false');
        window.dispatchEvent(new Event('storage'));
      } else if (nextIndex === 3) {
        updateBookingStatus('working');
      } else if (nextIndex === 4) {
        updateBookingStatus('completed');
      }

      if (job.id) {
        try {
          await bookingsAPI.updateStatus(job.id, updatePayload);
        } catch (err) {
          console.warn('Live status update warning:', err.message);
        }
      }
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!newChatText.trim()) return;
    const msg = {
      sender: 'worker',
      text: newChatText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewChatText('');
  };

  const handleGoBackOnline = () => {
    // Re-enable worker availability automatically in context
    updateWorker({ isOnline: true });
    navigate('/worker', {
      state: { toastMessage: '🟢 You are back online! Ready to accept new nearby jobs.' }
    });
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={() => navigate('/worker')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-white)',
              cursor: 'pointer'
            }}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              Job Management
            </h1>
            <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
              Job ID: #{job.id}
            </p>
          </div>
        </div>

        <Badge variant={currentStepIndex === 4 ? 'success' : 'active'}>
          {steps[currentStepIndex].label}
        </Badge>
      </div>

      {/* 2. CUSTOMER MINI-CARD WITH CALL & CHAT BUTTONS */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{job.customer}</h2>
              <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600 }}>
                {job.customerRating}
              </span>
            </div>
            <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
              {job.category}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <a href={`tel:${job.phone}`}>
              <Button variant="outline" size="small" icon={PhoneCall}>
                Call
              </Button>
            </a>
            <Button
              variant="outline"
              size="small"
              icon={MessageSquare}
              onClick={() => setIsChatOpen(true)}
            >
              Chat
            </Button>
          </div>
        </div>
      </Card>

      {/* If Step < 4: Show Live Status Stepper, Destination, and Next Action */}
      {currentStepIndex < 4 ? (
        <>
          {/* 3. STATUS STEPPER MATCHING CUSTOMER TRACKING SCREEN */}
          <Card padding="md">
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: 'var(--space-md)' }}>
              Service Status Tracking
            </h3>

            {/* Stepper Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: 'var(--space-md)' }}>
              
              {/* Line behind circles */}
              <div style={{
                position: 'absolute',
                top: 15,
                left: 20,
                right: 20,
                height: 3,
                background: 'var(--color-border)',
                zIndex: 1
              }}>
                <div style={{
                  height: '100%',
                  background: 'var(--color-accent)',
                  width: `${(currentStepIndex / 4) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2,
                      width: '60px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isPassed ? (isCurrent ? 'var(--color-accent)' : 'var(--color-success)') : 'var(--color-white)',
                      border: `2px solid ${isPassed ? (isCurrent ? 'var(--color-accent)' : 'var(--color-success)') : 'var(--color-border)'}`,
                      color: isPassed ? 'white' : 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(255, 106, 0, 0.2)' : 'none'
                    }}>
                      {idx < currentStepIndex ? <Check size={16} strokeWidth={3} /> : idx + 1}
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: isCurrent ? 'bold' : 500,
                      color: isCurrent ? 'var(--color-black)' : 'var(--color-text-secondary)',
                      marginTop: 6,
                      lineHeight: 1.2
                    }}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Step Status Card */}
            <div style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)'
            }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  Current Status: {steps[currentStepIndex].label}
                </div>
                <div className="text-secondary" style={{ fontSize: '12px' }}>
                  {currentStepIndex === 0 && 'Job accepted. Tap button below when ready to travel.'}
                  {currentStepIndex === 1 && 'En route to customer location in Kasturba Nagar (ETA: 12 min).'}
                  {currentStepIndex === 2 && 'Arrived at Door 14. Customer Arrival PIN: 8821.'}
                  {currentStepIndex === 3 && 'Plumbing & pipe replacement work in progress.'}
                </div>
              </div>
            </div>
          </Card>

          {/* 4. DESTINATION & PROBLEM DETAILS */}
          <Card padding="md">
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
              Service Location & Task
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <MapPin size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{job.address}</strong>
                  <div className="text-secondary" style={{ fontSize: '12px' }}>{job.distance}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
                <span className="text-secondary">Task Note: </span>
                <span>{job.problem}</span>
              </div>
            </div>
          </Card>

          {/* DEDICATED SEPARATE BUTTON: "START SHARING LOCATION" (VISIBLE IN ACCEPTED / ON THE WAY) */}
          {currentStepIndex <= 1 && (
            <Card
              padding="md"
              style={{
                border: isSharingLocation ? '1.5px solid #22C55E' : '1.5px solid var(--color-border)',
                background: isSharingLocation ? '#F0FDF4' : 'var(--color-white)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: isSharingLocation ? '#DCFCE7' : 'var(--color-bg)',
                    color: isSharingLocation ? '#16A34A' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Navigation size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: isSharingLocation ? '#15803D' : 'var(--color-black)' }}>
                      {isSharingLocation ? '🟢 Live Location Sharing is Active' : 'Live Location Sharing'}
                    </div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>
                      {isSharingLocation
                        ? 'Customer sees your moving vehicle on map • Stops at arrival'
                        : 'Share your route with customer once ready to travel'}
                    </div>
                  </div>
                </div>

                <Button
                  variant={isSharingLocation ? 'outline' : 'primary'}
                  size="small"
                  onClick={toggleLocationSharing}
                >
                  {isSharingLocation ? 'Stop Sharing' : 'Start Sharing Location 📍'}
                </Button>
              </div>
            </Card>
          )}

          {/* 5. BIG BUTTON AT BOTTOM ALWAYS SHOWING NEXT ACTION */}

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <Button
              variant="primary"
              size="large"
              fullWidth
              style={{ height: '56px', fontSize: '16px', fontWeight: 'bold' }}
              onClick={handleNextAction}
            >
              {currentStepIndex === 0 && 'Start Heading to Job 🛵'}
              {currentStepIndex === 1 && 'Mark Arrived at Location 📍'}
              {currentStepIndex === 2 && 'Start Work (Verify PIN: 8821) 🔧'}
              {currentStepIndex === 3 && 'Mark Job Completed & Settle Payment ✅'}
            </Button>
          </div>
        </>
      ) : (
        /* 6. COMPLETED SCREEN: SHORT JOB SUMMARY & "GO BACK ONLINE" BUTTON */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Celebratory Checkmark Card */}
          <Card padding="lg" style={{ textAlign: 'center', background: '#F9FFF9', border: '1.5px solid #22C55E' }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-xs)'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <Badge variant="success" style={{ marginBottom: '6px' }}>
              Job Successfully Settled
            </Badge>

            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 2px' }}>
              Job Completed!
            </h2>
            <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
              Payment of {job.rate} deposited directly to your registered UPI ID.
            </p>
          </Card>

          {/* Job Summary Card (Service, Duration, Amount Earned) */}
          <Card padding="md">
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
              Job Summary Receipt
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Service Rendered:</span>
                <span className="text-bold">{job.category}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Customer:</span>
                <span className="text-bold">{job.customer} (Ward 4)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Duration of Work:</span>
                <span className="text-bold">42 Minutes</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Customer Rating:</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>⭐ 5.0 ("Super quick & polite!")</span>
              </div>

              <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Amount Earned:</span>
                <span style={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--color-success)' }}>
                  {job.rate}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#166534' }}>
                <span>Cooperative Welfare Contribution:</span>
                <span>+₹20 added to your Tool Pool</span>
              </div>
            </div>
          </Card>

          {/* Big "Go Back Online" Button */}
          <Button
            variant="primary"
            size="large"
            icon={Radio}
            fullWidth
            style={{ height: '56px', fontSize: '16px', fontWeight: 'bold' }}
            onClick={handleGoBackOnline}
          >
            Go Back Online 🟢
          </Button>

        </div>
      )}

      {/* 7. REUSABLE MOCK CHAT THREAD MODAL */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-md)'
        }}>
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '420px',
            height: '520px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Chat Header */}
            <div style={{
              background: 'var(--color-black)',
              color: 'white',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{job.customer}</div>
                <div style={{ fontSize: '11px', color: '#BBB' }}>Customer • {job.phone}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Message List */}
            <div style={{ flex: 1, padding: 'var(--space-md)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', background: 'var(--color-bg)' }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === 'worker' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: msg.sender === 'worker' ? 'var(--color-accent)' : 'var(--color-white)',
                    color: msg.sender === 'worker' ? 'white' : 'var(--color-black)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    borderBottomRightRadius: msg.sender === 'worker' ? 2 : 'var(--radius-md)',
                    borderBottomLeftRadius: msg.sender === 'customer' ? 2 : 'var(--radius-md)',
                    fontSize: '13px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>{msg.text}</div>
                  <div style={{
                    fontSize: '10px',
                    color: msg.sender === 'worker' ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)',
                    textAlign: 'right',
                    marginTop: 2
                  }}>
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick-Reply Chips */}
            <div style={{ padding: '6px 10px', background: 'var(--color-white)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 6, overflowX: 'auto' }}>
              {[
                'I have arrived at the gate',
                'Please share floor number',
                'Need to buy 1/2" coupler',
                'Work completed!'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setNewChatText(chip);
                  }}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} style={{ padding: '8px 12px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 'var(--space-xs)', background: 'var(--color-white)' }}>
              <input
                type="text"
                className="ss-input"
                style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                placeholder="Type a message..."
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
              />
              <Button type="submit" variant="primary" size="small" icon={Send} />
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobManagement;
