import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Navigation,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Zap,
  Check,
  X,
  CreditCard,
  Building2
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';

export const JobRequestDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [isAccepted, setIsAccepted] = useState(false);

  const job = {
    id: jobId || 'REQ-4091',
    customer: 'Anand Sundaram',
    phone: '+91 98401 23456',
    category: 'Electrician & Wiring',
    problem: 'Switchboard sparking in master bedroom, and ceiling fan speed regulator is jammed/broken.',
    location: 'Flat 402, Sunshine Apartments, Adyar 2nd Main Road, Chennai - 600020',
    distance: '1.4 km away',
    time: 'Immediate / ASAP (within 30 mins)',
    duration: '2 Hours (Standard repair)',
    payout: '₹450',
    coopCut: '₹0 (100% Direct to Worker)',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
    ]
  };

  const handleAccept = () => {
    setIsAccepted(true);
    setTimeout(() => {
      navigate('/worker/jobs');
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              Job Request Details
            </h1>
            <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
              Request ID: #{job.id}
            </p>
          </div>
        </div>

        <Badge variant="active">
          {job.payout} Fixed
        </Badge>
      </div>

      {!isAccepted ? (
        <>
          {/* Earnings & Service Header Card */}
          <Card padding="md" style={{ background: 'var(--color-black)', color: 'var(--color-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#CCC' }}>DIRECT WAGE</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-white)', margin: '2px 0' }}>
                  {job.payout}
                </div>
                <div style={{ color: '#00E676', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={14} />
                  <span>100% Payout Direct to Your Bank/UPI</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Badge variant="success" style={{ fontSize: '10px' }}>
                  0% Intermediary Fee
                </Badge>
                <div style={{ color: '#BBB', fontSize: '11px', marginTop: 4 }}>
                  {job.duration}
                </div>
              </div>
            </div>
          </Card>

          {/* Customer & Location Details */}
          <Card padding="md">
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
              Customer & Destination
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Customer Name:</span>
                <span className="text-bold">{job.customer}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Distance:</span>
                <span className="text-bold" style={{ color: 'var(--color-accent)' }}>
                  {job.distance} (18 mins travel)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Schedule:</span>
                <span className="text-bold">{job.time}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
                <span className="text-secondary">Service Address:</span>
                <span className="text-bold" style={{ maxWidth: '200px', textAlign: 'right' }}>
                  {job.location}
                </span>
              </div>
            </div>
          </Card>

          {/* Problem Description & Attached Photos */}
          <Card padding="md">
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
              Problem Description
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.4, color: '#333', margin: '0 0 var(--space-md)' }}>
              {job.problem}
            </p>

            <div>
              <label className="ss-label" style={{ display: 'block', marginBottom: '6px' }}>
                Customer Attached Photo
              </label>
              <div style={{
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                height: '140px'
              }}>
                <img
                  src={job.photos[0]}
                  alt="Customer damage photo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </Card>

          {/* Required Tools Recommendation */}
          <div style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <Zap size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />
            <span>Recommended tools: Voltage tester, 16A modular switch, insulated pliers, capacitor spare.</span>
          </div>

          {/* Action Buttons: Accept vs Decline */}
          <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)' }}>
            <Button
              variant="primary"
              size="large"
              icon={CheckCircle2}
              style={{ flex: 2, height: '54px', fontSize: '16px', fontWeight: 'bold' }}
              onClick={handleAccept}
            >
              Accept & Start Travel ({job.payout})
            </Button>
            <Button
              variant="outline"
              size="large"
              style={{ flex: 1, height: '54px' }}
              onClick={() => navigate('/worker')}
            >
              Decline
            </Button>
          </div>
        </>
      ) : (
        /* Accepted Success Confirmation */
        <Card padding="lg" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: '50px 20px' }}>
          <div style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <CheckCircle2 size={40} />
          </div>

          <div>
            <Badge variant="success" style={{ marginBottom: '6px' }}>
              Job Assigned to You
            </Badge>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0' }}>
              Request Accepted!
            </h2>
            <p className="text-secondary" style={{ fontSize: '13px' }}>
              Customer {job.customer} has been notified that you are en route.
            </p>
          </div>

          <Button
            variant="primary"
            fullWidth
            icon={Navigation}
            onClick={() => navigate('/worker/jobs')}
          >
            Open Active Job Route
          </Button>
        </Card>
      )}

    </div>
  );
};

export default JobRequestDetail;
