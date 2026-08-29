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
  Loader2,
  X,
  Layers,
  ArrowUpDown,
  Tag,
  Clock,
  Check,
  Star,
  Flame,
  Info
} from 'lucide-react';
import { Button, Card, Badge, EmptyState, LoadingState } from '../../../components';
import { servicesAPI, workersAPI } from '../../../services/api';

const categoryIconMap = {
  plumber: Wrench,
  plumbing: Wrench,
  electrician: Zap,
  electrical: Zap,
  cleaning: Sparkles,
  carpenter: Hammer,
  carpentry: Hammer,
  painter: Paintbrush,
  painting: Paintbrush,
  caregiver: HeartPulse,
  caregiving: HeartPulse,
  gardener: Sprout,
  gardening: Sprout,
  technician: Cpu,
  appliance: Cpu,
  driver: Car,
  helper: Home,
  general: Wrench
};

const PRESET_EMOJIS = [
  '🔧', '⚡', '🧹', '🔨', '🎨', '🩺', '🌱', '🚗', '🏠', '💻', '❄️', '☀️', '🚿', '🪚', '⚙️', '🧱', '🔌', '🛋️', '📦', '🧑‍🍳'
];

const PRESET_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Carpentry',
  'Painting',
  'Appliance Repair',
  'Caregiving',
  'Gardening',
  'Technician',
  'Civil & Masonry',
  'Driver & Transport',
  'General Maintenance'
];

const DURATION_OPTIONS = [
  '30 - 45 mins',
  '1 - 2 hours',
  '2 - 4 hours',
  'Half Day (4 hrs)',
  'Full Day (8 hrs)'
];

