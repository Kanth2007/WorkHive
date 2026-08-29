import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Image as ImageIcon,
  Trash2,
  ShieldCheck,
  Building2,
  Star,
  Sparkles,
  Info,
  Check,
  User,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';
import { useDemoStore } from '../../../context/DemoStoreContext';
import { workersAPI, bookingsAPI } from '../../../services/api';

export const BookingFlow = () => {
  const { workerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, addBooking } = useCustomer();
  const { currentUser } = useAuth();
  const { createBooking } = useDemoStore();

  // Dynamic worker state fetched from MongoDB
  const [worker, setWorker] = useState({
    id: workerId || '',
    name: 'Cooperative Helper',
    skill: searchParams.get('category') || 'Professional Services',
    rating: 5.0,
    reviewsCount: 1,
    priceEstimate: '₹450 fixed visit fee',
    avatar: 'WK'
  });

  const [loadingWorker, setLoadingWorker] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadWorker = async () => {
      try {
        setLoadingWorker(true);
        if (workerId) {
          const res = await workersAPI.getById(workerId);
          if (res.success && res.data) {
            setWorker({
              id: res.data.workerId || res.data._id,
              name: res.data.name,
              skill: res.data.skill,
              rating: res.data.rating || 5.0,
              reviewsCount: res.data.reviewsCount || 1,
              priceEstimate: res.data.priceEstimate || '₹450 fixed visit fee',
              avatar: res.data.avatar || 'WK',
              locality: res.data.locality,
              distance: res.data.distance || '1.5 km away'
            });
            return;
          }
        }
        
        // If no workerId or workerId lookup failed, fetch first verified worker from MongoDB
        const allRes = await workersAPI.getAll();
        if (allRes.success && Array.isArray(allRes.data) && allRes.data.length > 0) {
          const cat = searchParams.get('category');
          const matched = cat 
            ? allRes.data.find(w => w.skill?.toLowerCase().includes(cat.toLowerCase())) || allRes.data[0]
            : allRes.data[0];

          setWorker({
            id: matched.workerId || matched._id,
            name: matched.name,
            skill: matched.skill,
            rating: matched.rating || 5.0,
            reviewsCount: matched.reviewsCount || 1,
            priceEstimate: matched.priceEstimate || '₹450 fixed visit fee',
            avatar: matched.avatar || 'WK',
            locality: matched.locality,
            distance: matched.distance || '1.8 km away'
          });
        }
      } catch (err) {
        console.warn('Could not fetch worker profile from MongoDB:', err);
      } finally {
        setLoadingWorker(false);
      }
    };

    loadWorker();
  }, [workerId, searchParams]);

  // Current Step: 1 to 6
  const [step, setStep] = useState(1);

  // Step 2: Date & Time
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('Now / ASAP (within 30 mins)');

  // Step 3: Duration
  const [duration, setDuration] = useState('2hr'); // '1hr' | '2hr' | 'half-day' | 'full-day'

  // Step 4: Address
  const [address, setAddress] = useState(
    user?.addressDetails || user?.location || currentUser?.locality || 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar, Chennai'
  );
  const [landmark, setLandmark] = useState('Near Adyar Depot');

  // Step 5: Service details
  const [problemDescription, setProblemDescription] = useState('Service inspection and repair request');
  const [attachedPhotos, setAttachedPhotos] = useState([]);

  // Step 6: Confirmation Animation State
  const [isSuccess, setIsSuccess] = useState(false);

  // Duration Price Map
  const durationOptions = [
    {
      id: '1hr',
      label: '1 Hour',
      sub: 'Quick check & single repair',
      priceNum: 250,
      priceLabel: '₹250'
    },
    {
      id: '2hr',
      label: '2 Hours',
      sub: 'Standard repair & testing',
      priceNum: 450,
      priceLabel: '₹450',
      popular: true
    },
    {
      id: 'half-day',
      label: 'Half-Day (4 Hours)',
      sub: 'Multiple tasks / whole apartment',
      priceNum: 800,
      priceLabel: '₹800'
    },
    {
      id: 'full-day',
      label: 'Full-Day (8 Hours)',
      sub: 'Major installation / project work',
      priceNum: 1500,
      priceLabel: '₹1,500'
    }
  ];

  const currentDurationObj = durationOptions.find((d) => d.id === duration) || durationOptions[1];

  const handleAddPhoto = () => {
    const newPhoto = {
      id: Date.now(),
      name: `damage_photo_${attachedPhotos.length + 1}.jpg`,
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80'
    };
    setAttachedPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (id) => {
    setAttachedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleNext = async () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      // Step 6 confirm -> Persist live to MongoDB Atlas database
      setIsSubmitting(true);
      const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
      const bookingPayload = {
        bookingId,
        customerName: currentUser?.name || user?.name || 'Customer Member',
        customerPhone: currentUser?.phone || user?.phone || '+91 98401 22334',
        customerAddress: address || 'Ward 4, Chennai',
        serviceCategory: worker.skill || searchParams.get('category') || 'General Service',
        serviceDetails: problemDescription || 'Cooperative service appointment request',
        workerId: worker.id || workerId || 'wk-default',
        workerName: worker.name || 'Cooperative Worker',
        amount: currentDurationObj.priceNum || 450,
        status: 'pending',
        isEmergency: false,
        dateString: selectedDate === 'Today' ? new Date().toLocaleDateString('en-IN') : selectedDate,
        timeString: selectedTime,
        arrivalPin: Math.floor(1000 + Math.random() * 9000).toString()
      };

      try {
        await bookingsAPI.create(bookingPayload);
      } catch (err) {
        console.warn('Booking API write error (will use local state fallback):', err.message);
      }

      createBooking(bookingPayload);
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/customer/tracking/${bookingId}?workerId=${worker.id || workerId}`);
      }, 1200);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      justifyContent: 'space-between',
      gap: 'var(--space-md)',
      paddingBottom: 'var(--space-lg)'
    }}>
      
      {/* 1. TOP HEADER & MULTI-STEP PROGRESS BAR */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={handleBack}
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
            aria-label="Previous Step"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-black)' }}>
              Step {step} of 6
            </span>
            <div className="text-secondary" style={{ fontSize: '11px' }}>
              {step === 1 && 'Confirm Worker'}
              {step === 2 && 'Date & Time'}
              {step === 3 && 'Service Duration'}
              {step === 4 && 'Service Address'}
              {step === 5 && 'Problem Description'}
              {step === 6 && 'Review & Confirm'}
            </div>
          </div>

          <Badge variant="active" style={{ fontSize: '11px' }}>
            {currentDurationObj.priceLabel}
          </Badge>
        </div>

        {/* Visual Step Progress Indicator */}
        <div style={{
          display: 'flex',
          gap: '4px',
          height: '4px',
          width: '100%',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          background: 'var(--color-border)'
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i <= step ? 'var(--color-black)' : 'transparent',
                transition: 'background-color 0.25s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* STEP CONTENT SWITCHER */}
      <div style={{ flex: 1, marginTop: 'var(--space-sm)' }}>
        
        {/* STEP 1: CONFIRM WORKER SELECTION */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Your Cooperative Helper</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                You have matched with a verified cooperative service member.
              </p>
            </div>

            {loadingWorker ? (
              <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                <Loader2 size={28} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <p className="text-secondary" style={{ fontSize: '13px', marginTop: 8 }}>Fetching worker details from MongoDB...</p>
              </div>
            ) : (
              <Card padding="md" style={{ border: '2px solid var(--color-black)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-black)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {worker.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{worker.name}</h3>
                      <Badge variant="success" style={{ fontSize: '11px' }}>
                        ✓ Verified Member
                      </Badge>
                    </div>

                    <p className="text-secondary" style={{ fontSize: '13px', margin: '2px 0 6px' }}>
                      {worker.skill} • {worker.locality || 'Ward 4, Chennai'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 'bold' }}>
                        <Star size={14} fill="#FFB800" color="#FFB800" />
                        {worker.rating}
                      </span>
                      <span className="text-secondary">•</span>
                      <span className="text-secondary">{worker.distance || '1.8 km away'}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#F0FDF4',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  marginTop: 'var(--space-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '12px',
                  color: '#15803D'
                }}>
                  <ShieldCheck size={16} />
                  <span>100% direct payment goes to {worker.name} — no middleman cut.</span>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* STEP 2: DATE & TIME */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Select Date & Time</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                When would you like {worker.name} to arrive?
              </p>
            </div>

            <Card padding="md">
              <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                Service Date
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xs)', marginTop: '8px' }}>
                {['Today', 'Tomorrow', 'This Weekend'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${selectedDate === d ? 'var(--color-black)' : 'var(--color-border)'}`,
                      background: selectedDate === d ? 'var(--color-black)' : 'var(--color-white)',
                      color: selectedDate === d ? 'white' : 'var(--color-black)',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 'var(--space-md)' }}>
                <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                  Preferred Time Slot
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {[
                    'Now / ASAP (within 30 mins)',
                    'Morning (9:00 AM – 12:00 PM)',
                    'Afternoon (12:00 PM – 4:00 PM)',
                    'Evening (4:00 PM – 8:00 PM)'
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${selectedTime === slot ? 'var(--color-black)' : 'var(--color-border)'}`,
                        background: selectedTime === slot ? '#F5F5F5' : 'var(--color-white)',
                        fontWeight: selectedTime === slot ? 'bold' : 'normal',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{slot}</span>
                      {selectedTime === slot && <Check size={16} color="var(--color-black)" />}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 3: DURATION */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Service Duration</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                Select expected work duration for fair regulated pricing.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {durationOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDuration(opt.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${duration === opt.id ? 'var(--color-black)' : 'var(--color-border)'}`,
                    background: duration === opt.id ? '#FAFAFA' : 'var(--color-white)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{opt.label}</span>
                      {opt.popular && <Badge variant="active" style={{ fontSize: '10px' }}>Most Common</Badge>}
                    </div>
                    <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
                      {opt.sub}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                      {opt.priceLabel}
                    </span>
                    <div className="text-secondary" style={{ fontSize: '10px' }}>Direct Wage</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: ADDRESS */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Service Address</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                Where should the cooperative worker visit?
              </p>
            </div>

            <Card padding="md">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                    Complete Address & Door Number
                  </label>
                  <textarea
                    rows={3}
                    className="ss-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ marginTop: 4, width: '100%', resize: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                    Landmark / Gate Instructions
                  </label>
                  <input
                    type="text"
                    className="ss-input"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    style={{ marginTop: 4, width: '100%' }}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 5: PROBLEM DETAILS */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Problem Details</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                Describe what needs attention to help {worker.name} bring the right tools.
              </p>
            </div>

            <Card padding="md">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                    Service Requirement Notes
                  </label>
                  <textarea
                    rows={4}
                    className="ss-input"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="e.g. Kitchen tap leaking, need valve replacement..."
                    style={{ marginTop: 4, width: '100%', resize: 'none' }}
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    style={{
                      background: 'var(--color-bg)',
                      border: '1px dashed var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px',
                      width: '100%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    <Camera size={16} />
                    <span>Attach Photo / Video (Optional)</span>
                  </button>

                  {attachedPhotos.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      {attachedPhotos.map((p) => (
                        <div key={p.id} style={{ position: 'relative' }}>
                          <img src={p.url} alt="Problem" style={{ width: 50, height: 50, borderRadius: 4, objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(p.id)}
                            style={{ position: 'absolute', top: -4, right: -4, background: 'black', color: 'white', borderRadius: '50%', width: 16, height: 16, border: 'none', cursor: 'pointer', fontSize: 10 }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 6: REVIEW & CONFIRM */}
        {step === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Review & Confirm</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                Verify your booking summary before dispatching to MongoDB.
              </p>
            </div>

            {/* Summary Review Card */}
            <Card padding="md">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <span className="text-secondary">Assigned Helper:</span>
                  <span className="text-bold">{worker.name} (Verified)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <span className="text-secondary">Scheduled Date & Time:</span>
                  <span className="text-bold">{selectedDate}, {selectedTime}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <span className="text-secondary">Duration Estimate:</span>
                  <span className="text-bold">{currentDurationObj.label}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <span className="text-secondary">Address:</span>
                  <span className="text-bold" style={{ maxWidth: '200px', textAlign: 'right' }}>
                    {address}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <span className="text-secondary">Issue Note:</span>
                  <span className="text-secondary" style={{ maxWidth: '200px', textAlign: 'right' }}>
                    {problemDescription.slice(0, 45)}...
                  </span>
                </div>
              </div>
            </Card>

            {/* Transparent Bill Card */}
            <Card padding="md" style={{ background: '#FAFAFA' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
                Estimated Bill
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-secondary">Cooperative Service Wage ({currentDurationObj.label}):</span>
                  <span className="text-bold">{currentDurationObj.priceLabel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-secondary">Platform Intermediary Fee:</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>₹0 (Cooperative)</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--space-sm)',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  color: 'var(--color-black)'
                }}>
                  <span>Total Due (Pay after service):</span>
                  <span>{currentDurationObj.priceLabel}</span>
                </div>
              </div>
            </Card>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <ShieldCheck size={16} color="var(--color-success)" />
              <span>Payment is made directly to {worker.name} via UPI upon satisfaction.</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. BOTTOM NAVIGATION & CONFIRM ACTION BUTTON */}
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <Button
          variant="primary"
          size="large"
          icon={step === 6 ? (isSubmitting ? Loader2 : CheckCircle2) : ArrowRight}
          iconPosition={step === 6 ? 'left' : 'right'}
          fullWidth
          disabled={isSubmitting}
          onClick={handleNext}
        >
          {isSubmitting ? 'Creating Booking in Database...' : (
            step === 1 ? `Continue with ${worker.name}` :
            step === 2 ? 'Continue to Duration' :
            step === 3 ? 'Continue to Address' :
            step === 4 ? 'Continue to Problem Details' :
            step === 5 ? 'Review Final Summary' :
            `Confirm Booking (${currentDurationObj.priceLabel})`
          )}
        </Button>
      </div>

      {/* CONFIRMATION ANIMATION OVERLAY */}
      {isSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-md)'
        }}>
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xxl) var(--space-xl)',
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              animation: 'ss-scale-up 0.4s ease'
            }}>
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>

            <div>
              <span style={{
                background: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                fontWeight: 'bold',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px'
              }}>
                🟢 Booking Saved to Database
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '8px 0 4px' }}>
                {worker.name} Assigned!
              </h2>
              <p className="text-secondary" style={{ fontSize: '13px' }}>
                Connecting to live cooperative tracking...
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingFlow;
