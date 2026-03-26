export default function Toast({ message, type = 'success' }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '12px 18px',
      borderRadius: 'var(--radius-md)',
      background: type === 'error' ? '#FEF2F2' : '#F0FDF4',
      border: `1px solid ${type === 'error' ? '#FECACA' : '#BBF7D0'}`,
      color: type === 'error' ? '#DC2626' : '#166534',
      fontSize: '13px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'slideIn 0.2s ease',
    }}>
      <span style={{ fontSize: '15px' }}>{type === 'error' ? '✕' : '✓'}</span>
      {message}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}