export const AdminServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'name' | 'workers'
  
  // Inline edit state
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editRate, setEditRate] = useState('');
  
  // Add Service Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plumbing',
    customCategory: '',
    description: '',
    baseRate: 350,
    duration: '1 - 2 hours',
    emoji: '🔧',
    popular: false,
    availableWorkersCount: 0
  });

  // Edit Full Service Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Delete Confirmation Modal State
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

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
          const sTitle = (s.title || '').toLowerCase();
          const sCat = (s.category || '').toLowerCase();
          const sId = (s.serviceId || '').toLowerCase();

          // Count matching workers based on skill or sub-skills
          const count = allWorkers.filter(w => {
            const wSkill = (w.skill || '').toLowerCase();
            const wSkills = (w.skills || []).map(sk => String(sk).toLowerCase());
            return (
              wSkill.includes(sTitle.split(' ')[0]) ||
              wSkill.includes(sCat) ||
              wSkill.includes(sId) ||
              wSkills.some(sk => sk.includes(sTitle.split(' ')[0]) || sk.includes(sCat) || sk.includes(sId))
            );
          }).length;

          const numRate = s.rateNumber || parseInt(String(s.baseRate || '').replace(/[^0-9]/g, '')) || 300;
          const catKey = sCat.replace(/[^a-z]/g, '') || 'general';

          return {
            id: s._id || s.serviceId,
            serviceId: s.serviceId || s._id,
            title: s.title,
            category: s.category || 'General',
            description: s.description || 'Standard cooperative verified service.',
            baseRate: numRate,
            baseRateDisplay: s.baseRate || `₹${numRate} visit fee`,
            duration: s.duration || '1 - 2 hours',
            activeWorkers: count > 0 ? count : (s.availableWorkersCount || 0),
            emoji: s.emoji || '🔧',
            icon: categoryIconMap[s.serviceId] || categoryIconMap[catKey] || Wrench,
            popular: Boolean(s.popular)
          };
        });
        setServices(mapped);
      }
    } catch (err) {
      console.error('Error loading services from MongoDB:', err);
      showToast('Failed to load services from MongoDB', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesAndCounts();
  }, []);

  // Quick inline rate save
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
        emoji: service.emoji,
        popular: service.popular
      });

      showToast(`Tariff updated for ${service.title} to ₹${newRate}`);
      setEditingServiceId(null);
      fetchServicesAndCounts();
    } catch (err) {
      showToast('Error updating rate: ' + err.message, 'error');
    }
  };

  // Handle Add New Service / Job Submission
  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Job/Service title is required', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('Description & scope of work is required', 'error');
      return;
    }
    if (!formData.baseRate || formData.baseRate <= 0) {
      showToast('Please enter a valid tariff rate', 'error');
      return;
    }

    const effectiveCategory = formData.category === 'Custom' 
      ? (formData.customCategory.trim() || 'General') 
      : formData.category;

    const payload = {
      title: formData.title.trim(),
      category: effectiveCategory,
      emoji: formData.emoji,
      baseRate: `₹${formData.baseRate} fixed visit fee`,
      rateNumber: parseInt(formData.baseRate),
      duration: formData.duration,
      description: formData.description.trim(),
      popular: Boolean(formData.popular),
      availableWorkersCount: parseInt(formData.availableWorkersCount) || 0
    };

    try {
      setSubmitting(true);
      await servicesAPI.create(payload);
      showToast(`✓ New job/service "${formData.title}" published to catalog!`, 'success');
      setIsAddModalOpen(false);
      // Reset form
      setFormData({
        title: '',
        category: 'Plumbing',
        customCategory: '',
        description: '',
        baseRate: 350,
        duration: '1 - 2 hours',
        emoji: '🔧',
        popular: false,
        availableWorkersCount: 0
      });
      fetchServicesAndCounts();
    } catch (err) {
      console.error('Create service error:', err);
      showToast(err.response?.data?.message || err.message || 'Failed to create service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Full Service
  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setEditFormData({
      title: service.title,
      category: service.category,
      emoji: service.emoji,
      baseRate: service.baseRate,
      duration: service.duration,
      description: service.description,
      popular: service.popular
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!editFormData.title?.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: editFormData.title.trim(),
        category: editFormData.category,
        emoji: editFormData.emoji,
        baseRate: `₹${editFormData.baseRate} fixed visit fee`,
        rateNumber: parseInt(editFormData.baseRate),
        duration: editFormData.duration,
        description: editFormData.description?.trim(),
        popular: Boolean(editFormData.popular)
      };

      await servicesAPI.update(editingService.serviceId || editingService.id, payload);
      showToast(`✓ Service "${editFormData.title}" updated successfully!`);
      setIsEditModalOpen(false);
      setEditingService(null);
      fetchServicesAndCounts();
    } catch (err) {
      console.error('Update error:', err);
      showToast(err.response?.data?.message || err.message || 'Failed to update service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Service
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      setDeleting(true);
      await servicesAPI.delete(serviceToDelete.serviceId || serviceToDelete.id);
      showToast(`Service "${serviceToDelete.title}" removed from catalog.`);
      setServiceToDelete(null);
      fetchServicesAndCounts();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.response?.data?.message || err.message || 'Failed to delete service', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Sort Logic
  const allCategories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  const filteredServices = services
    .filter(s => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || s.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      if (sortBy === 'price-asc') return a.baseRate - b.baseRate;
      if (sortBy === 'price-desc') return b.baseRate - a.baseRate;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'workers') return b.activeWorkers - a.activeWorkers;
      return 0;
    });

  // Aggregate Metrics
  const totalServicesCount = services.length;
  const totalCategoriesCount = new Set(services.map(s => s.category)).size;
  const totalWorkersMapped = services.reduce((acc, s) => acc + (s.activeWorkers || 0), 0);
  const avgTariff = totalServicesCount > 0 ? Math.round(services.reduce((acc, s) => acc + s.baseRate, 0) / totalServicesCount) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-2xl)' }}>
      
      {/* 1. HEADER WITH PRIMARY ADD JOB BUTTON */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-md)',
        background: 'var(--color-white)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: '24px' }}>🛠️</span>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: 'var(--color-black)' }}>
              Cooperative Services & Tariff Catalog
            </h1>
          </div>
          <p className="text-secondary" style={{ fontSize: '13px', margin: '4px 0 0' }}>
            Regulated standard trade offerings in MongoDB • 100% direct worker pass-through (0% broker cut)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="ss-button ss-button-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-black)',
            color: 'var(--color-white)',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s ease, background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={18} />
          <span>Add New Job / Service</span>
        </button>
      </div>

      {/* 2. METRICS KPI BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'var(--space-md)'
      }}>
        <Card padding="sm" style={{ borderLeft: '4px solid var(--color-black)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Services
            </span>
            <Wrench size={16} color="var(--color-text-secondary)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-black)' }}>
            {totalServicesCount}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>Standardized catalog</span>
        </Card>

        <Card padding="sm" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              Trades Covered
            </span>
            <Layers size={16} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-black)' }}>
            {totalCategoriesCount}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Skill categories</span>
        </Card>

        <Card padding="sm" style={{ borderLeft: '4px solid #22C55E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              Specialist Workers
            </span>
            <Users size={16} color="#22C55E" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-black)' }}>
            {totalWorkersMapped}
          </div>
          <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 600 }}>Ready for dispatch</span>
        </Card>

        <Card padding="sm" style={{ borderLeft: '4px solid #6366F1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              Average Tariff
            </span>
            <DollarSign size={16} color="#6366F1" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-black)' }}>
            ₹{avgTariff}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Fair base visit rate</span>
        </Card>
      </div>

      {/* 3. TOAST NOTIFICATION */}
      {toast.show && (
        <div style={{
          background: toast.type === 'error' ? '#FEF2F2' : '#F0FDF4',
          border: `1px solid ${toast.type === 'error' ? '#EF4444' : '#22C55E'}`,
          color: toast.type === 'error' ? '#991B1B' : '#15803D',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 4. SEARCH & FILTER TOOLBAR */}
      <Card padding="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="ss-input"
                style={{ paddingLeft: '36px', height: '40px', width: '100%' }}
                placeholder="Search active services, scope of work, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>

            {/* Sort Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} color="var(--color-text-secondary)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ss-input"
                style={{ height: '40px', padding: '0 12px', fontSize: '13px', minWidth: '160px' }}
              >
                <option value="popular">Popular / Featured First</option>
                <option value="name">Name (A to Z)</option>
                <option value="price-asc">Tariff: Low to High</option>
                <option value="price-desc">Tariff: High to Low</option>
                <option value="workers">Most Active Workers</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', alignItems: 'center' }}>
            <span className="text-secondary" style={{ fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', marginRight: '4px' }}>
              Categories:
            </span>
            {allCategories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: isActive ? 'bold' : 'normal',
                    background: isActive ? 'var(--color-black)' : 'var(--color-bg)',
                    color: isActive ? 'white' : 'var(--color-text)',
                    border: `1px solid ${isActive ? 'var(--color-black)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 5. SERVICES GRID */}
      {loading ? (
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
          <Loader2 size={32} className="ss-spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p className="text-secondary" style={{ fontSize: '13px', marginTop: 12 }}>Synchronizing catalog with MongoDB cluster...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Services Found"
          description={searchQuery || selectedCategory !== 'All' 
            ? "No service categories match your filter criteria. Try resetting filters or adding a new job."
            : "The cooperative service catalog is currently empty."
          }
          actionLabel="+ Add New Service / Job"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--space-md)'
        }}>
          {filteredServices.map((svc) => (
            <Card
              key={svc.id}
              padding="md"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                border: svc.popular ? '1px solid #FCD34D' : '1px solid var(--color-border)'
              }}
            >
              {/* Popular Star Badge */}
              {svc.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '12px',
                  background: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FDE68A',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Star size={10} fill="#F59E0B" color="#F59E0B" />
                  <span>Featured Job</span>
                </div>
              )}

              <div>
                {/* Title & Emoji Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      border: '1px solid var(--color-border)'
                    }}>
                      {svc.emoji}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 2px', color: 'var(--color-black)' }}>
                        {svc.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Badge variant="active" style={{ fontSize: '10px', padding: '1px 6px' }}>
                          {svc.category}
                        </Badge>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={11} /> {svc.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope of Work Description */}
                <p className="text-secondary" style={{ fontSize: '12px', lineHeight: 1.45, margin: 'var(--space-sm) 0 var(--space-md)' }}>
                  {svc.description}
                </p>

                {/* Worker Availability Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F8FAFC',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  marginBottom: 'var(--space-sm)'
                }}>
                  <span className="text-secondary">Assigned Specialists:</span>
                  <span style={{
                    fontWeight: 700,
                    color: svc.activeWorkers > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <Users size={12} />
                    {svc.activeWorkers} Registered in Chennai
                  </span>
                </div>
              </div>

              {/* Bottom Tariff & Action Bar */}
              <div style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: 'var(--space-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span className="text-secondary" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}>
                    Cooperative Tariff:
                  </span>
                  
                  {editingServiceId === svc.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span style={{ fontWeight: 'bold' }}>₹</span>
                      <input
                        type="number"
                        className="ss-input"
                        style={{ width: '75px', padding: '2px 6px', height: '28px', fontSize: '13px' }}
                        value={editRate}
                        onChange={(e) => setEditRate(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRate(svc)}
                        style={{
                          background: 'var(--color-black)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingServiceId(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-secondary)',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-black)' }}>
                      ₹{svc.baseRate} <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--color-text-secondary)' }}>visit fee</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {editingServiceId !== svc.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingServiceId(svc.id);
                        setEditRate(svc.baseRate.toString());
                      }}
                      title="Quick edit rate"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        padding: '4px'
                      }}
                    >
                      <Edit2 size={13} />
                      <span>Rate</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(svc)}
                    title="Edit Full Service Details"
                    style={{
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      color: 'var(--color-black)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceToDelete(svc)}
                    title="Delete Service from Catalog"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL: ADD NEW JOB / SERVICE OFFERING                  */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{formData.emoji}</span>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0, color: 'var(--color-black)' }}>
                    Add New Cooperative Service / Job
                  </h2>
                  <p className="text-secondary" style={{ fontSize: '11px', margin: '2px 0 0' }}>
                    Publish a standardized job offering with direct-to-worker tariff.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateService} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Field 1: Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--color-black)' }}>
                  Service / Job Title <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="ss-input"
                  placeholder="e.g. AC Servicing & Gas Refill, Water Purifier Repair, etc."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', height: '40px' }}
                  required
                />
              </div>

              {/* Field 2: Category & Emoji Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--color-black)' }}>
                    Trade / Category <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <select
                    className="ss-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', height: '40px', fontSize: '13px' }}
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Custom">+ Custom Category</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--color-black)' }}>
                    Icon / Emoji
                  </label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxHeight: '40px', overflowY: 'auto', padding: '4px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    {PRESET_EMOJIS.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setFormData({ ...formData, emoji: em })}
                        style={{
                          background: formData.emoji === em ? 'var(--color-accent)' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '15px',
                          padding: '2px 4px'
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Category Input if Custom Selected */}
              {formData.category === 'Custom' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    className="ss-input"
                    placeholder="Enter custom trade name"
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    style={{ width: '100%', height: '38px' }}
                  />
                </div>
              )}

              {/* Field 3: Base Tariff & Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--color-black)' }}>
                    Regulated Tariff (₹) <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: 10, fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>₹</span>
                    <input
                      type="number"
                      className="ss-input"
                      style={{ paddingLeft: '28px', width: '100%', height: '40px', fontWeight: 'bold', fontSize: '14px' }}
                      placeholder="350"
                      value={formData.baseRate}
                      onChange={(e) => setFormData({ ...formData, baseRate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--color-black)' }}>
                    Typical Duration
                  </label>
                  <select
                    className="ss-input"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={{ width: '100%', height: '40px', fontSize: '13px' }}
                  >
                    {DURATION_OPTIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cooperative Transparency Callout */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Customer Pays:</span>
                  <span>₹{formData.baseRate || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803D', fontWeight: 600 }}>
                  <span>Worker Payout (100% direct):</span>
                  <span>₹{formData.baseRate || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                  <span>Cooperative Platform Fee:</span>
                  <span>₹0</span>
                </div>
              </div>

              {/* Field 4: Description / Scope of Work */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--color-black)' }}>
                  Description & Scope of Work <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <textarea
                  className="ss-input"
                  rows={3}
                  placeholder="Describe tasks included in this service, tools required, and safety guidelines..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', resize: 'vertical', padding: '8px 12px', fontSize: '13px' }}
                  required
                />
              </div>

              {/* Field 5: Popular Toggle */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                background: formData.popular ? '#FFFBEB' : 'transparent',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${formData.popular ? '#FDE68A' : 'transparent'}`
              }}>
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  style={{ width: 16, height: 16 }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Feature as Popular Job</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>
                    Pin this job to the top of customer search and app homepage.
                  </div>
                </div>
              </label>

              {/* Modal Footer Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '10px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border)'
              }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'white',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'var(--color-black)',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="ss-spinner" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Create & Publish Job</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL: FULL EDIT SERVICE                               */}
      {/* ========================================================= */}
      {isEditModalOpen && editingService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '540px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0 }}>
                Edit Service: {editingService.title}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateService} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  className="ss-input"
                  value={editFormData.title || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  style={{ width: '100%', height: '38px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Category</label>
                  <select
                    className="ss-input"
                    value={editFormData.category || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    style={{ width: '100%', height: '38px', fontSize: '13px' }}
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Tariff (₹)</label>
                  <input
                    type="number"
                    className="ss-input"
                    value={editFormData.baseRate || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, baseRate: e.target.value })}
                    style={{ width: '100%', height: '38px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Description</label>
                <textarea
                  className="ss-input"
                  rows={3}
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  style={{ width: '100%', resize: 'vertical' }}
                  required
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(editFormData.popular)}
                  onChange={(e) => setEditFormData({ ...editFormData, popular: e.target.checked })}
                />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Mark as Popular / Featured Service</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '8px 18px', borderRadius: '4px', border: 'none', background: 'var(--color-black)', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                >
                  {submitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. MODAL: DELETE CONFIRMATION                             */}
      {/* ========================================================= */}
      {serviceToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-danger)', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: 'var(--color-black)' }}>
                Remove Service from Catalog?
              </h3>
            </div>
            <p className="text-secondary" style={{ fontSize: '13px', lineHeight: 1.5, margin: '0 0 20px' }}>
              Are you sure you want to delete <strong>"{serviceToDelete.title}"</strong> ({serviceToDelete.category})? This will remove this offering from customer booking options.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteService}
                disabled={deleting}
                style={{ padding: '8px 18px', borderRadius: '4px', border: 'none', background: 'var(--color-danger)', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                {deleting ? 'Deleting...' : 'Delete Service'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminServicesScreen;
