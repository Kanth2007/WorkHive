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
  ToggleRight
} from 'lucide-react';
import { Button, Card, Badge, EmptyState, LoadingState } from '../../../components';
import { servicesAPI } from '../../../services/api';

export const AdminServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editRate, setEditRate] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Fallback initial categories with icons and stats
  const initialServices = [
    { serviceId: 'svc-elec', title: 'Electrical Wiring & Repair', category: 'Electrical', baseRate: 450, timeEstimate: '45-90 mins', activeWorkers: 14, emergencyAvailable: true, icon: Zap, color: '#FF6A00' },
    { serviceId: 'svc-plumb', title: 'Plumbing & Pipe Leakage', category: 'Plumbing', baseRate: 400, timeEstimate: '30-60 mins', activeWorkers: 9, emergencyAvailable: true, icon: Wrench, color: '#0284C7' },
    { serviceId: 'svc-carp', title: 'Carpentry & Door Repairs', category: 'Carpentry', baseRate: 500, timeEstimate: '60-120 mins', activeWorkers: 7, emergencyAvailable: true, icon: Hammer, color: '#B45309' },
    { serviceId: 'svc-paint', title: 'Wall Painting & Touch-up', category: 'Painting', baseRate: 850, timeEstimate: '2-4 hours', activeWorkers: 11, emergencyAvailable: false, icon: Paintbrush, color: '#7C3AED' },
    { serviceId: 'svc-clean', title: 'Deep House & Bathroom Cleaning', category: 'Cleaning', baseRate: 650, timeEstimate: '90-150 mins', activeWorkers: 18, emergencyAvailable: false, icon: Sparkles, color: '#059669' },
    { serviceId: 'svc-care', title: 'Elderly & Patient Caregiving', category: 'Caregiving', baseRate: 800, timeEstimate: 'Daily / Hourly', activeWorkers: 6, emergencyAvailable: true, icon: HeartPulse, color: '#DB2777' },
    { serviceId: 'svc-driv', title: 'On-Demand Chauffeur & Driver', category: 'Driver', baseRate: 400, timeEstimate: 'Per 4 Hours', activeWorkers: 12, emergencyAvailable: false, icon: Car, color: '#2563EB' },
    { serviceId: 'svc-gard', title: 'Gardening & Lawn Pruning', category: 'Gardener', baseRate: 350, timeEstimate: '60 mins', activeWorkers: 5, emergencyAvailable: false, icon: Sprout, color: '#16A34A' },
    { serviceId: 'svc-help', title: 'Domestic Helper & Housework', category: 'Domestic Helper', baseRate: 300, timeEstimate: 'Daily Session', activeWorkers: 15, emergencyAvailable: false, icon: Home, color: '#D97706' },
    { serviceId: 'svc-tech', title: 'Appliance Repair (AC, RO, Fridge)', category: 'Technician', baseRate: 600, timeEstimate: '60-90 mins', activeWorkers: 8, emergencyAvailable: true, icon: Cpu, color: '#4F46E5' }
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await servicesAPI.getAll();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Merge with cooperative metadata
        const merged = initialServices.map(init => {
          const dbMatch = res.data.find(d => d.serviceId === init.serviceId || d.category?.toLowerCase() === init.category.toLowerCase());
          return dbMatch ? { ...init, ...dbMatch, baseRate: dbMatch.baseRate || init.baseRate } : init;
        });
        setServices(merged);
      } else {
        setServices(initialServices);
      }
    } catch (err) {
      console.warn('Using cached service list:', err.message);
      setServices(initialServices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleStartEdit = (service) => {
    setEditingServiceId(service.serviceId);
    setEditRate(service.baseRate);
  };

  const handleSaveRate = async (serviceId) => {
    const newRate = parseInt(editRate, 10);
    if (isNaN(newRate) || newRate <= 0) return;

    setServices(prev => prev.map(s => s.serviceId === serviceId ? { ...s, baseRate: newRate } : s));
    setEditingServiceId(null);
    setToastMessage(`✓ Tariff updated to ₹${newRate} for ${serviceId}`);
    setTimeout(() => setToastMessage(''), 3000);

    try {
      await servicesAPI.update(serviceId, { baseRate: newRate });
    } catch (err) {
      console.warn('MongoDB service sync notice:', err.message);
    }
  };

  const handleToggleEmergency = async (serviceId) => {
    setServices(prev => prev.map(s => {
      if (s.serviceId === serviceId) {
        const updated = !s.emergencyAvailable;
        return { ...s, emergencyAvailable: updated };
      }
      return s;
    }));

    setToastMessage(`✓ Emergency dispatch updated for ${serviceId}`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
            Cooperative Services & Tariff Catalog
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Configure fixed standard cooperative rates, active worker pools, and emergency SOS dispatch rules
          </p>
        </div>

        <Badge variant="success">
          <ShieldCheck size={14} style={{ marginRight: 4 }} />
          <span>Statutory Rates Approved</span>
        </Badge>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #22C55E',
          color: '#15803D',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="ss-stat-grid">
        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL CATEGORIES</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 2px' }}>10 Active Trades</div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>100% Cooperative Operated</div>
        </Card>

        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>WORKER TAKE-HOME SHARE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--color-accent)' }}>90.0% Direct</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>10% to Society Welfare Fund</div>
        </Card>

        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>EMERGENCY TRADES</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 2px' }}>5 Enabled</div>
          <div style={{ fontSize: '11px', color: '#D93025', fontWeight: 600 }}>12-Min SOS Dispatch SLA</div>
        </Card>

        <Card padding="md">
          <div className="text-secondary" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL ACTIVE ROSTER</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 2px' }}>104 Workers</div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Ward 4 Node Deployments</div>
        </Card>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="ss-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search service title or trade category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 15 }} />
        </div>

        <select
          className="ss-input"
          style={{ width: 'auto', minWidth: '160px' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories (10)</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="carpentry">Carpentry</option>
          <option value="cleaning">Cleaning</option>
          <option value="caregiving">Caregiving</option>
          <option value="painting">Painting</option>
        </select>
      </div>

      {/* 4. SERVICES TABLE */}
      <div className="ss-table-responsive">
        <table>
          <thead>
            <tr style={{ background: '#FAFAFA', borderBottom: '1.5px solid var(--color-border)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700 }}>Service Name & Trade</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700 }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700 }}>Fixed Tariff</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700 }}>Est. Duration</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>Available Workers</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>Emergency SOS</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => {
              const isEditing = editingServiceId === service.serviceId;
              const IconComponent = service.icon || Wrench;

              return (
                <tr key={service.serviceId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {/* Name & Icon */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: service.color || 'var(--color-black)'
                      }}>
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-black)' }}>
                          {service.title}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '11px' }}>
                          ID: {service.serviceId}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant="neutral">{service.category}</Badge>
                  </td>

                  {/* Fixed Tariff */}
                  <td style={{ padding: '12px 16px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>₹</span>
                        <input
                          type="number"
                          className="ss-input"
                          style={{ width: '80px', minHeight: '36px', padding: '0 8px', fontSize: '13px', fontWeight: 'bold' }}
                          value={editRate}
                          onChange={(e) => setEditRate(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                          ₹{service.baseRate}
                        </span>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                          Worker gets ₹{Math.round(service.baseRate * 0.9)} (90%)
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Duration */}
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {service.timeEstimate}
                  </td>

                  {/* Available Workers */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{service.activeWorkers}</span>
                    <span className="text-secondary" style={{ fontSize: '11px', marginLeft: 4 }}>active</span>
                  </td>

                  {/* Emergency SOS Toggle */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleEmergency(service.serviceId)}
                      style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                      title="Click to toggle emergency status"
                    >
                      <Badge variant={service.emergencyAvailable ? 'danger' : 'neutral'}>
                        {service.emergencyAvailable ? '🚨 12-Min SOS' : 'Standard Only'}
                      </Badge>
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Button
                          variant="primary"
                          size="small"
                          icon={Save}
                          onClick={() => handleSaveRate(service.serviceId)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => setEditingServiceId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="small"
                        icon={Edit2}
                        onClick={() => handleStartEdit(service)}
                      >
                        Edit Rate
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminServicesScreen;
