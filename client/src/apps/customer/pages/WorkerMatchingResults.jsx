import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  PhoneCall,
  SlidersHorizontal,
  Zap,
  Users,
  Award
} from 'lucide-react';
import { Button, Card, Badge, StarRating, LoadingState } from '../../../components';
import { useCustomer } from '../context/CustomerContext';

const categoryDetails = {
  electrician: { name: 'Electrician', emoji: '⚡', fee: '₹250 fixed visit fee' },
  plumber: { name: 'Plumber', emoji: '🔧', fee: '₹300 fixed visit fee' },
  carpenter: { name: 'Carpenter', emoji: '🪚', fee: '₹300 fixed visit fee' },
  painter: { name: 'Painter', emoji: '🎨', fee: '₹400 / room' },
  cleaner: { name: 'Cleaner', emoji: '🧹', fee: '₹350 / session' },
  caregiver: { name: 'Caregiver', emoji: '👩‍⚕️', fee: '₹450 / day' },
  driver: { name: 'Driver', emoji: '🚗', fee: '₹350 / 4 hrs' },
  gardener: { name: 'Gardener', emoji: '🌱', fee: '₹280 / session' },
  helper: { name: 'Domestic Helper', emoji: '🏠', fee: '₹300 / day' },
  technician: { name: 'Technician', emoji: '🔧', fee: '₹350 fixed visit fee' }
};

