import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Camera,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Check,
  X,
  Eye,
  Save,
  Plus,
  Building2,
  Phone,
  RotateCcw,
  LogOut
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useAuth } from '../../../context/AuthContext';
import { authAPI } from '../../../services/api';

export const SkillProfile = () => {
  const navigate = useNavigate();
  const { worker, updateWorker } = useWorker();
  const { currentUser, logout } = useAuth();


  // 1. Name & Avatar
  const [name, setName] = useState(worker.name || 'Ravi Kumar');
  const [phone, setPhone] = useState(worker.phone || '+91 98220 11223');
  const [avatar, setAvatar] = useState('RK');

  // 2. Skills (Multi-select)
  const availableSkills = [
    'Home Electrical Wiring',
    'Fan & Light Fitting',
    'MCB Tripping & Fuse Fix',
    'Inverter Line Setup',
    'Appliance Safety Check',
    'Switchboard Replacement',
    'Plumbing & Pipe Fitting',
    'Carpentry & Wood Repair',
    'Deep House Cleaning',
    'Driver Assistance'
  ];

  const [selectedSkills, setSelectedSkills] = useState(
    worker.skills && worker.skills.length > 0 && worker.skills[0] !== 'Electrical'
      ? worker.skills
      : [
          'Home Electrical Wiring',
          'Fan & Light Fitting',
          'MCB Tripping & Fuse Fix',
          'Inverter Line Setup',
          'Appliance Safety Check',
          'Switchboard Replacement'
        ]
  );

  // 3. Experience
  const [experience, setExperience] = useState(worker.experience?.replace(/[^0-9]/g, '') || '7');

  // 4. Certifications
  const [certifications, setCertifications] = useState([
    { id: 1, name: 'Govt. ITI Electrical Certified', issuer: 'National Vocational Council', verified: true },
    { id: 2, name: 'Police Background Cleared', issuer: 'Chennai Police Dept', verified: true },
    { id: 3, name: 'Coop Safety Trade Assessment Passed', issuer: 'Chennai Labour Society', verified: true },
    { id: 4, name: 'Society Registration #CLC-EL-402', issuer: 'Ward 4 Cooperative', verified: true }
  ]);

  // 5. Languages (Multi-select)
  const languageOptions = ['Tamil (Native)', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Marathi'];
  const [selectedLanguages, setSelectedLanguages] = useState(
    worker.languages && worker.languages.length > 0 ? worker.languages : ['Tamil (Native)', 'English', 'Hindi']
  );

  // 6. Service Area / Radius
  const radiusOptions = ['2 km (Local Ward)', '5 km (Standard)', '10 km (Extended)', '15 km (Whole City)'];
  const [selectedRadius, setSelectedRadius] = useState(worker.serviceRadius || '5 km (Standard)');

  // 7. Interactive Availability Matrix (7 Days x 3 Slots)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const slots = [
    { id: 'morning', label: 'Morning (9 AM–1 PM)' },
    { id: 'afternoon', label: 'Afternoon (1 PM–5 PM)' },
    { id: 'evening', label: 'Evening (5 PM–9 PM)' }
  ];

  // Initial matrix state
  const [availabilityGrid, setAvailabilityGrid] = useState({
    Mon: { morning: true, afternoon: true, evening: true },
    Tue: { morning: true, afternoon: true, evening: true },
    Wed: { morning: true, afternoon: true, evening: true },
    Thu: { morning: true, afternoon: true, evening: true },
    Fri: { morning: true, afternoon: true, evening: true },
    Sat: { morning: true, afternoon: true, evening: false },
    Sun: { morning: false, afternoon: false, evening: false }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync with active authenticated worker account
  useEffect(() => {
    if (currentUser || worker) {
      const activeName = currentUser?.name || worker?.name || 'Worker Member';
      setName(activeName);
      setPhone(currentUser?.phone || worker?.phone || '');
      setAvatar(currentUser?.avatar || worker?.avatar || activeName.split(' ').map(n => n[0]).join('').toUpperCase() || 'W');
      if (worker?.skills && worker.skills.length > 0) {
        setSelectedSkills(worker.skills);
      } else if (currentUser?.skill) {
        setSelectedSkills([currentUser.skill]);
      }
      if (worker?.experience) {
        setExperience(worker.experience.replace(/[^0-9]/g, ''));
      }
    }
  }, [currentUser, worker]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleGridCell = (day, slotId) => {
    setAvailabilityGrid((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slotId]: !prev[day][slotId]
      }
    }));
  };

  const setAllAvailable = () => {
    const full = {};
    days.forEach((d) => {
      full[d] = { morning: true, afternoon: true, evening: true };
    });
    setAvailabilityGrid(full);
  };

  const setWeekendOff = () => {
    setAvailabilityGrid((prev) => ({
      ...prev,
      Sat: { morning: true, afternoon: false, evening: false },
      Sun: { morning: false, afternoon: false, evening: false }
    }));
  };

  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    updateWorker({
      name,
      phone,
      skills: selectedSkills,
      experience: `${experience} years`,
      languages: selectedLanguages,
      serviceRadius: selectedRadius
    });

    try {
      await authAPI.updateProfile({
        userId: currentUser?.userId,
        phone,
        name,
        skill: selectedSkills[0] || 'Electrician',
        experience: `${experience} years`
      });
    } catch (err) {
      console.warn('MongoDB worker profile sync warning:', err.message);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. TOP HEADER & "PREVIEW AS CUSTOMER SEES IT" CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
            My Skill Profile
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Edit your trade skills, certifications, and availability schedule
          </p>
        </div>

        {/* Big Preview Button */}
        <Button
          variant="primary"
          size="small"
          icon={Eye}
          onClick={() => navigate('/customer/worker/ravi-kumar')}
        >
          Preview as customer sees it
        </Button>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div style={{
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success)',
          color: 'var(--color-success)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <CheckCircle2 size={18} />
          <span>Profile changes saved and updated in cooperative directory!</span>
        </div>
      )}

      {/* 2. SECTION 1: NAME + PHOTO (EDITABLE) */}
      <Card padding="md">
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
          1. Worker Identification
        </h2>

        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          {/* Avatar with Camera Overlay */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 70,
              height: 70,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-black)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: 'bold'
            }}>
              {avatar}
            </div>
            <button
              type="button"
              onClick={() => alert('Photo change dialog: Select an updated portrait')}
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'var(--color-accent)',
                color: 'white',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Change Profile Photo"
            >
              <Camera size={13} />
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: '12px', fontWeight: 600 }}>
              <ShieldCheck size={14} />
              <span>✓ Verified Cooperative Worker</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Chennai Labour Cooperative — Ward 4 (#CLC-EL-402)
            </div>
          </div>
        </div>

        {/* Editable Name & Phone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div className="ss-form-group" style={{ marginBottom: 0 }}>
            <label className="ss-label" htmlFor="skill-name">Full Name (Shown to Customers)</label>
            <input
              id="skill-name"
              type="text"
              className="ss-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                const initials = e.target.value.split(' ').map((n) => n[0]).join('').toUpperCase();
                if (initials) setAvatar(initials.slice(0, 2));
              }}
            />
          </div>

          <div className="ss-form-group" style={{ marginBottom: 0 }}>
            <label className="ss-label" htmlFor="skill-phone">Contact Number</label>
            <input
              id="skill-phone"
              type="text"
              className="ss-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* 3. SECTION 2: SKILLS (CHIP MULTI-SELECT, EDITABLE) */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>
            2. Trade Skills & Specialties
          </h2>
          <span className="text-secondary" style={{ fontSize: '12px' }}>
            {selectedSkills.length} selected
          </span>
        </div>
        <p className="text-secondary" style={{ fontSize: '12px', margin: '0 0 var(--space-sm)' }}>
          Tap chips to add or remove trade specialties displayed on your public profile.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {availableSkills.map((sk) => {
            const isSelected = selectedSkills.includes(sk);
            return (
              <button
                key={sk}
                type="button"
                onClick={() => toggleSkill(sk)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-black)',
                  border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSelected ? `✓ ${sk}` : `+ ${sk}`}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 4. SECTION 3: EXPERIENCE (YEARS, EDITABLE) */}
      <Card padding="md">
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
          3. Professional Experience
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <input
            type="number"
            className="ss-input"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            min={1}
            max={45}
            style={{ width: '90px', fontSize: '18px', fontWeight: 'bold' }}
          />
          <div>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Years of Experience</span>
            <div className="text-secondary" style={{ fontSize: '12px' }}>
              Displayed on Smart Match ranking algorithm
            </div>
          </div>
        </div>
      </Card>

      {/* 5. SECTION 4: CERTIFICATIONS (LIST WITH VERIFIED BADGES) */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>
            4. Official Certifications
          </h2>
          <Badge variant="success">All Verified</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginTop: 'var(--space-xs)' }}>
          {certifications.map((cert) => (
            <div
              key={cert.id}
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={14} color="var(--color-success)" strokeWidth={2.5} />
                  <span>{cert.name}</span>
                </div>
                <div className="text-secondary" style={{ fontSize: '11px', marginLeft: 18 }}>
                  Issued by {cert.issuer}
                </div>
              </div>
              <Badge variant="success" style={{ fontSize: '10px' }}>✓ Verified</Badge>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-sm)' }}>
          <Button
            variant="outline"
            size="small"
            icon={Plus}
            onClick={() => alert('Certificate upload: Select Govt. ITI or trade diploma PDF to submit for society verification.')}
          >
            + Add New Certificate
          </Button>
        </div>
      </Card>

      {/* 6. SECTION 5: LANGUAGES (CHIP MULTI-SELECT, EDITABLE) */}
      <Card padding="md">
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
          5. Languages Spoken
        </h2>
        <p className="text-secondary" style={{ fontSize: '12px', margin: '0 0 var(--space-sm)' }}>
          Select languages you comfortably communicate in with customers.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {languageOptions.map((lang) => {
            const isSelected = selectedLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--color-black)' : 'var(--color-bg)',
                  color: isSelected ? 'white' : 'var(--color-black)',
                  border: '1px solid var(--color-border)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isSelected ? `✓ ${lang}` : `+ ${lang}`}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 7. SECTION 6: SERVICE WORKING RADIUS */}
      <Card padding="md">
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
          6. Service Working Radius
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
          {radiusOptions.map((rad) => (
            <button
              key={rad}
              type="button"
              onClick={() => setSelectedRadius(rad)}
              style={{
                padding: '10px 8px',
                borderRadius: 'var(--radius-sm)',
                background: selectedRadius === rad ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                border: `1.5px solid ${selectedRadius === rad ? 'var(--color-accent)' : 'var(--color-border)'}`,
                fontSize: '12px',
                fontWeight: 'bold',
                color: selectedRadius === rad ? 'var(--color-accent)' : 'var(--color-black)',
                cursor: 'pointer'
              }}
            >
              {rad}
            </button>
          ))}
        </div>
      </Card>

      {/* 8. SECTION 7: INTERACTIVE WEEKLY AVAILABILITY GRID (TAP TO TOGGLE) */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              7. Weekly Availability Schedule
            </h2>
            <p className="text-secondary" style={{ fontSize: '12px', margin: '2px 0 0' }}>
              Tap any block to mark available (✓) or unavailable (-)
            </p>
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-xs)', margin: 'var(--space-sm) 0' }}>
          <button
            type="button"
            onClick={setAllAvailable}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Mark All Available
          </button>
          <button
            type="button"
            onClick={setWeekendOff}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Set Weekends Off
          </button>
        </div>

        {/* Interactive Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1.5px solid var(--color-border)' }}>
                <th style={{ padding: '8px 4px', textAlign: 'left', fontWeight: 'bold' }}>Day</th>
                <th style={{ padding: '8px 4px', fontWeight: 'bold' }}>Morning<br /><span style={{ fontSize: '10px', color: '#757575' }}>9-1 PM</span></th>
                <th style={{ padding: '8px 4px', fontWeight: 'bold' }}>Afternoon<br /><span style={{ fontSize: '10px', color: '#757575' }}>1-5 PM</span></th>
                <th style={{ padding: '8px 4px', fontWeight: 'bold' }}>Evening<br /><span style={{ fontSize: '10px', color: '#757575' }}>5-9 PM</span></th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const isWeekend = day === 'Sat' || day === 'Sun';
                return (
                  <tr key={day} style={{ borderBottom: '1px solid var(--color-border)', background: isWeekend ? '#FAF8F5' : 'white' }}>
                    <td style={{ padding: '8px 4px', textAlign: 'left', fontWeight: 'bold' }}>
                      {day}
                    </td>

                    {/* Morning */}
                    <td style={{ padding: '4px' }}>
                      <button
                        type="button"
                        onClick={() => toggleGridCell(day, 'morning')}
                        style={{
                          width: '100%',
                          padding: '6px 0',
                          borderRadius: '4px',
                          border: 'none',
                          background: availabilityGrid[day].morning ? 'var(--color-success-bg)' : 'var(--color-bg)',
                          color: availabilityGrid[day].morning ? 'var(--color-success)' : '#9E9E9E',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {availabilityGrid[day].morning ? '✓ Open' : '- Off'}
                      </button>
                    </td>

                    {/* Afternoon */}
                    <td style={{ padding: '4px' }}>
                      <button
                        type="button"
                        onClick={() => toggleGridCell(day, 'afternoon')}
                        style={{
                          width: '100%',
                          padding: '6px 0',
                          borderRadius: '4px',
                          border: 'none',
                          background: availabilityGrid[day].afternoon ? 'var(--color-success-bg)' : 'var(--color-bg)',
                          color: availabilityGrid[day].afternoon ? 'var(--color-success)' : '#9E9E9E',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {availabilityGrid[day].afternoon ? '✓ Open' : '- Off'}
                      </button>
                    </td>

                    {/* Evening */}
                    <td style={{ padding: '4px' }}>
                      <button
                        type="button"
                        onClick={() => toggleGridCell(day, 'evening')}
                        style={{
                          width: '100%',
                          padding: '6px 0',
                          borderRadius: '4px',
                          border: 'none',
                          background: availabilityGrid[day].evening ? 'var(--color-success-bg)' : 'var(--color-bg)',
                          color: availabilityGrid[day].evening ? 'var(--color-success)' : '#9E9E9E',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {availabilityGrid[day].evening ? '✓ Open' : '- Off'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 9. BOTTOM ACTION BUTTONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <Button
          variant="primary"
          size="large"
          icon={Save}
          fullWidth
          onClick={handleSaveChanges}
        >
          Save Profile Changes
        </Button>

        <Button
          variant="outline"
          fullWidth
          icon={Eye}
          onClick={() => navigate('/customer/worker/ravi-kumar')}
        >
          Preview as customer sees it
        </Button>
      </div>

    </div>
  );
};

export default SkillProfile;
