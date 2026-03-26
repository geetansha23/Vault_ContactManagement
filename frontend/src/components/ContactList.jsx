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

export default function ContactList({
  contacts,
  selected,
  onSelect,
  loading,
  page,
  totalPages,
  setPage
}) {
  if (loading && contacts.length === 0) {
    return (
      <div style={{
        width: '280px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '13px',
        flexShrink: 0,
      }}>
        Loading...
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div style={{
        width: '280px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: 'var(--text-muted)',
        flexShrink: 0,
        padding: '20px',
        textAlign: 'center',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="var(--text-muted)" strokeWidth="1.5"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: '13px' }}>No contacts found</span>
      </div>
    );
  }

  return (
    <div style={{
      width: '280px',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-white)',
      flexShrink: 0,
    }}>

      {/* Scrollable List */}
      <div style={{
        overflowY: 'auto',
        flex: 1,
      }}>
        {contacts.map(contact => {
          const isSelected = selected?._id === contact._id;
          const av = getAvatarColor(contact.name);
          const tag = tagColors[contact.tag] || tagColors.Other;

          return (
            <div
              key={contact._id}
              onClick={() => onSelect(contact)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                cursor: 'pointer',
                background: isSelected ? 'var(--bg-selected)' : 'var(--bg-white)',
                borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-white)'; }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isSelected ? 'var(--accent)' : av.bg,
                color: isSelected ? '#fff' : av.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                flexShrink: 0,
              }}>
                {getInitials(contact.name)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '4px',
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {contact.name}
                  </span>

                  {contact.starred && (
                    <span style={{ color: 'var(--star)', fontSize: '12px' }}>★</span>
                  )}
                </div>

                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {contact.company || contact.email}
                </div>

                <span style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '1px 7px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '500',
                  background: tag.bg,
                  color: tag.text,
                }}>
                  {contact.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Pagination Footer */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-white)',
      }}>
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            background: page === 1 ? '#eee' : 'var(--bg-white)',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Prev
        </button>

        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            background: page === totalPages ? '#eee' : 'var(--bg-white)',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          Next
        </button>
      </div>

    </div>
  );
}