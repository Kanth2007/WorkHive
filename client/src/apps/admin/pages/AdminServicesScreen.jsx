import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  HeartPulse,
  Car,
  Sprout,
  Home,
  Cpu,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Save,
  Trash2,
  DollarSign,
  Users,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, EmptyState, LoadingState } from '../../../components';
import { servicesAPI, workersAPI } from '../../../services/api';

const categoryIconMap = {
  plumber: Wrench,
  electrician: Zap,
  cleaning: Sparkles,
  carpenter: Hammer,
  painter: Paintbrush,
  caregiver: HeartPulse,
  gardener: Sprout,
  technician: Cpu,
  driver: Car,
  helper: Home
};

export const AdminServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editRate, setEditRate] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchServicesAndCounts = async () => {
    try {
      setLoading(true);
      const [servicesRes, workersRes] = await Promise.allSettled([
        servicesAPI.getAll(),
        workersAPI.getAll()
      ]);

      const allWorkers = workersRes.status === 'fulfilled' && workersRes.value.success ? workersRes.value.data : [];

      if (servicesRes.status === 'fulfilled' && servicesRes.value.success && Array.isArray(servicesRes.value.data)) {
        const mapped = servicesRes.value.data.map(s => {
          const count = allWorkers.filter(w =>
            (w.skill && w.skill.toLowerCase().includes(s.title.toLowerCase().split(' ')[0])) ||
            (w.skills && w.skills.some(sk => sk.toLowerCase().includes(s.title.toLowerCase().split(' ')[0])))
          ).length;

          return {
            id: s._id || s.serviceId,
            serviceId: s.serviceId,
            title: s.title,
            category: s.category || 'General',
            description: s.description,
            baseRate: s.rateNumber || parseInt(s.baseRate?.replace(/[^0-9]/g, '')) || 300,
            baseRateDisplay: s.baseRate,
            duration: s.duration || '1 - 2 hours',
            activeWorkers: count,
            emoji: s.emoji || '🔧',
            icon: categoryIconMap[s.serviceId] || Wrench,
            popular: s.popular || false
          };
        });
        setServices(mapped);
      }
    } catch (err) {
      console.error('Error loading services from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesAndCounts();
  }, []);

  const handleSaveRate = async (service) => {
    const newRate = parseInt(editRate);
    if (!newRate || newRate <= 0) return;

    try {
      await servicesAPI.create({
        serviceId: service.serviceId,
        title: service.title,
        description: service.description,
        baseRate: `₹${newRate} fixed visit fee`,
        rateNumber: newRate,
        duration: service.duration,
        category: service.category,
        emoji: service.emoji
      });

      setToastMessage(`Rate updated for ${service.title} to ₹${newRate}`);
      setEditingServiceId(null);
      fetchServicesAndCounts();
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      alert('Error updating rate: ' + err.message);
    }
  };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
            Cooperative Services & Fair Tariff Catalog
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Regulated standard rates in MongoDB • 100% direct worker pass-through (0% broker commission)
          </p>
        </div>
      </div>

      {toastMessage && (
        <div style={{ background: '#F0FDF4', border: '1px solid #22C55E', color: '#15803D', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600 }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* 2. SEARCH BAR */}
      <Card padding="sm">
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="ss-input"
              style={{ paddingLeft: '36px' }}
              placeholder="Search active services or categories in MongoDB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 12 }} />
          </div>
        </div>
      </Card>

      {/* 3. SERVICES LIST */}
      {loading ? (
        <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
          <Loader2 size={24} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-secondary" style={{ fontSize: '13px', marginTop: 8 }}>Loading services from MongoDB...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Services Found"
          description="No service categories matching your search criteria."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
          {filteredServices.map((svc) => (
            <Card key={svc.id} padding="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <span style={{ fontSize: '24px' }}>{svc.emoji}</span>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{svc.title}</h3>
                      <Badge variant="active" style={{ fontSize: '10px', marginTop: 2 }}>{svc.category}</Badge>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: svc.activeWorkers > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                    {svc.activeWorkers} Registered
                  </span>
                </div>

                <p className="text-secondary" style={{ fontSize: '12px', lineHeight: 1.4, margin: 'var(--space-sm) 0' }}>
                  {svc.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-xs)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="text-secondary" style={{ fontSize: '11px' }}>Approved Tariff:</span>
                  {editingServiceId === svc.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span>₹</span>
                      <input
                        type="number"
                        className="ss-input"
                        style={{ width: '70px', padding: '2px 6px', height: '28px', fontSize: '13px' }}
                        value={editRate}
                        onChange={(e) => setEditRate(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRate(svc)}
                        style={{ background: 'var(--color-black)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
                      ₹{svc.baseRate} <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--color-text-secondary)' }}>visit fee</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingServiceId(svc.id);
                    setEditRate(svc.baseRate.toString());
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Edit2 size={12} />
                  <span>Edit Rate</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminServicesScreen;
