import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  QrCode,
  Award,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useWorker } from '../context/WorkerContext';

export const WorkerProfile = () => {
  const navigate = useNavigate();
  const { worker, resetWorker } = useWorker();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Profile Header Card */}
      <Card padding="md" style={{ textAlign: 'center' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-black)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0 auto var(--space-xs)'
        }}>
          RP
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 2px' }}>
          {worker.name || 'Ramesh Patil'}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: '13px', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>✓ Verified Cooperative Worker</span>
        </div>
        <p className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
          Chennai Labour Cooperative Society • Ward 4 (#CLC-EL-402)
        </p>

        <div style={{ marginTop: 'var(--space-md)' }}>
          <Button
            variant="outline"
            size="small"
            icon={Award}
            onClick={() => navigate('/worker/verification')}
          >
            View Official Certificate
          </Button>
        </div>
      </Card>

      {/* Member Details */}
      <Card padding="md">
        <h2 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
          Worker Details
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Registered Skills:</span>
            <span className="text-bold">{worker.skills?.join(', ') || 'Electrical'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Trade Experience:</span>
            <span className="text-bold">{worker.experience || '7 years'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Working Radius:</span>
            <span className="text-bold">{worker.serviceRadius || '5 km'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Languages:</span>
            <span className="text-bold">{worker.languages?.join(', ') || 'Tamil, English'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
            <span className="text-secondary">Payout Method:</span>
            <span className="text-bold">{worker.upiId || 'ramesh.patil@okhdfcbank'}</span>
          </div>
        </div>
      </Card>

      {/* Re-run Wizard or Switch App */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <Button
          variant="outline"
          fullWidth
          icon={RotateCcw}
          onClick={() => navigate('/worker/register')}
        >
          Re-run Registration Wizard
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/customer/home')}
        >
          Switch to Customer App
        </Button>
      </div>

    </div>
  );
};

export default WorkerProfile;
