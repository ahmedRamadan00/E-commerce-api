import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

const EMPTY = { username: '', email: '', password: '', phoneNumber: '' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    usersAPI.getAll().then(setUsers).catch(e => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  };

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit = (u) => { setSelected(u); setForm({ username: u.username, email: u.email, password: '', phoneNumber: u.phoneNumber || '' }); setModal('edit'); };
  const openDelete = (u) => { setSelected(u); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form };
      if (modal === 'edit' && !data.password) delete data.password;
      if (modal === 'create') { await usersAPI.create(data); flash('User created!'); }
      else { await usersAPI.update(selected._id, data); flash('User updated!'); }
      load(); closeModal();
    } catch (e) { flash(e.message, true); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await usersAPI.delete(selected._id);
      flash('User deleted!');
      load(); closeModal();
    } catch (e) { flash(e.message, true); }
    finally { setSaving(false); }
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Users</h2>
        <p className="page-subtitle">// {users.length} registered accounts</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">All Users</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input className="search-input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-primary" onClick={openCreate}>+ New User</button>
          </div>
        </div>

        {loading
          ? <div className="loading-state"><div className="spinner" /><div>Loading...</div></div>
          : filtered.length === 0
            ? <div className="empty-state"><div className="empty-icon">○</div><div className="empty-text">No users found</div></div>
            : <table>
                <thead>
                  <tr><th>ID</th><th>Username</th><th>Email</th><th>Phone</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id}>
                      <td><span className="id-text" title={u._id} onClick={() => navigator.clipboard?.writeText(u._id)}>{u._id}</span></td>
                      <td style={{ color: 'var(--text)', fontWeight: 600 }}>{u.username}</td>
                      <td className="mono">{u.email}</td>
                      <td className="mono">{u.phoneNumber || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                      <td className="mono">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => openDelete(u)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        }
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{modal === 'create' ? 'New User' : 'Edit User'}</span>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="form-input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="john_doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">{modal === 'edit' ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 chars, upper, lower, digit" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="01XXXXXXXXX" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : modal === 'create' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <span className="modal-title">Delete User</span>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6' }}>
                Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>{selected?.username}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
