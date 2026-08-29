import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  PhoneCall,
  ShieldAlert,
  Clock,
  CheckCircle2,
  MapPin,
  Zap,
  Wrench,
  KeyRound,
  Sparkles,
  HeartPulse,
  Flame,
  Check,
  Star,
  Navigation,
  ArrowRight,
  Loader2,
  Tv
} from 'lucide-react';
import { Button, Card, Badge, StarRating, EmptyState } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';
import { useDemoStore } from '../../../context/DemoStoreContext';
import { workersAPI, bookingsAPI } from '../../../services/api';

export const EmergencyService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useCustomer();
  const { currentUser } = useAuth();
  const { createBooking } = useDemoStore();

  // Emergency Categories
  const emergencyCategories = [
    {
      id: 'electrician',
      name: 'Electrician',
      icon: Zap,
      urgentTag: 'Spark / Power Loss',
      defaultDesc: 'Main switchboard sparking and power tripping in entire flat.',
      color: '#FF6A00'
    },
    {
      id: 'plumber',
      name: 'Plumber',
      icon: Wrench,
      urgentTag: 'Pipe Burst / Flood',
      defaultDesc: 'Main water supply pipe burst flooding the kitchen and living room.',
      color: '#0070F3'
    },
    {
      id: 'carpenter',
      name: 'Lock & Door Entry',
      icon: KeyRound,
      urgentTag: 'Lockout / Jammed Door',
      defaultDesc: 'Main door latch jammed / lockout with key broken inside.',
      color: '#10B981'
    },
    {
      id: 'caregiver',
      name: 'Elder Medical Help',
      icon: HeartPulse,
      urgentTag: 'Mobility / Fall Assistance',
      defaultDesc: 'Senior citizen urgent physical support and mobility assistance required.',
      color: '#EC4899'
    },
    {
      id: 'technician',
      name: 'Appliance / AC Tech',
      icon: Tv,
      urgentTag: 'Gas Leak / AC Spark',
      defaultDesc: 'AC or refrigerator short circuit burning smell and cooling failure.',
      color: '#8B5CF6'
    }
  ];

  // Resolve initial category from URL parameter if passed (e.g. ?category=plumber or ?service=Plumbing)
  const initialCategoryParam = searchParams.get('category') || searchParams.get('service') || searchParams.get('trade') || searchParams.get('query') || '';
  
  const findMatchingCategoryId = (param) => {
    if (!param) return 'electrician';
    const p = param.toLowerCase().trim();
    if (p.includes('plumb') || p.includes('pipe') || p.includes('leak') || p.includes('water')) return 'plumber';
    if (p.includes('carpent') || p.includes('door') || p.includes('lock') || p.includes('wood')) return 'carpenter';
    if (p.includes('care') || p.includes('elder') || p.includes('medical') || p.includes('nurse')) return 'caregiver';
    if (p.includes('tech') || p.includes('ac') || p.includes('appliance') || p.includes('fridge')) return 'technician';
    if (p.includes('electr') || p.includes('spark') || p.includes('fuse') || p.includes('power') || p.includes('switch')) return 'electrician';
    return 'electrician';
  };

  const [selectedCategory, setSelectedCategory] = useState(() => findMatchingCategoryId(initialCategoryParam));
  
  // State: 'form' | 'results' (defaults to 'results' if arriving with a specific search param)
  const [viewState, setViewState] = useState(() => initialCategoryParam ? 'results' : 'form');

  const currentCatObj = emergencyCategories.find(c => c.id === selectedCategory) || emergencyCategories[0];
  const [problemDescription, setProblemDescription] = useState(() => currentCatObj.defaultDesc);
  const [emergencyWorkers, setEmergencyWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  const quickIssueChips = {
    electrician: [
      'Main electrical spark & MCB tripping',
      'Sudden total power outage in flat',
      'Inverter burning smell & short circuit',
      'Geyser water heater switchboard short'
    ],
    plumber: [
      'Kitchen supply pipe burst & flooding',
      'Overhead tank overflow flooding roof',
      'Main bathroom tap broken & gushing water',
      'Drainage blockage overflow into house'
    ],
    carpenter: [
      'Main entrance door jammed / Lockout',
      'Key broken inside cylinder lock',
      'Door hinge detached posing security risk',
      'Window latch broken during storm'
    ],
    caregiver: [
      'Senior citizen medical mobility help',
      'Urgent bedside patient assistance',
      'Post-discharge elderly caregiving support',
      'Emergency physical wheelchair transport'
    ],
    technician: [
      'AC sparking with smoke and burning odor',
      'Refrigerator compressor short circuit',
      'Washing machine motor burning smell',
      'Microwave electrical sparking'
    ]
  };

  // Strict Matching Function: Only matches workers whose certified trade corresponds to the selected category
  const matchEmergencyTrade = (workerSkill = '', cat = '') => {
    if (!workerSkill || !cat) return false;
    const s = workerSkill.toLowerCase().trim();
    const c = cat.toLowerCase().trim();

    if (s === c) return true;
    if (s.includes(c) || c.includes(s)) return true;

    const stemS = s.replace(/[^a-z]/g, '').slice(0, 4);
    const stemC = c.replace(/[^a-z]/g, '').slice(0, 4);
    if (stemS && stemC && stemS === stemC) return true;

    const tradeKeywords = {
      electrician: ['electric', 'electrical', 'wiring', 'fuse', 'switch', 'light', 'circuit', 'inverter', 'power'],
      plumber: ['plumb', 'plumbing', 'pipe', 'leak', 'drain', 'tap', 'valve', 'tank', 'washbasin', 'water'],
      carpenter: ['carpent', 'carpentry', 'wood', 'furniture', 'door', 'lock', 'latch', 'key', 'table'],
      caregiver: ['care', 'caregiver', 'caregiving', 'nurse', 'elderly', 'patient', 'medical', 'first aid', 'mobility'],
      technician: ['technician', 'tech', 'appliance', 'ac', 'refrigerator', 'washing machine', 'tv', 'ro', 'geyser', 'repair']
    };

    for (const [trade, keywords] of Object.entries(tradeKeywords)) {
      const isCatMatched = c.includes(trade) || keywords.some(k => c.includes(k));
      const isWorkerMatched = s.includes(trade) || keywords.some(k => s.includes(k));
      if (isCatMatched && isWorkerMatched) return true;
    }
    return false;
  };

  const fetchEmergencyWorkers = async () => {
    try {
      setLoadingWorkers(true);
      const res = await workersAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        // STRICT FILTER: Only return verified and online workers who match the requested trade
        const matched = res.data.filter(w => {
          // Status and availability check
          const isVerified = w.status === 'Verified' || !w.status;
          const isOnline = w.isOnline !== false;
          if (!isVerified || !isOnline) return false;

          // Trade matching check
          const hasPrimaryMatch = matchEmergencyTrade(w.skill, selectedCategory);
          const hasSecondaryMatch = Array.isArray(w.skills) && w.skills.some(s => matchEmergencyTrade(s, selectedCategory));
          return hasPrimaryMatch || hasSecondaryMatch;
        });

        // Map ONLY the matched workers (never fallback to all workers)
        const mapped = matched.map((w, idx) => ({
          id: w.workerId || w._id,
          name: w.name,
          trade: w.skill || currentCatObj.name,
          avatar: w.avatar || (w.name ? w.name.charAt(0).toUpperCase() : 'W'),
          rating: w.rating || 4.9,
          reviews: w.reviewsCount || 8,
          distance: `${(1.1 + (idx * 0.4)).toFixed(1)} km away`,
          eta: `${10 + (idx * 3)} min response`,
          price: '₹350',
          rateNote: 'Emergency rate applies',
          badge: 'Verified On-Duty Rapid Responder',
          phone: w.phone || '+91 98401 22334'
        }));

        setEmergencyWorkers(mapped);
      } else {
        setEmergencyWorkers([]);
      }
    } catch (err) {
      console.error('Error fetching emergency workers from MongoDB:', err);
      setEmergencyWorkers([]);
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    fetchEmergencyWorkers();
  }, [selectedCategory]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    const catObj = emergencyCategories.find(c => c.id === catId);
    if (catObj) {
      setProblemDescription(catObj.defaultDesc);
    }
    setSearchParams({ category: catId });
  };

  const handleRequestHelp = (e) => {
    if (e) e.preventDefault();
    setViewState('results');
  };

  const handleBookEmergencyWorker = async (worker) => {
    const bookingId = 'BK-EMERGENCY-' + Math.floor(100 + Math.random() * 900);
    const bookingPayload = {
      bookingId,
      customerName: currentUser?.name || user?.name || 'Customer Member',
      customerId: currentUser?.userId || user?.userId || '',
      customerPhone: currentUser?.phone || user?.contact || user?.phone || '+91 98401 22334',
      customerAddress: user?.addressDetails || user?.location || currentUser?.locality || 'Ward 4, Chennai',
      serviceCategory: currentCatObj.name.toUpperCase(),
      serviceDetails: problemDescription || `Emergency ${currentCatObj.name} SOS Priority Dispatch`,
      workerId: worker.id,
      workerName: worker.name,
      amount: 350,
      status: 'pending',
      isEmergency: true
    };

    try {
      await bookingsAPI.create(bookingPayload);
    } catch (err) {
      console.warn('MongoDB emergency booking sync warning:', err.message);
    }

    createBooking({ ...bookingPayload, _skipApiSync: true });
    navigate(`/customer/tracking/${bookingId}?emergency=true&workerId=${worker.id}`);
  };

  const locationDisplay = user?.location || currentUser?.locality || 'Ward 4, Adyar, Chennai';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={() => {
              if (viewState === 'results') setViewState('form');
              else navigate('/customer/home');
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
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-danger)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              🚨 Emergency Service
            </h1>
            <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
              Ward cooperative emergency priority response • Filtered to requested trade
            </p>
          </div>
        </div>

        <Badge variant="danger" style={{ fontWeight: 'bold' }}>
          24×7 Rapid Unit
        </Badge>
      </div>

      {/* VIEW 1: SIMPLEST POSSIBLE EMERGENCY REQUEST FORM */}
      {viewState === 'form' && (
        <>
          {/* Urgent Notice Banner */}
          <div style={{
            background: '#FFF0ED',
            border: '1.5px solid var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            gap: 'var(--space-sm)',
            alignItems: 'center'
          }}>
            <AlertTriangle size={24} color="var(--color-danger)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-danger)' }}>
                Urgent Priority Response (Within 15–30 Mins)
              </div>
              <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>
                On-duty cooperative responders in <strong>{locationDisplay}</strong> are ready for immediate priority dispatch for your requested service.
              </p>
            </div>
          </div>

          <form onSubmit={handleRequestHelp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            
            {/* 1. Category Selection Grid */}
            <div>
              <label className="ss-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>
                1. Select Specific Emergency Trade
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 'var(--space-xs)'
              }}>
                {emergencyCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const Icon = cat.icon;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--color-danger)' : 'var(--color-white)',
                        color: isSelected ? 'var(--color-white)' : 'var(--color-black)',
                        border: `1.5px solid ${isSelected ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={24} color={isSelected ? 'white' : cat.color} />
                      <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{cat.name}</span>
                      <span style={{
                        fontSize: '10px',
                        color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--color-text-secondary)',
                        fontWeight: 500
                      }}>
                        {cat.urgentTag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. One-line Problem Description Field */}
            <Card padding="md">
              <label className="ss-label" htmlFor="emergency-desc" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                2. Describe the Emergency Issue
              </label>
              <input
                id="emergency-desc"
                type="text"
                className="ss-input"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder={`Describe your ${currentCatObj.name} emergency...`}
                required
                style={{ fontSize: '14px', padding: '12px var(--space-md)' }}
              />

              {/* Quick Problem Shortcut Chips for Selected Trade */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'var(--space-sm)' }}>
                {(quickIssueChips[selectedCategory] || quickIssueChips.electrician).map((prob) => (
                  <button
                    key={prob}
                    type="button"
                    onClick={() => setProblemDescription(prob)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: 'var(--radius-full)',
                      background: problemDescription === prob ? '#FEE2E2' : 'var(--color-bg)',
                      border: `1px solid ${problemDescription === prob ? 'var(--color-danger)' : 'var(--color-border)'}`,
                      fontSize: '11px',
                      color: problemDescription === prob ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      fontWeight: problemDescription === prob ? 600 : 400
                    }}
                  >
                    + {prob}
                  </button>
                ))}
              </div>
            </Card>

            {/* 3. Big Red "Request Emergency Help" Button */}
            <div style={{ marginTop: 'var(--space-xs)' }}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                icon={ShieldAlert}
                fullWidth
                style={{
                  backgroundColor: 'var(--color-danger)',
                  borderColor: 'var(--color-danger)',
                  fontSize: '16px',
                  height: '52px',
                  boxShadow: '0 4px 14px rgba(217, 48, 37, 0.3)'
                }}
              >
                🚨 Find Available {currentCatObj.name} Responders
              </Button>
            </div>

            {/* 24/7 Helpline */}
            <a href="tel:1800123456" style={{ width: '100%', textAlign: 'center' }}>
              <Button
                type="button"
                variant="outline"
                icon={PhoneCall}
                fullWidth
              >
                Call 24/7 Cooperative Rapid Hotline
              </Button>
            </a>

          </form>
        </>
      )}

      {/* VIEW 2: EMERGENCY WORKERS AVAILABLE SPECIFICALLY FOR THE REQUESTED SERVICE */}
      {viewState === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Quick Trade Filter Switcher Strip */}
          <div style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
                Requested Service:
              </span>
              <Badge variant="danger" style={{ fontWeight: 'bold', fontSize: '12px' }}>
                {currentCatObj.name}
              </Badge>
            </div>

            {/* Switch Category Pills */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {emergencyCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCategory(c.id)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedCategory === c.id ? 'var(--color-black)' : 'var(--color-bg)',
                    color: selectedCategory === c.id ? 'white' : 'var(--color-black)',
                    border: `1px solid ${selectedCategory === c.id ? 'var(--color-black)' : 'var(--color-border)'}`,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dispatch Notice Header */}
          <div style={{
            background: 'var(--color-black)',
            color: 'var(--color-white)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00E676', fontSize: '12px', fontWeight: 'bold' }}>
              <Zap size={15} />
              <span>{emergencyWorkers.length} {currentCatObj.name} Responder{emergencyWorkers.length === 1 ? '' : 's'} On Standby Nearby</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px', color: 'white' }}>
              Response within ~15–30 min
            </h2>
            <p style={{ fontSize: '12px', color: '#CCC', margin: 0 }}>
              Verified <strong>{currentCatObj.name}</strong> specialists in {locationDisplay} ready for immediate dispatch for: <em>"{problemDescription}"</em>
            </p>
          </div>

          {/* Transparent Emergency Wage Note */}
          <div style={{
            background: '#FFFDF9',
            border: '1px solid rgba(255, 106, 0, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '12px'
          }}>
            <Clock size={15} color="var(--color-accent)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Emergency Rate Policy:</strong> Standard cooperative rapid dispatch fee (₹350) covers priority arrival for {currentCatObj.name} emergency assistance.
            </span>
          </div>

          {/* Worker Result Cards */}
          {loadingWorkers ? (
            <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
              <Loader2 size={28} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
              <p className="text-secondary" style={{ fontSize: '13px', marginTop: 8 }}>
                Locating nearest on-duty {currentCatObj.name} units in Ward 4...
              </p>
            </div>
          ) : emergencyWorkers.length === 0 ? (
            <Card padding="lg" style={{ textAlign: 'center', border: '1px dashed var(--color-border)' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#FFF0ED',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-sm)'
              }}>
                <ShieldAlert size={26} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 6px', color: 'var(--color-black)' }}>
                No Rapid {currentCatObj.name} Responders On Standby Right Now
              </h3>
              <p className="text-secondary" style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto var(--space-md)', lineHeight: 1.45 }}>
                All verified {currentCatObj.name} specialists are currently attending to nearby distress calls in {locationDisplay}. You can try another service category or connect with our rapid control desk immediately.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <a href="tel:1800123456" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="primary"
                    icon={PhoneCall}
                    style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                  >
                    Call 24/7 Rapid Helpline
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => setViewState('form')}
                >
                  Change Service
                </Button>
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {emergencyWorkers.map((w, index) => (
                <Card key={w.id} padding="md" style={{ border: index === 0 ? '1.5px solid var(--color-danger)' : '1px solid var(--color-border)' }}>
                  
                  {/* Header Strip */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                      <div style={{
                        width: 50,
                        height: 50,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-black)',
                        color: 'var(--color-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {w.avatar}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0 }}>
                            {w.name}
                          </h3>
                          {index === 0 && (
                            <Badge variant="danger" style={{ fontSize: '10px' }}>Fastest ETA</Badge>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
                          ✓ {w.badge}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '12px', fontWeight: 600 }}>
                          {w.trade}
                        </div>
                      </div>
                    </div>

                    {/* Rating & Distance */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>⭐ {w.rating}</div>
                      <div className="text-secondary" style={{ fontSize: '11px' }}>{w.distance}</div>
                    </div>
                  </div>

                  {/* ETA & Transparent Emergency Price Strip */}
                  <div style={{
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    margin: 'var(--space-sm) 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-danger)', fontWeight: 'bold' }}>
                      <Navigation size={14} />
                      <span>{w.eta}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                        {w.price}
                      </span>
                      <Badge variant="danger" style={{ fontSize: '10px' }}>
                        {w.rateNote}
                      </Badge>
                    </div>
                  </div>

                  {/* 1-Tap Book Emergency Worker Button */}
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <Button
                      variant="primary"
                      size="large"
                      icon={Zap}
                      fullWidth
                      style={{
                        backgroundColor: 'var(--color-danger)',
                        borderColor: 'var(--color-danger)',
                        fontSize: '15px',
                        fontWeight: 'bold'
                      }}
                      onClick={() => handleBookEmergencyWorker(w)}
                    >
                      ⚡ Dispatch {w.name} Now ({w.trade})
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default EmergencyService;
