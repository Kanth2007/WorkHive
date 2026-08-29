import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, StarRating, EmptyState } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { workersAPI, bookingsAPI } from '../../../services/api';

export const EmergencyService = () => {
  const navigate = useNavigate();
  const { user } = useCustomer();

  // State: 'form' | 'results'
  const [viewState, setViewState] = useState('form');

  // Emergency Form State
  const [selectedCategory, setSelectedCategory] = useState('electrician');
  const [problemDescription, setProblemDescription] = useState('Main switchboard sparking and power tripping in entire flat.');
  const [emergencyWorkers, setEmergencyWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  // Emergency Categories (with highlighted urgent categories)
  const emergencyCategories = [
    {
      id: 'electrician',
      name: 'Electrician',
      icon: Zap,
      urgentTag: 'Spark / Power Loss',
      color: '#FF6A00'
    },
    {
      id: 'plumber',
      name: 'Plumber',
      icon: Wrench,
      urgentTag: 'Pipe Burst / Flood',
      color: '#0070F3'
    },
    {
      id: 'carpenter',
      name: 'Lock & Door Entry',
      icon: KeyRound,
      urgentTag: 'Lockout / Jammed',
      color: '#10B981'
    },
    {
      id: 'caregiver',
      name: 'Elder Medical Assistance',
      icon: HeartPulse,
      urgentTag: 'Mobility / Fall Help',
      color: '#EC4899'
    }
  ];

  const quickIssueChips = [
    'Main electrical spark & MCB tripping',
    'Kitchen supply pipe burst & flooding',
    'Main door jammed / Lockout',
    'Overhead tank overflow flooding roof',
    'Sudden total power outage',
    'Senior citizen medical mobility help'
  ];

  useEffect(() => {
    const fetchEmergencyWorkers = async () => {
      try {
        setLoadingWorkers(true);
        const res = await workersAPI.getAll({ status: 'Verified' });
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(w => ({
            id: w.workerId || w._id,
            name: w.name,
            trade: w.skill,
            avatar: w.avatar || 'WK',
            rating: w.rating || 4.8,
            reviews: w.reviewsCount || 120,
            distance: w.distance || '0.8 km away',
            eta: '12 min response',
            price: '₹350',
            rateNote: 'Emergency rate applies',
            badge: 'Verified On-Duty Cooperative Helper',
            phone: w.phone || '+91 98401 22334'
          }));
          setEmergencyWorkers(mapped);
        }
      } catch (err) {
        console.error('Error fetching emergency workers from MongoDB:', err);
      } finally {
        setLoadingWorkers(false);
      }
    };

    fetchEmergencyWorkers();
  }, []);

  const handleRequestHelp = (e) => {
    if (e) e.preventDefault();
    setViewState('results');
  };

  const handleBookEmergencyWorker = async (worker) => {
    const bookingId = 'BK-EMERGENCY-' + Math.floor(100 + Math.random() * 900);
    try {
      await bookingsAPI.create({
        bookingId,
        customerName: user.name || 'Customer Member',
        customerId: user.userId || '',
        customerPhone: user.contact || user.phone || '+91 98401 22334',
        customerAddress: user.addressDetails || user.location || 'Ward 4, Chennai',
        serviceCategory: selectedCategory.toUpperCase(),
        serviceDetails: problemDescription || 'Emergency SOS Request',
        workerId: worker.id,
        workerName: worker.name,
        amount: 350,
        isEmergency: true
      });
    } catch (err) {
      console.warn('MongoDB emergency booking sync warning:', err.message);
    }
    navigate(`/customer/tracking/${bookingId}?emergency=true&workerId=${worker.id}`);
  };

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
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-danger)', margin: 0 }}>
              🚨 Emergency Service
            </h1>
            <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
              Ward cooperative emergency priority response
            </p>
          </div>
        </div>

        <Badge variant="danger" style={{ fontWeight: 'bold' }}>
          24x7 Rapid Unit
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
                On-duty cooperative responders in <strong>{user.location || 'Adyar, Chennai'}</strong> are on immediate standby.
              </p>
            </div>
          </div>

          <form onSubmit={handleRequestHelp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            
            {/* 1. Category Selection Grid (Only Emergency-Relevant Highlighted) */}
            <div>
              <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
                1. Select Emergency Service Needed
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 'var(--space-xs)'
              }}>
                {emergencyCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const Icon = cat.icon;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
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
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{cat.name}</span>
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
              <label className="ss-label" htmlFor="emergency-desc" style={{ display: 'block', marginBottom: '6px' }}>
                2. Describe the Emergency in One Line
              </label>
              <input
                id="emergency-desc"
                type="text"
                className="ss-input"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="e.g. Switchboard sparking / pipe leaking all over floor"
                required
                style={{ fontSize: '15px', padding: '12px var(--space-md)' }}
              />

              {/* Quick Problem Shortcut Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'var(--space-sm)' }}>
                {quickProblems.map((prob) => (
                  <button
                    key={prob}
                    type="button"
                    onClick={() => setProblemDescription(prob)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    + {prob}
                  </button>
                ))}
              </div>
            </Card>

            {/* 3. Big Red/Amber "Request Emergency Help" Button */}
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                icon={ShieldAlert}
                fullWidth
                style={{
                  backgroundColor: 'var(--color-danger)',
                  borderColor: 'var(--color-danger)',
                  fontSize: '17px',
                  height: '56px',
                  boxShadow: '0 4px 14px rgba(217, 48, 37, 0.3)'
                }}
              >
                🚨 Request Emergency Help
              </Button>
            </div>

            {/* 24/7 Helpline */}
            <a href="tel:1800123456" style={{ width: '100%', textAlign: 'center', marginTop: 'var(--space-xs)' }}>
              <Button
                type="button"
                variant="outline"
                icon={PhoneCall}
                fullWidth
              >
                Call 24/7 Cooperative Hotline
              </Button>
            </a>

          </form>
        </>
      )}

      {/* VIEW 2: 3 EMERGENCY WORKERS AVAILABLE NEARBY */}
      {viewState === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Dispatch Notice Header */}
          <div style={{
            background: 'var(--color-black)',
            color: 'var(--color-white)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00E676', fontSize: '12px', fontWeight: 'bold' }}>
              <Zap size={15} />
              <span>3 Emergency Workers Available Nearby</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 2px', color: 'white' }}>
              Response within ~30 min
            </h2>
            <p style={{ fontSize: '12px', color: '#CCC', margin: 0 }}>
              On-duty rapid responders in {user.location || 'Adyar, Chennai'} ready for immediate dispatch.
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
              <strong>Emergency Rate Policy:</strong> A transparent demand-based wage applies during urgent calls to fairly compensate immediate responders.
            </span>
          </div>

          {/* Worker Result Cards */}
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
                      <div className="text-secondary" style={{ fontSize: '12px' }}>
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
                    ⚡ Dispatch {w.name} Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default EmergencyService;