export const WorkerMatchingResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useCustomer();

  const category = searchParams.get('category') || 'electrician';
  const location = searchParams.get('location') || user.location || 'Adyar, Chennai';
  const radius = searchParams.get('radius') || '5';
  const date = searchParams.get('date') || 'Today';
  const time = searchParams.get('time') || 'Now';
  const gender = searchParams.get('gender') || 'any';

  const catMeta = categoryDetails[category] || { name: category, emoji: '🔧', fee: '₹250' };

  // AI Matching state simulation
  const [isMatching, setIsMatching] = useState(true);
  const [matchingStep, setMatchingStep] = useState('Scanning verified cooperative roster...');
  const [bookedWorker, setBookedWorker] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setMatchingStep(`Filtering workers within ${radius} km of ${location}...`);
    }, 450);

    const t2 = setTimeout(() => {
      setMatchingStep('Optimizing for fair cooperative allocation & response time...');
    }, 900);

    const t3 = setTimeout(() => {
      setIsMatching(false);
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [category, location, radius]);

  // Generate customized worker cards based on category and gender
  const workers = [
    {
      id: 'w-1',
      name: gender === 'female' ? 'Sunita Shinde' : 'Ramesh Patil',
      matchScore: '98% Best Match',
      highlight: 'Top Rated in Ward 4',
      rating: 4.9,
      reviews: 248,
      experience: '8 years experience',
      distance: '1.2 km away',
      eta: time === 'Now' ? 'Arrives in 25 mins' : `${date}, ${time}`,
      badge: 'Coop Verified Star',
      rate: catMeta.fee
    },
    {
      id: 'w-2',
      name: gender === 'female' ? 'M. Lakshmi' : 'K. Balaji',
      matchScore: '94% Match',
      highlight: 'Nearest to your address',
      rating: 4.8,
      reviews: 190,
      experience: '6 years experience',
      distance: '0.8 km away',
      eta: time === 'Now' ? 'Arrives in 35 mins' : `${date}, ${time}`,
      badge: 'Immediate Available',
      rate: catMeta.fee
    },
    {
      id: 'w-3',
      name: gender === 'female' ? 'Lata Gaikwad' : 'Santosh More',
      matchScore: '91% Match',
      highlight: 'Senior Specialist',
      rating: 4.75,
      reviews: 312,
      experience: '11 years experience',
      distance: '2.1 km away',
      eta: `${date}, ${time}`,
      badge: 'Master Helper',
      rate: catMeta.fee
    }
  ];

  const handleBook = (w) => {
    setBookedWorker(w);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={() => navigate(`/customer/search?category=${category}`)}
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
            aria-label="Back to Search Filters"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {catMeta.emoji} Available {catMeta.name}s
            </h1>
            <p className="text-secondary" style={{ fontSize: '12px' }}>
              {location} • Radius: {radius} km
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="small"
          icon={SlidersHorizontal}
          onClick={() => navigate(`/customer/search?category=${category}`)}
        >
          Filters
        </Button>
      </div>

      {/* Applied Filters Pill Summary */}
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        alignItems: 'center',
        fontSize: '12px'
      }}>
        <span className="text-secondary" style={{ fontWeight: 600 }}>Filter criteria:</span>
        <Badge variant="neutral">{catMeta.emoji} {catMeta.name}</Badge>
        <Badge variant="neutral">📅 {date}</Badge>
        <Badge variant="neutral">⏰ {time}</Badge>
        {gender !== 'any' && <Badge variant="active">👤 {gender} only</Badge>}
      </div>

      {/* Matching State or Results */}
      {isMatching ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: 'var(--space-xxl) var(--space-lg)' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--color-accent-subtle)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-md)'
          }}>
            <Sparkles size={28} className="animate-spin" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
            AI Cooperative Matching
          </h2>
          <p className="text-secondary" style={{ fontSize: '14px', maxWidth: '300px', margin: '0 auto' }}>
            {matchingStep}
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Matched Cooperative Workers ({workers.length})
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
              ✓ Direct Member Rates
            </span>
          </div>

          {workers.map((w, index) => (
            <Card key={w.id} padding="md" style={{ position: 'relative' }}>
              
              {/* Match Score Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Badge variant={index === 0 ? 'active' : 'success'}>
                    <Sparkles size={12} style={{ marginRight: 2 }} />
                    <span>{w.matchScore}</span>
                  </Badge>
                  <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>
                    {w.highlight}
                  </span>
                </div>
                <Badge variant="neutral">{w.badge}</Badge>
              </div>

              {/* Worker Name & Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'var(--space-xs)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{w.name}</h3>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{w.rate}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', margin: '4px 0 var(--space-sm)' }}>
                <StarRating rating={w.rating} count={w.reviews} />
                <span className="text-secondary" style={{ fontSize: '13px' }}>{w.experience}</span>
              </div>

              <div style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                marginBottom: 'var(--space-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} color="var(--color-accent)" />
                  <span>{w.distance} ({location})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, color: 'var(--color-success)' }}>
                  <Clock size={14} />
                  <span>{w.eta}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant={index === 0 ? 'primary' : 'outline'}
                fullWidth
                icon={CheckCircle2}
                onClick={() => handleBook(w)}
              >
                Book {w.name}
              </Button>
            </Card>
          ))}

        </div>
      )}

      {/* Booking Confirmation Dialog */}
      {bookedWorker && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-md)'
        }}>
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl) var(--space-lg)',
            maxWidth: '380px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--color-success-bg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: 'var(--color-success)'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <div>
              <Badge variant="success" style={{ marginBottom: 'var(--space-xs)' }}>
                Booking Confirmed
              </Badge>
              <h3 style={{ fontSize: '20px', margin: '4px 0' }}>
                {bookedWorker.name} is Confirmed!
              </h3>
              <p className="text-secondary" style={{ fontSize: '14px' }}>
                Service: <strong>{catMeta.name}</strong> • Scheduled for <strong>{date}, {time}</strong>.
              </p>
            </div>

            <div style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm) var(--space-md)',
              fontSize: '13px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span className="text-secondary">Address:</span>
                <span className="text-bold">{location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span className="text-secondary">Cooperative Rate:</span>
                <span className="text-bold">{bookedWorker.rate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Payment:</span>
                <span className="text-bold">Pay after service</span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setBookedWorker(null);
                navigate('/customer/bookings');
              }}
            >
              View My Bookings
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkerMatchingResults;
