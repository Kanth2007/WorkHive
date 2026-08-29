import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Star,
  Download,
  Share2,
  Sparkles,
  Home,
  Check,
  Printer,
  Heart,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, StarRating } from '../../../components';
import { workersAPI, bookingsAPI } from '../../../services/api';
import { useDemoStore } from '../../../context/DemoStoreContext';

export const PaymentCheckout = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeBooking, updateBookingStatus, submitRating } = useDemoStore();

  const workerId = searchParams.get('workerId') || activeBooking?.workerId || 'ravi-kumar';
  const [worker, setWorker] = useState({
    id: workerId,
    name: 'Ravi Kumar',
    phone: '+91 98401 11223',
    skill: 'Plumbing & Pipe Repair',
    badge: 'Verified Cooperative Worker',
    rating: 4.8,
    avatar: 'RK'
  });

  useEffect(() => {
    if (workerId) {
      workersAPI.getById(workerId).then(res => {
        if (res.success && res.data) {
          setWorker({
            id: res.data.workerId || res.data._id,
            name: res.data.name,
            phone: res.data.phone,
            skill: res.data.skill,
            badge: res.data.badge || 'Verified Cooperative Worker',
            rating: res.data.rating || 4.8,
            avatar: res.data.avatar || 'WK'
          });
        }
      }).catch(() => {});
    }
  }, [workerId]);

  // Flow State: 'checkout' | 'processing' | 'success' | 'invoice' | 'rating'
  const [flowState, setFlowState] = useState('checkout');

  // Payment Selection: 'upi' | 'card' | 'cash'
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Rating & Review State
  const [rating, setRating] = useState(5);
  const [selectedCompliments, setSelectedCompliments] = useState(['Punctual & On-time', 'Neat Work']);
  const [reviewNote, setReviewNote] = useState('Excellent work by Ravi, very punctual and resolved the kitchen leakage cleanly!');

  // Bill Pricing breakdown (₹450 total with 95/5 fair wage split)
  const totalAmount = activeBooking?.amount || 450;
  const serviceCharge = Math.round(totalAmount * 0.95); // ₹428 (95%)
  const coopContribution = totalAmount - serviceCharge; // ₹22 (5% welfare)

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

  // Trigger Loading Spinner on Pay & sync to MongoDB
  const handlePay = async () => {
    setFlowState('processing');
    const targetBookingId = bookingId || activeBooking?.bookingId || activeBooking?.id;
    if (targetBookingId) {
      try {
        await bookingsAPI.updateStatus(targetBookingId, { status: 'completed', paymentMethod });
      } catch (err) {
        console.warn('Booking payment status sync warning:', err.message);
      }
    }
    updateBookingStatus('completed', { paymentMethod });
    setTimeout(() => {
      setFlowState('success');
      setTimeout(() => {
        setFlowState('invoice');
      }, 1400);
    }, 1500);
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  const handleSubmitReview = () => {
    submitRating(rating, reviewNote);
    navigate('/customer/home');
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={() => {
              if (flowState === 'invoice') setFlowState('checkout');
              else if (flowState === 'rating') setFlowState('invoice');
              else navigate(-1);
            }}
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
              {flowState === 'checkout' && 'Settle Payment'}
              {flowState === 'processing' && 'Processing...'}
              {flowState === 'success' && 'Payment Successful'}
              {flowState === 'invoice' && 'Service Invoice & Receipt'}
              {flowState === 'rating' && 'Rate & Review Worker'}
            </h1>
            <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
              Booking #{bookingId || 'BK-1048'} • {worker.name}
            </p>
          </div>
        </div>

        <Badge variant="active" style={{ fontSize: '11px' }}>
          Cooperative Direct
        </Badge>
      </div>

      {/* 2. STAGE 1: PAYMENT CHECKOUT */}
      {flowState === 'checkout' && (
        <>
          {/* Bill Breakdown Card */}
          <Card padding="md">
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
              Service Bill Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              
              {/* Service Charge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Service charge (2 hrs)</div>
                  <div className="text-secondary" style={{ fontSize: '12px' }}>Direct labor fee paid to {worker.name}</div>
                </div>
                <span className="text-bold">₹{serviceCharge}</span>
              </div>

              {/* Cooperative Contribution Line Item */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>Cooperative contribution</span>
                    <Badge variant="success" style={{ fontSize: '10px', padding: '1px 5px' }}>5% Welfare</Badge>
                  </div>
                  <div className="text-secondary" style={{ fontSize: '12px' }}>Worker emergency health & tool safety fund</div>
                </div>
                <span className="text-bold">₹{coopContribution}</span>
              </div>

              {/* Platform Intermediary Fee */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="text-secondary">Platform service fee</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Direct cooperative pass-through</div>
                </div>
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>₹0</span>
              </div>

              {/* Total Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 'var(--space-sm)',
                borderTop: '1.5px solid var(--color-border)',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'var(--color-black)'
              }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--color-accent)' }}>₹{totalAmount}</span>
              </div>

            </div>
          </Card>

          {/* Payment Method Selector (Large Tappable Radio Cards) */}
          <div>
            <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
              Select Payment Method
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {[
                {
                  id: 'upi',
                  title: 'UPI Payment',
                  sub: 'Google Pay, PhonePe, Paytm, BHIM, or QR scan',
                  icon: QrCode,
                  popular: true
                },
                {
                  id: 'card',
                  title: 'Debit / Credit Card',
                  sub: 'RuPay, Visa, Mastercard, or Maestro',
                  icon: CreditCard
                },
                {
                  id: 'cash',
                  title: 'Cash to Worker',
                  sub: 'Handover ₹450 cash directly to helper',
                  icon: Banknote
                }
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                const Icon = m.icon;

                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-md)',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-white)',
                      border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Radio circle */}
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isSelected && (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-accent)' }} />
                      )}
                    </div>

                    {/* Icon container */}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--color-accent)' : 'var(--color-bg)',
                      color: isSelected ? 'white' : 'var(--color-black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={20} />
                    </div>

                    {/* Label & Subtitle */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 'bold', fontSize: '15px', color: isSelected ? 'var(--color-accent)' : 'var(--color-black)' }}>
                          {m.title}
                        </span>
                        {m.popular && <Badge variant="active" style={{ fontSize: '10px' }}>Instant</Badge>}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '12px', marginTop: 1 }}>
                        {m.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guarantee Note */}
          <div style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            fontSize: '12px'
          }}>
            <ShieldCheck size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />
            <span>Direct cooperative settlement: 100% of this payment reaches {worker.name} and the member welfare pool.</span>
          </div>

          {/* Big Pay Button */}
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <Button
              variant="primary"
              size="large"
              icon={CheckCircle2}
              fullWidth
              style={{ fontSize: '17px', height: '56px', fontWeight: 'bold' }}
              onClick={handlePay}
            >
              Pay ₹{totalAmount}
            </Button>
          </div>
        </>
      )}

      {/* 3. STAGE 2: 1-2s FAKE LOADING SPINNER */}
      {flowState === 'processing' && (
        <Card padding="lg" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)', padding: '60px 20px' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: '4px solid var(--color-accent-subtle)',
            borderTopColor: 'var(--color-accent)',
            animation: 'spin 0.8s linear infinite'
          }} />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px' }}>
              Processing Payment...
            </h2>
            <p className="text-secondary" style={{ fontSize: '13px' }}>
              Connecting to secure {paymentMethod.toUpperCase()} cooperative gateway
            </p>
          </div>
        </Card>
      )}

      {/* 4. STAGE 2.5: PAYMENT SUCCESS ANIMATION SCREEN */}
      {flowState === 'success' && (
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
              Transaction Complete
            </Badge>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>
              ✅ Payment Successful!
            </h2>
            <p className="text-secondary" style={{ fontSize: '14px' }}>
              ₹{totalAmount} paid to {worker.name} ({paymentMethod.toUpperCase()})
            </p>
          </div>
        </Card>
      )}

      {/* 5. STAGE 3: INVOICE & RECEIPT LAYOUT */}
      {flowState === 'invoice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Printable Invoice Card */}
          <div
            id="printable-invoice"
            style={{
              background: 'var(--color-white)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Invoice Top Strip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed var(--color-border)', paddingBottom: 'var(--space-md)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-black)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    W
                  </div>
                  <span style={{ fontSize: '17px', fontWeight: 'bold' }}>WorkHive</span>
                </div>
                <div className="text-secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                  Chennai Labour Cooperative • Ward 4
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Badge variant="success">PAID</Badge>
                <div className="text-secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                  Inv: #WH-2026-88421
                </div>
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Worker / Service Partner:</span>
                <span className="text-bold">{worker.name} (Verified)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Service Provided:</span>
                <span className="text-bold">{worker.skill}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Date & Time:</span>
                <span className="text-bold">29 August 2026, 4:45 PM</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Cooperative Society ID:</span>
                <span className="text-bold">#CLC-EL-402 (Ward 4)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Payment Status:</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
                  Paid via {paymentMethod.toUpperCase()} (Direct)
                </span>
              </div>
            </div>

            {/* Itemized Calculation */}
            <div style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Standard Labor Wage (2 hrs)</span>
                <span className="text-bold">₹{serviceCharge}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Cooperative Welfare Contribution</span>
                <span className="text-bold">₹{coopContribution}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Platform Intermediary Fee</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>₹0</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '6px',
                fontWeight: 'bold',
                fontSize: '15px'
              }}>
                <span>Total Amount Paid</span>
                <span style={{ color: 'var(--color-black)' }}>₹{totalAmount}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              Thank you for supporting community cooperative workers!
            </div>
          </div>

          {/* Action Buttons: Download Invoice & Done -> Rating */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Button
              variant="outline"
              icon={Printer}
              style={{ flex: 1 }}
              onClick={handleDownloadInvoice}
            >
              Download Invoice
            </Button>
            <Button
              variant="primary"
              icon={Star}
              style={{ flex: 1 }}
              onClick={() => navigate(`/customer/rating/${bookingId || 'BK-1048'}?workerId=${worker.id}`)}
            >
              Done (Rate Worker)
            </Button>
          </div>

        </div>
      )}


      {/* 6. STAGE 4: RATING & REVIEW SCREEN */}
      {flowState === 'rating' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          <Card padding="lg" style={{ textAlign: 'center' }}>
            <div style={{
              width: 56,
              height: 56,
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

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 2px' }}>
              How was your experience with {worker.name}?
            </h2>
            <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
              Your rating helps {worker.name} receive more priority cooperative allocations.
            </p>

            {/* Interactive Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-lg) 0' }}>
              <StarRating
                rating={rating}
                size={38}
                interactive
                onChange={setRating}
              />
            </div>

            {/* Compliment Chips */}
            <div style={{ textAlign: 'left', marginBottom: 'var(--space-md)' }}>
              <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
                What did you like the most?
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
            </div>

            {/* Appreciation Note */}
            <div style={{ textAlign: 'left' }}>
              <label className="ss-label" htmlFor="review-comment" style={{ display: 'block', marginBottom: '6px' }}>
                Appreciation Note (Optional)
              </label>
              <textarea
                id="review-comment"
                className="ss-input"
                style={{ minHeight: '80px', padding: '10px', resize: 'vertical' }}
                placeholder="Ravi arrived promptly, diagnosed the short circuit efficiently, and cleaned up afterwards..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </div>

          </Card>

          {/* Submit Review CTA */}
          <Button
            variant="primary"
            size="large"
            icon={Heart}
            fullWidth
            onClick={handleSubmitReview}
          >
            Submit Feedback & Return Home
          </Button>

        </div>
      )}

    </div>
  );
};

export default PaymentCheckout;
