import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ContactList from './components/ContactList';
import ContactDetail from './components/ContactDetail';
import ContactForm from './components/ContactForm';
import Toast from './components/Toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [activeTag, setActiveTag] = useState('All');
  const [showStarred, setShowStarred] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editContact, setEditContact] = useState(null);

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ✅ Fetch
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch,
        page,
        limit: 6,
      };

      if (activeTag !== 'All') params.tag = activeTag;
      if (showStarred) params.starred = true;

      const res = await axios.get(`${API}/contacts`, { params });

      const data = res.data.contacts;

      setContacts(data);
      setTotalPages(res.data.totalPages || 1);

      const currentSelectedId = selected?._id;
      const stillExists = currentSelectedId && data.find(c => c._id === currentSelectedId);

      if (stillExists) setSelected(stillExists);
      else setSelected(data[0] || null);

    } catch (err) {
      console.error(err);
      showToast('Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeTag, showStarred, page]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleCreate = async (data) => {
    try {
      const res = await axios.post(`${API}/contacts`, data);
      showToast('Contact added');
      setShowForm(false);
      setEditContact(null);
      await fetchContacts();
      setSelected(res.data);
    } catch {
      showToast('Failed to add contact', 'error');
    }
  };

  const handleUpdate = async (data) => {
    try {
      const res = await axios.put(`${API}/contacts/${editContact._id}`, data);
      showToast('Contact updated');
      setShowForm(false);
      setEditContact(null);
      await fetchContacts();
      setSelected(res.data);
    } catch {
      showToast('Failed to update contact', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await axios.delete(`${API}/contacts/${id}`);
      showToast('Contact deleted');
      setSelected(null);
      await fetchContacts();
    } catch {
      showToast('Failed to delete contact', 'error');
    }
  };

  const handleStar = async (id) => {
    try {
      const res = await axios.patch(`${API}/contacts/${id}/star`);
      setContacts(prev => prev.map(c => c._id === id ? res.data : c));
      if (selected?._id === id) setSelected(res.data);
    } catch {
      showToast('Failed to update star', 'error');
    }
  };

  const openEdit = (contact) => {
    setEditContact(contact);
    setShowForm(true);
  };

  // ✅ Export
  const exportCSV = () => {
    const csv = contacts.map(c =>
      `${c.name},${c.email},${c.phone},${c.company}`
    );

    const blob = new Blob(
      [["Name,Email,Phone,Company\n", ...csv].join("\n")],
      { type: "text/csv" }
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
  };

  const tags = ['All', 'Work', 'Client', 'Family', 'Friend', 'Other'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 🔥 HEADER */}
      <header style={{
        background: 'var(--bg-white)',
        borderBottom: '1px solid var(--border)',
        padding: '0 20px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}>
        <span style={{
          fontSize: '17px',
          fontWeight: '600',
          color: 'var(--accent)',
        }}>
          Vault
        </span>

        {/* SEARCH */}
        <div style={{
          flex: 1,
          maxWidth: '360px',
          height: '34px',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          background: 'var(--bg-page)',
        }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              flex: 1,
              fontSize: '13px',
            }}
          />
        </div>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          
          <button
            onClick={exportCSV}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            style={{
              height: '34px',
              padding: '0 14px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Export
          </button>

          <button
            onClick={() => setShowStarred(!showStarred)}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            style={{
              height: '34px',
              padding: '0 14px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: showStarred ? '#eef2ff' : 'white',
              cursor: 'pointer',
            }}
          >
            ⭐ Starred
          </button>

          <button
            onClick={() => { setEditContact(null); setShowForm(true); }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            style={{
              height: '34px',
              padding: '0 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            + New
          </button>
        </div>
      </header>

      {/* 🔥 TAGS */}
      <div style={{
        background: 'var(--bg-white)',
        borderBottom: '1px solid var(--border)',
        padding: '0 20px',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => {
              setActiveTag(tag);
              setPage(1);
            }}
            style={{
              height: '26px',
              padding: '0 12px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: activeTag === tag ? 'var(--accent)' : 'var(--border)',
              background: activeTag === tag ? 'var(--accent)' : 'transparent',
              color: activeTag === tag ? '#fff' : '#555',
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex' }}>
        <ContactList
          contacts={contacts}
          selected={selected}
          onSelect={setSelected}
          loading={loading}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />

        <ContactDetail
          contact={selected}
          onEdit={openEdit}
          onDelete={handleDelete}
          onStar={handleStar}
        />
      </div>

      {showForm && (
        <ContactForm
          contact={editContact}
          onSubmit={editContact ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditContact(null);
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}