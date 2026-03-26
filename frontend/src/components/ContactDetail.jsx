const tagColors = {
  Work: { bg: '#EEF2FF', text: '#4338CA' },
  Client: { bg: '#F0FDF4', text: '#166534' },
  Family: { bg: '#FFF7ED', text: '#9A3412' },
  Friend: { bg: '#FDF4FF', text: '#7E22CE' },
  Other: { bg: '#F8F9FB', text: '#475569' },
};

const avatarColors = [
  { bg: '#EEF2FF', text: '#4338CA' },
  { bg: '#F0FDF4', text: '#166534' },
  { bg: '#FFF7ED', text: '#9A3412' },
  { bg: '#FDF4FF', text: '#7E22CE' },
  { bg: '#EFF6FF', text: '#1D4ED8' },
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: '4px',
      }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

export default function ContactDetail({ contact, onEdit, onDelete, onStar }) {
  if (!contact) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        color: 'var(--text-muted)',
        background: 'var(--bg-page)',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="var(--text-muted)" strokeWidth="1.2"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: '14px' }}>Select a contact to view details</span>
      </div>
    );
  }

  const av = getAvatarColor(contact.name);
  const tag = tagColors[contact.tag] || tagColors.Other;

  return (
    <div style={{
      flex: 1,
      background: 'var(--bg-page)',
      overflowY: 'auto',
      padding: '32px 36px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        marginBottom: '32px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: av.bg,
          color: av.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: '600',
          flexShrink: 0,
          border: '2px solid var(--border)',
        }}>
          {getInitials(contact.name)}
        </div>
        <div>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {contact.name}
            <button
              onClick={() => onStar(contact._id)}
              title={contact.starred ? 'Remove star' : 'Star contact'}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '18px',
                color: contact.starred ? 'var(--star)' : 'var(--text-muted)',
                padding: 0,
                lineHeight: 1,
              }}
            >
              {contact.starred ? '★' : '☆'}
            </button>
          </div>
          <div style={{ marginTop: '6px' }}>
            <span style={{
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500',
              background: tag.bg,
              color: tag.text,
            }}>
              {contact.tag}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', marginBottom: '24px' }} />

      {/* Fields */}
      <Field label="Email" value={contact.email} />
      <Field label="Phone" value={contact.phone} />
      <Field label="Company" value={contact.company} />
      <Field label="Added" value={new Date(contact.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      })} />

      {/* Actions */}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onEdit(contact)}
          style={{
            height: '34px',
            padding: '0 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--bg-white)',
            color: 'var(--text-primary)',
            fontWeight: '500',
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(contact._id)}
          style={{
            height: '34px',
            padding: '0 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--red-border)',
            background: 'var(--red-light)',
            color: 'var(--red)',
            fontWeight: '500',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}