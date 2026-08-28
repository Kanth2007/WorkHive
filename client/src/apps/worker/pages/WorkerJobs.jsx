import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  Navigation,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';

export const WorkerJobs = () => {
  const navigate = useNavigate();
  const [tabFilter, setTabFilter] = useState('active'); // 'active' | 'completed'

  const activeJobs = [
    {
      id: 'REQ-4091',
      customer: 'Anand Sundaram',
      phone: '+91 98401 23456',
      service: 'Electrician (Switchboard & Fan Repair)',
      address: 'Flat 402, Sunshine Apts, Adyar 2nd Main (1.4 km)',
      time: 'Today • 4:30 PM (Immediate)',
      rate: '₹450',
      status: 'en_route',
      statusLabel: 'En Route (18 mins)'
    }
  ];

  const pastJobs = [
    {
      id: 'JOB-3820',
      customer: 'Kavita Raman',
      service: 'Light Fixture & Wiring',
      address: 'Kasturba Nagar, Adyar',
      date: 'Today, 2:00 PM',
      payout: '₹350 paid via UPI',
      rating: 5
    },
    {
      id: 'JOB-3818',
      customer: 'Suresh Kumar',
      service: 'MCB Tripping Fix',
      address: 'Besant Nagar, Ward 4',
      date: 'Yesterday, 11:30 AM',
      payout: '₹400 paid via UPI',
      rating: 4.8
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
          My Jobs
        </h1>
        <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
          Assigned cooperative jobs and history
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
        {[
          { id: 'active', label: 'Active Jobs (1)' },
          { id: 'completed', label: 'Past Completed (127)' }
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setTabFilter(f.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: tabFilter === f.id ? 'var(--color-black)' : 'var(--color-white)',
              color: tabFilter === f.id ? 'var(--color-white)' : 'var(--color-black)',
              border: `1px solid ${tabFilter === f.id ? 'var(--color-black)' : 'var(--color-border)'}`,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      {tabFilter === 'active' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {activeJobs.map((job) => (
            <Card key={job.id} padding="md" style={{ border: '1.5px solid var(--color-accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Badge variant="active" style={{ marginBottom: 4 }}>
                    {job.statusLabel}
                  </Badge>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '2px 0' }}>
                    {job.service}
                  </h3>
                  <div className="text-secondary" style={{ fontSize: '13px' }}>
                    Customer: <strong>{job.customer}</strong>
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  {job.rate}
                </div>
              </div>

              <div style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                margin: 'var(--space-sm) 0',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} color="var(--color-accent)" />
                  <span>{job.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} />
                  <span>{job.time}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                <a href="tel:+919840123456" style={{ flex: 1 }}>
                  <Button variant="outline" size="small" icon={PhoneCall} fullWidth>
                    Call Customer
                  </Button>
                </a>
                <Button
                  variant="primary"
                  size="small"
                  icon={Navigation}
                  style={{ flex: 1 }}
                  onClick={() => alert('Starting Google Maps navigation to Flat 402, Sunshine Apts')}
                >
                  Navigate Route
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {pastJobs.map((p) => (
            <Card key={p.id} padding="sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{p.service}</h3>
                  <div className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
                    Customer: {p.customer} • {p.date}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.payout}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600 }}>
                    ⭐ {p.rating} Rating
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default WorkerJobs;
