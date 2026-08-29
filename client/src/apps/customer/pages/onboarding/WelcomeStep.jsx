import React from 'react';
import { Users, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';
import Button from '../../../../components/Button';
import Badge from '../../../../components/Badge';

export const WelcomeStep = ({ onNext }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      justifyContent: 'space-between',
      padding: 'var(--space-xl) var(--space-md)'
    }}>
      {/* Brand & Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 'var(--space-lg)' }}>
        
        {/* Logo Mark */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '20px',
          background: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-white)',
          marginBottom: 'var(--space-lg)',
          boxShadow: '0 8px 24px rgba(255, 106, 0, 0.2)'
        }}>
          <Users size={44} strokeWidth={2.2} />
        </div>

        <Badge variant="active" style={{ marginBottom: 'var(--space-sm)' }}>
          Community Cooperative
        </Badge>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '-0.02em', marginBottom: 'var(--space-xs)' }}>
          WorkHive
        </h1>

        {/* Tagline */}
        <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', maxWidth: '280px', marginBottom: 'var(--space-xl)' }}>
          Trusted cooperative workers near you
        </p>

        {/* Calm Trust Points */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          background: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} color="var(--color-success)" />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '15px' }}>100% Background Verified</div>
              <div className="text-secondary" style={{ fontSize: '13px' }}>Helpers vetted by local cooperative</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HeartHandshake size={20} color="var(--color-accent)" />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Fair Standard Rates</div>
              <div className="text-secondary" style={{ fontSize: '13px' }}>Direct payment to workers, zero hidden fees</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={20} color="var(--color-black)" />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Simple Booking</div>
              <div className="text-secondary" style={{ fontSize: '13px' }}>Quick support in just a few taps</div>
            </div>
          </div>
        </div>

      </div>

      {/* Primary CTA */}
      <div style={{ marginTop: 'var(--space-xxl)' }}>
        <Button
          variant="primary"
          size="large"
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
          onClick={onNext}
        >
          Get Started
        </Button>
        <p className="text-secondary" style={{ textAlign: 'center', fontSize: '12px', marginTop: 'var(--space-sm)' }}>
          By continuing, you agree to Cooperative Community Guidelines
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;
