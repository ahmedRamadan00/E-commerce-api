import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const EMPTY = { name: '', price: '', description: '', category: '', stock: true };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
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
    productsAPI.getAll().then(setProducts).catch(e => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  };

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit = (p) => { setSelected(p); setForm({ name: p.name, price: p.price, description: p.description, category: p.category, stock: p.stock }); setModal('edit'); };
  const openDelete = (p) => { setSelected(p); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price) };
      if (modal === 'create') { await productsAPI.create(data); flash('Product created!'); }
      else { await productsAPI.update(selected._id, data); flash('Product updated!'); }
      load(); closeModal();
    } catch (e) { flash(e.message, true); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await productsAPI.delete(selected._id);
      flash('Product deleted!');
      load(); closeModal();
    } catch (e) { flash(e.message, true); }
    finally { setSaving(false); }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Products</h2>
        <p className="page-subtitle">// {products.length} items in catalog</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">All Products</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-primary" onClick={openCreate}>+ New Product</button>
          </div>
        </div>

        {loading
          ? <div className="loading-state"><div className="spinner" /><div>Loading...</div></div>
          : filtered.length === 0
            ? <div className="empty-state"><div className="empty-icon">⬡</div><div className="empty-text">No products found</div></div>
            : <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id}>
                      <td><span className="id-text" title={p._id} onClick={() => navigator.clipboard?.writeText(p._id)}>{p._id}</span></td>
                      <td style={{ color: 'var(--text)', fontWeight: 600 }}>{p.name}</td>
                      <td className="mono">${p.price}</td>
                      <td>{p.category}</td>
                      <td><span className={`badge ${p.stock ? 'badge-success' : 'badge-danger'}`}>{p.stock ? 'In Stock' : 'Out of Stock'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => openDelete(p)}>Delete</button>
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
              <span className="modal-title">{modal === 'create' ? 'New Product' : 'Edit Product'}</span>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone 15 Pro" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Price *</label>
                  <input className="form-input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <input className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Electronics" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <input className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Status *</label>
                <select className="form-select" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value === 'true' })}>
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : modal === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <span className="modal-title">Delete Product</span>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6' }}>
                Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>{selected?.name}</strong>? This action cannot be undone.
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
