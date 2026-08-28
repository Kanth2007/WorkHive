import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Star,
  Heart,
  ShieldCheck,
  Sparkles,
  Home,
  Check
} from 'lucide-react';
import { Button, Card, Badge, StarRating } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { mockSmartMatchWorkers } from '../data/mockWorkers';

export const RatingFeedback = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, addBooking } = useCustomer();

  const workerId = searchParams.get('workerId') || 'ravi-kumar';
  const worker = mockSmartMatchWorkers.find((w) => w.id === workerId) || mockSmartMatchWorkers[0];

  // Rating State
  const [overallRating, setOverallRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [behaviourRating, setBehaviourRating] = useState(5);
  const [timelinessRating, setTimelinessRating] = useState(5);

  // Compliments & Feedback
  const [selectedCompliments, setSelectedCompliments] = useState(['Punctual & On-time', 'Neat Work']);
  const [comment, setComment] = useState('');

  // Thank-you screen state
  const [isSubmitted, setIsSubmitted] = useState(false);

  const complimentsList = [
    'Punctual & On-time',
    'Neat Work',
    'Expert Repair',
    'Fair & Transparent',
    'Polite & Respectful',
    'Safety Tools Used'
  ];

  const toggleCompliment = (comp) => {
    setSelectedCompliments((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // 1. Create the completed booking record and add to context
    const completedBooking = {
      id: bookingId || 'BK-1048',
      service: worker.skill || 'Electric Repair & Home Wiring',
      worker: worker.name,
      workerId: worker.id,
      rating: overallRating,
      date: 'Just now (Today)',
      status: 'completed',
      statusLabel: 'Completed & Paid',
      fee: '₹450 paid via UPI',
      address: user.location || 'Adyar, Chennai',
      review: {
        overallRating,
        subRatings: {
          quality: qualityRating,
          behaviour: behaviourRating,
          timeliness: timelinessRating
        },
        compliments: selectedCompliments,
        comment: comment || 'Work completed satisfactorily.'
      }
    };

    addBooking(completedBooking);

    // 2. Show thank you screen
    setIsSubmitted(true);

    // 3. Auto-route to Home after 2 seconds or on button click
    setTimeout(() => {
      navigate('/customer/home');
    }, 2200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Header */}
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
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
            Rating & Feedback
          </h1>
          <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
            {worker.name} • {worker.societyReg}
          </p>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Worker Header Card */}
          <Card padding="md" style={{ textAlign: 'center' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-black)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 'bold',
              margin: '0 auto var(--space-xs)'
            }}>
              {worker.avatar}
            </div>

            <h2 style={{ fontSize: '19px', fontWeight: 'bold', margin: '4px 0 2px' }}>
              How was your service with {worker.name}?
            </h2>
            <p className="text-secondary" style={{ fontSize: '13px', margin: '0 0 var(--space-md)' }}>
              Your honest feedback ensures fair cooperative assignments.
            </p>

            {/* 1. BIG 5-STAR TAP-TO-RATE OVERALL RATING */}
            <div style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md) var(--space-sm)',
              marginBottom: 'var(--space-md)'
            }}>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                OVERALL EXPERIENCE
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StarRating
                  rating={overallRating}
                  size={42}
                  interactive
                  onChange={setOverallRating}
                />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-accent)', marginTop: '8px' }}>
                {overallRating === 5 && '⭐⭐⭐⭐⭐ Excellent Service'}
                {overallRating === 4 && '⭐⭐⭐⭐ Very Good'}
                {overallRating === 3 && '⭐⭐⭐ Average'}
                {overallRating === 2 && '⭐⭐ Below Expectations'}
                {overallRating === 1 && '⭐ Poor'}
              </div>
            </div>

            {/* 2. THREE SMALLER SUB-RATINGS (QUALITY, BEHAVIOUR, TIMELINESS) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'left',
              borderTop: '1px solid var(--color-border)',
              paddingTop: 'var(--space-md)'
            }}>
              <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                DETAILED CRITERIA
              </div>

              {/* Quality Sub-rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Quality of Work</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Thorough repair & proper testing</div>
                </div>
                <StarRating
                  rating={qualityRating}
                  size={24}
                  interactive
                  onChange={setQualityRating}
                />
              </div>

              {/* Behaviour Sub-rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Behaviour & Politeness</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Courteous & respectful manner</div>
                </div>
                <StarRating
                  rating={behaviourRating}
                  size={24}
                  interactive
                  onChange={setBehaviourRating}
                />
              </div>

              {/* Timeliness Sub-rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Timeliness & Punctuality</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Arrived within promised slot</div>
                </div>
                <StarRating
                  rating={timelinessRating}
                  size={24}
                  interactive
                  onChange={setTimelinessRating}
                />
              </div>
            </div>

          </Card>

          {/* Compliment Chips */}
          <Card padding="md">
            <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
              Quick Compliments (Tap to add)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {complimentsList.map((comp) => {
                const isSelected = selectedCompliments.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleCompliment(comp)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'var(--color-black)' : 'var(--color-bg)',
                      color: isSelected ? 'white' : 'var(--color-black)',
                      border: '1px solid var(--color-border)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? `✓ ${comp}` : `+ ${comp}`}
                  </button>
                );
              })}
            </div>

            {/* 3. OPTIONAL COMMENT TEXT BOX */}
            <div style={{ marginTop: 'var(--space-md)' }}>
              <label className="ss-label" htmlFor="customer-feedback" style={{ display: 'block', marginBottom: '6px' }}>
                Tell us how it went (optional)
              </label>
              <textarea
                id="customer-feedback"
                className="ss-input"
                style={{ minHeight: '85px', padding: '10px', resize: 'vertical' }}
                placeholder="Tell us how it went (optional)... e.g. Ravi arrived on time, was very knowledgeable and solved the sparking issue quickly."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </Card>

          {/* 4. BIG "SUBMIT" BUTTON */}
          <div style={{ marginTop: 'var(--space-xs)' }}>
            <Button
              type="submit"
              variant="primary"
              size="large"
              icon={Heart}
              fullWidth
              style={{ fontSize: '17px', height: '56px', fontWeight: 'bold' }}
            >
              Submit Feedback
            </Button>
          </div>

        </form>
      ) : (
        /* THANK-YOU SCREEN */
        <Card padding="lg" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: '50px 20px' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>

          <div>
            <Badge variant="success" style={{ marginBottom: '6px' }}>
              Feedback Recorded
            </Badge>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 8px' }}>
              🎉 Thanks! Your feedback helps the cooperative.
            </h2>
            <p className="text-secondary" style={{ fontSize: '14px', lineHeight: 1.4 }}>
              Your rating of <strong>{overallRating} ★</strong> directly supports <strong>{worker.name}</strong>'s community record and ensures quality service for all neighbors.
            </p>
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <Button
              variant="primary"
              size="large"
              icon={Home}
              fullWidth
              onClick={() => navigate('/customer/home')}
            >
              Return to Home
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
};

export default RatingFeedback;
