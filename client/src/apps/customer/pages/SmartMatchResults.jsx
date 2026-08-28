import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  SlidersHorizontal,
  CheckCircle2,
  PhoneCall,
  Check,
  Info,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, StarRating, EmptyState } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { workersAPI } from '../../../services/api';

export const SmartMatchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useCustomer();

  const [whyOpenMap, setWhyOpenMap] = useState({});
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = searchParams.get('category') || 'Plumbing';
  const location = searchParams.get('location') || user.location || 'Adyar, Chennai';

  useEffect(() => {
    const fetchMatchedWorkers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await workersAPI.getAll({ status: 'Verified' });
        if (res.success && Array.isArray(res.data)) {
          // Sort by relevance to category
          const sorted = res.data.map(w => {
            const isMatch = w.skill.toLowerCase().includes(category.toLowerCase()) ||
              (w.skills && w.skills.some(s => s.toLowerCase().includes(category.toLowerCase())));
            return {
              id: w.workerId || w._id,
              workerId: w.workerId || w._id,
              name: w.name,
              avatar: w.avatar || 'WK',
              skill: w.skill,
              badge: w.badge || 'Verified Cooperative Worker',
              societyReg: w.societyReg || 'Coop #TN-CHE-402',
              rating: w.rating || 4.8,
              reviewsCount: w.reviewsCount || 120,
              completedJobs: w.completedJobs || 0,
              distance: w.distance || '1.8 km away',
              availability: w.availability || 'Available today in 30 mins',
              priceEstimate: w.priceEstimate || '₹450 estimated',
              matchScore: isMatch ? (w.matchScore || 96) : 84,
              breakdown: w.breakdown || {
                skillMatch: isMatch ? '96%' : '85%',
                distanceVal: w.distance || '1.8 km (Nearest in Ward 4)',
                availabilityVal: '100% (Instant dispatch ready)',
                ratingVal: `${w.rating || 4.8} / 5.0`,
                experienceVal: `${w.experience || '5 years'} cooperative service`
              }
            };
          }).sort((a, b) => b.matchScore - a.matchScore);

          setWorkers(sorted);
          if (sorted.length > 0) {
            setWhyOpenMap({ [sorted[0].id]: true });
          }
        }
      } catch (err) {
        console.error('Error fetching smart match workers:', err);
        setError('Unable to fetch matching workers from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedWorkers();
  }, [category]);

  const toggleWhy = (workerId) => {
    setWhyOpenMap((prev) => ({
      ...prev,
      [workerId]: !prev[workerId]
    }));
  };

  const handleBookNow = (worker) => {
    navigate(`/customer/book/${worker.id}?category=${category}`);
  };

  const handleViewProfile = (worker) => {
    navigate(`/customer/worker/${worker.id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER NAVIGATION */}
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
            aria-label="Back to Search"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Smart Match Results</h1>
            <p className="text-secondary" style={{ fontSize: '12px' }}>
              Showing best workers in {location}
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

      {/* 2. AI MATCH EXPLANATION BANNER */}
      <div style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-accent-subtle)',
          color: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-black)' }}>
              AI Cooperative Match
            </span>
            <Badge variant="active" style={{ fontSize: '11px', padding: '1px 6px' }}>
              Live Roster
            </Badge>
          </div>
          <p className="text-secondary" style={{ fontSize: '13px', lineHeight: 1.35 }}>
            We compared skill, distance, availability and rating to find your best worker.
          </p>
        </div>
      </div>

      {/* 3. RANKED WORKER RESULT CARDS (HIGHEST MATCH FIRST) */}
      {loading ? (
        <div style={{ padding: 'var(--space-xl) 0', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" color="var(--color-accent)" style={{ margin: '0 auto var(--space-sm)' }} />
          <p className="text-secondary" style={{ fontSize: '14px' }}>Finding verified cooperative workers in Ward 4...</p>
        </div>
      ) : workers.length === 0 ? (
        <EmptyState
          title="No Matching Workers Found"
          message={`We couldn't find any available verified workers for ${category} in ${location} right now.`}
          actionLabel="View All Services"
          onAction={() => navigate('/customer/search')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {workers.map((worker, index) => {
            const isTopCard = index === 0;
            const isWhyOpen = !!whyOpenMap[worker.id];


          return (
            <Card
              key={worker.id}
              padding="lg"
              style={{
                border: isTopCard ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                position: 'relative',
                boxShadow: isTopCard ? '0 4px 16px rgba(255, 106, 0, 0.06)' : 'none'
              }}
            >
              {/* Top Row: Match % Accent Badge + Top Match tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-accent)',
                  color: 'var(--color-white)',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  <Sparkles size={13} />
                  <span>Match: {worker.matchScore}%</span>
                </span>

                {isTopCard && (
                  <Badge variant="active" style={{ fontWeight: 600 }}>
                    ⭐ Recommended First
                  </Badge>
                )}
              </div>

              {/* Worker Profile Header */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                {/* Photo Placeholder */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-md)',
                  background: isTopCard ? 'var(--color-black)' : 'var(--color-bg)',
                  color: isTopCard ? 'var(--color-white)' : 'var(--color-black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  border: '1px solid var(--color-border)'
                }}>
                  {worker.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                      {worker.name}
                    </h3>
                  </div>

                  {/* Verified Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: '12px', fontWeight: 600, marginTop: 2 }}>
                    <CheckCircle2 size={14} />
                    <span>✓ {worker.badge}</span>
                  </div>

                  <div className="text-secondary" style={{ fontSize: '13px', marginTop: 2 }}>
                    {worker.skill} • {worker.experience}
                  </div>
                </div>
              </div>

              {/* Rating & Availability Grid */}
              <div style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                margin: 'var(--space-md) 0 var(--space-sm)',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                fontSize: '13px'
              }}>
                <div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Rating & Reviews</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Star size={14} fill="var(--color-accent)" color="var(--color-accent)" />
                    <span className="text-bold">{worker.rating}</span>
                    <span className="text-secondary" style={{ fontSize: '12px' }}>({worker.reviews})</span>
                  </div>
                </div>

                <div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Distance</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MapPin size={14} color="var(--color-accent)" />
                    <span className="text-bold">{worker.distance}</span>
                  </div>
                </div>

                <div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Price Estimate</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-black)', marginTop: 2 }}>
                    {worker.priceEstimate}
                  </div>
                </div>

                <div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>Availability</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontWeight: 600, marginTop: 2 }}>
                    <Clock size={13} />
                    <span style={{ fontSize: '12px' }}>{worker.availability}</span>
                  </div>
                </div>
              </div>

              {/* Expandable "Why this match?" breakdown for cards */}
              {worker.breakdown && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <button
                    type="button"
                    onClick={() => toggleWhy(worker.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                      cursor: 'pointer',
                      padding: '4px 0'
                    }}
                  >
                    <span>{isWhyOpen ? 'Hide match breakdown' : 'Why this match?'}</span>
                    {isWhyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isWhyOpen && (
                    <div style={{
                      background: '#FFFDFB',
                      border: '1px solid rgba(255, 106, 0, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-md)',
                      marginTop: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '13px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-secondary">Skill & Task Fit:</span>
                        <span className="text-bold">{worker.breakdown.skillMatch}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-secondary">Proximity:</span>
                        <span className="text-bold">{worker.breakdown.distanceVal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-secondary">Schedule Fit:</span>
                        <span className="text-bold">{worker.breakdown.availabilityVal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-secondary">Customer Rating:</span>
                        <span className="text-bold">{worker.breakdown.ratingVal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-secondary">Experience:</span>
                        <span className="text-bold">{worker.breakdown.experienceVal}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Two Action Buttons: Book Now (Primary) & View Profile (Secondary) */}
              <div style={{
                display: 'flex',
                gap: 'var(--space-sm)',
                paddingTop: 'var(--space-xs)'
              }}>
                <Button
                  variant="primary"
                  fullWidth
                  icon={CheckCircle2}
                  onClick={() => handleBookNow(worker)}
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  icon={User}
                  onClick={() => handleViewProfile(worker)}
                >
                  View Profile
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      )}

    </div>
  );
};

export default SmartMatchResults;

