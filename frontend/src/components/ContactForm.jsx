import { useState, useEffect } from 'react';

const TAGS = ['Work', 'Client', 'Family', 'Friend', 'Other'];

export default function ContactForm({ contact, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    tag: 'Other',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (contact) {
    setForm({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      tag: contact.tag || 'Other',
    });
  } else {
    // reset form when creating new contact
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      tag: 'Other',
    });
  }

  setErrors({}); // clear old errors
}, [contact]);

  const validate = () => {
  const e = {};

  if (!form.name.trim()) e.name = 'Name is required';

  if (!form.email.trim()) e.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email))
    e.email = 'Enter a valid email';

  if (!form.phone.trim()) e.phone = 'Phone is required';

  return e;
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSubmit(form);
  };

  const inputStyle = (field) => ({
    width: '100%',
    height: '38px',
    border: `1px solid ${errors[field] ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '0 12px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    background: 'var(--bg-page)',
    outline: 'none',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    marginBottom: '5px',
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(30, 37, 53, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div style={{
        background: 'var(--bg-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 28px 24px',
        width: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {contact ? 'Edit Contact' : 'New Contact'}
          </h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '20px', color: 'var(--text-muted)', lineHeight: 1, padding: 0 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" style={inputStyle('name')} />
              {errors.name && <div style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px' }}>{errors.name}</div>}
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" style={inputStyle('email')} />
              {errors.email && <div style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px' }}>{errors.email}</div>}
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" style={inputStyle('phone')} />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="Company name" style={inputStyle('company')} />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={labelStyle}>Tag</label>
            <select
              name="tag"
              value={form.tag}
              onChange={handleChange}
              style={{ ...inputStyle('tag'), cursor: 'pointer' }}
            >
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: '36px',
                padding: '0 18px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: 'var(--bg-white)',
                color: 'var(--text-secondary)',
                fontWeight: '500',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                height: '36px',
                padding: '0 22px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: '500',
              }}
            >
              {contact ? 'Save changes' : 'Add contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}