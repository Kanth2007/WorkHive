import React, { useState } from 'react';
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
  User
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { useDemoStore } from '../../../context/DemoStoreContext';
import { mockSmartMatchWorkers } from '../data/mockWorkers';

export const BookingFlow = () => {
  const { workerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useCustomer();
  const { createBooking } = useDemoStore();

  // Find worker or fallback
  const worker = mockSmartMatchWorkers.find((w) => w.id === workerId) || mockSmartMatchWorkers[0];

  // Current Step: 1 to 6
  const [step, setStep] = useState(1);

  // Step 2: Date & Time
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('Now / ASAP (within 30 mins)');

  // Step 3: Duration
  const [duration, setDuration] = useState('2hr'); // '1hr' | '2hr' | 'half-day' | 'full-day'

  // Step 4: Address
  const [address, setAddress] = useState(
    user.addressDetails
      ? `${user.addressDetails}, ${user.location || 'Adyar, Chennai'}`
      : `Door 14, 2nd Main Road, Kasturba Nagar, Adyar, Chennai`
  );
  const [landmark, setLandmark] = useState('Near Adyar Signal');

  // Step 5: Service details (Default to exact demo request: "Kitchen pipe leakage under sink")
  const [problemDescription, setProblemDescription] = useState('Kitchen pipe leakage under sink');
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
    // Simulate attaching a photo
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

  const handleNext = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      // Step 6 confirm -> create live demo booking, trigger success animation and redirect
      const newBooking = createBooking({
        serviceCategory: 'Plumbing',
        serviceDetails: problemDescription || 'Kitchen pipe leakage under sink',
        workerId: worker.id,
        workerName: worker.name,
        amount: currentDurationObj.priceNum || 450
      });

      setIsSuccess(true);
      setTimeout(() => {
        const bookingId = newBooking.id || 'BK-1048';
        navigate(`/customer/tracking/${bookingId}?workerId=${worker.id}`);
      }, 1500);
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
          width: '100%',
          height: 5,
          background: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: 'var(--space-md)'
        }}>
          <div style={{
            height: '100%',
            background: 'var(--color-accent)',
            width: `${(step / 6) * 100}%`,
            transition: 'width 0.25s ease'
          }} />
        </div>

        {/* STEP 1: CONFIRM WORKER SUMMARY CARD */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Confirm Selected Worker</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                You are booking a verified cooperative worker for your service.
              </p>
            </div>

            <Card padding="lg" style={{ border: '1.5px solid var(--color-accent)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                <div style={{
                  width: 68,
                  height: 68,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-black)',
                  color: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {worker.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '19px', fontWeight: 'bold', margin: 0 }}>
                      {worker.name}
                    </h3>
                    <Badge variant="active">Match: {worker.matchScore}%</Badge>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: '12px', fontWeight: 600, marginTop: 2 }}>
                    <CheckCircle2 size={14} />
                    <span>✓ {worker.badge}</span>
                  </div>

                  <div className="text-secondary" style={{ fontSize: '13px', marginTop: 2 }}>
                    {worker.skill} • {worker.experience}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                marginTop: 'var(--space-md)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px'
              }}>
                <div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Affiliation</div>
                  <div className="text-bold" style={{ fontSize: '12px' }}>{worker.societyReg}</div>
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Rating</div>
                  <div className="text-bold">{worker.rating} ★ ({worker.reviews} jobs)</div>
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Proximity</div>
                  <div className="text-bold">{worker.distance}</div>
                </div>
              </div>
            </Card>

            <div style={{
              background: '#FFFDFB',
              border: '1px solid rgba(255, 106, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              fontSize: '13px'
            }}>
              <ShieldCheck size={20} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Zero middleman platform fee:</strong> The cooperative ensures standard fixed wages with direct worker payment.
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME PICKER */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>When should {worker.name} arrive?</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                Pick the most convenient day and time window.
              </p>
            </div>

            {/* Date Chips */}
            <div>
              <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
                Select Service Day
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {['Today', 'Tomorrow', 'This Saturday', 'This Sunday'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '12px var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      background: selectedDate === d ? 'var(--color-black)' : 'var(--color-white)',
                      color: selectedDate === d ? 'var(--color-white)' : 'var(--color-black)',
                      border: `1.5px solid ${selectedDate === d ? 'var(--color-black)' : 'var(--color-border)'}`,
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot List */}
            <div>
              <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
                Select Arrival Time Window
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {[
                  { id: 'Now / ASAP (within 30 mins)', label: '⚡ Now / ASAP', sub: 'Worker arrives in 30-45 mins' },
                  { id: 'Morning (9:00 AM – 12:00 PM)', label: 'Morning Slot', sub: '9:00 AM – 12:00 PM' },
                  { id: 'Afternoon (12:00 PM – 3:00 PM)', label: 'Afternoon Slot', sub: '12:00 PM – 3:00 PM' },
                  { id: 'Late Afternoon (3:00 PM – 6:00 PM)', label: 'Late Afternoon', sub: '3:00 PM – 6:00 PM' },
                  { id: 'Evening (6:00 PM – 9:00 PM)', label: 'Evening Slot', sub: '6:00 PM – 9:00 PM' }
                ].map((t) => {
                  const isSelected = selectedTime === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTime(t.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-white)',
                        border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', color: isSelected ? 'var(--color-accent)' : 'var(--color-black)' }}>
                          {t.label}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '12px' }}>{t.sub}</div>
                      </div>
                      {isSelected && <Check size={18} color="var(--color-accent)" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DURATION (1HR / 2HR / HALF-DAY / FULL-DAY) */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Estimated Work Duration</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                How much time does your repair or task require?
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {durationOptions.map((opt) => {
                const isSelected = duration === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setDuration(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-white)',
                      border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px', color: isSelected ? 'var(--color-accent)' : 'var(--color-black)' }}>
                          {opt.label}
                        </span>
                        {opt.popular && <Badge variant="active">Standard</Badge>}
                      </div>
                      <p className="text-secondary" style={{ fontSize: '13px', marginTop: 2 }}>
                        {opt.sub}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                        {opt.priceLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
              💡 If the job takes less time, you only pay the minimum standard visit fee.
            </div>
          </div>
        )}

        {/* STEP 4: ADDRESS EDITABLE TEXT AREA */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Service Address</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                Where should {worker.name} visit?
              </p>
            </div>

            <Card padding="md">
              <div className="ss-form-group">
                <label className="ss-label" htmlFor="booking-address">Full Home / Society Address</label>
                <textarea
                  id="booking-address"
                  className="ss-input"
                  style={{ minHeight: '90px', padding: '10px var(--space-md)', resize: 'vertical' }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat number, building name, street, neighborhood..."
                />
              </div>

              <div className="ss-form-group" style={{ marginBottom: 0 }}>
                <label className="ss-label" htmlFor="booking-landmark">Landmark (Optional)</label>
                <input
                  id="booking-landmark"
                  type="text"
                  className="ss-input"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite post office, near water tank"
                />
              </div>
            </Card>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontSize: '13px', fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              <span>Cooperative service ward verified: {user.location || 'Adyar, Chennai'}</span>
            </div>
          </div>
        )}

        {/* STEP 5: SERVICE DETAILS & PHOTO ATTACHMENT */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Describe the Problem</h2>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                Briefly describe what needs fixing so {worker.name} brings the right tools.
              </p>
            </div>

            <Card padding="md">
              <div className="ss-form-group">
                <label className="ss-label" htmlFor="problem-desc">Issue Details</label>
                <textarea
                  id="problem-desc"
                  className="ss-input"
                  style={{ minHeight: '90px', padding: '10px var(--space-md)', resize: 'vertical' }}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="e.g. Switchboard sparking, tap leaking, pipe blocked..."
                />
              </div>

              {/* Add Photo Button & Simulation */}
              <div>
                <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
                  Attach Photos (Optional)
                </label>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    variant="outline"
                    icon={Camera}
                    onClick={handleAddPhoto}
                  >
                    + Add Photo
                  </Button>

                  {attachedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      style={{
                        position: 'relative',
                        width: 56,
                        height: 56,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <img
                        src={photo.url}
                        alt="Attached problem"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          background: 'rgba(0, 0, 0, 0.65)',
                          color: 'white',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>

                {attachedPhotos.length > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: 'var(--space-xs)', fontWeight: 600 }}>
                    ✓ {attachedPhotos.length} photo attached for worker inspection
                  </div>
                )}
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
                Verify your booking summary before final confirmation.
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

                {attachedPhotos.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                    <span className="text-secondary">Photos Attached:</span>
                    <span className="text-bold">{attachedPhotos.length} photo(s)</span>
                  </div>
                )}
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
              <span>Payment is made directly to {worker.name} via UPI or Cash upon satisfaction.</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. BOTTOM NAVIGATION & CONFIRM ACTION BUTTON */}
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <Button
          variant="primary"
          size="large"
          icon={step === 6 ? CheckCircle2 : ArrowRight}
          iconPosition={step === 6 ? 'left' : 'right'}
          fullWidth
          onClick={handleNext}
        >
          {step === 1 && `Continue with ${worker.name}`}
          {step === 2 && 'Continue to Duration'}
          {step === 3 && 'Continue to Address'}
          {step === 4 && 'Continue to Problem Details'}
          {step === 5 && 'Review Final Summary'}
          {step === 6 && `Confirm Booking (${currentDurationObj.priceLabel})`}
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
                🟢 Booking Confirmed
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
