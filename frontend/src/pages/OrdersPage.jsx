import { useState } from 'react';
import { ordersAPI, usersAPI, productsAPI } from '../services/api';

export default function OrdersPage() {
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ userId: '', products: [{ productId: '', quantity: 1 }], totalAmount: '' });

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 4000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  };

  const searchOrder = async () => {
    if (!searchId.trim()) return;
    setLoading(true); setOrder(null); setError('');
    try {
      const data = await ordersAPI.getById(searchId.trim());
      setOrder(data);
    } catch (e) { flash(e.message, true); }
    finally { setLoading(false); }
  };

  const openCreate = async () => {
    const [u, p] = await Promise.allSettled([usersAPI.getAll(), productsAPI.getAll()]);
    setUsers(u.status === 'fulfilled' ? u.value : []);
    setProducts(p.status === 'fulfilled' ? p.value : []);
    setForm({ userId: '', products: [{ productId: '', quantity: 1 }], totalAmount: '' });
    setModal('create');
  };

  const addProduct = () => setForm({ ...form, products: [...form.products, { productId: '', quantity: 1 }] });
  const removeProduct = (i) => setForm({ ...form, products: form.products.filter((_, idx) => idx !== i) });
  const updateProduct = (i, field, val) => {
    const updated = [...form.products];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, products: updated });
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const data = { ...form, totalAmount: Number(form.totalAmount), products: form.products.map(p => ({ ...p, quantity: Number(p.quantity) })) };
      const created = await ordersAPI.create(data);
      flash('Order created!');
      setOrder(created);
      setSearchId(created._id);
      setModal(null);
    } catch (e) { flash(e.message, true); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!order) return;
    setSaving(true);
    try {
      await ordersAPI.delete(order._id);
      flash('Order deleted!');
      setOrder(null); setSearchId('');
    } catch (e) { flash(e.message, true); }
    finally { setSaving(false); setModal(null); }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Orders</h2>
        <p className="page-subtitle">// Search and manage customer orders</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          className="search-input"
          style={{ flex: 1 }}
          placeholder="Enter Order ID to search..."
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchOrder()}
        />
        <button className="btn btn-ghost" onClick={searchOrder} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
        <button className="btn btn-primary" onClick={openCreate}>+ New Order</button>
      </div>

      {order && (
        <div className="table-container">
          <div className="table-header">
            <div>
              <span className="table-title">Order Details</span>
              <div style={{ marginTop: '4px' }}>
                <span className="id-text" title={order._id}>{order._id}</span>
              </div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => setModal('delete')}>Delete Order</button>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>User ID</div>
                <span className="id-text" title={order.userId}>{order.userId}</span>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Total Amount</div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>${order.totalAmount}</span>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Created At</div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Products ({order.products?.length})</div>
            <table>
              <thead><tr><th>Product ID</th><th>Quantity</th></tr></thead>
              <tbody>
                {order.products?.map((p, i) => (
                  <tr key={i}>
                    <td><span className="id-text" title={p.productId}>{p.productId}</span></td>
                    <td className="mono">× {p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!order && !loading && searchId && (
        <div className="empty-state">
          <div className="empty-icon">◻</div>
          <div className="empty-text">No order found with that ID</div>
        </div>
      )}

      {modal === 'create' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <span className="modal-title">New Order</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">User *</label>
                {users.length > 0
                  ? <select className="form-select" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}>
                      <option value="">Select user...</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.username} ({u.email})</option>)}
                    </select>
                  : <input className="form-input" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} placeholder="User ID" />
                }
              </div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Products</div>
              {form.products.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 32px', gap: '8px', marginBottom: '8px' }}>
                  {products.length > 0
                    ? <select className="form-select" value={p.productId} onChange={e => updateProduct(i, 'productId', e.target.value)}>
                        <option value="">Select product...</option>
                        {products.map(pr => <option key={pr._id} value={pr._id}>{pr.name} (${pr.price})</option>)}
                      </select>
                    : <input className="form-input" value={p.productId} onChange={e => updateProduct(i, 'productId', e.target.value)} placeholder="Product ID" />
                  }
                  <input className="form-input" type="number" min="1" value={p.quantity} onChange={e => updateProduct(i, 'quantity', e.target.value)} placeholder="Qty" />
                  {form.products.length > 1 && (
                    <button className="btn btn-danger btn-sm" onClick={() => removeProduct(i)} style={{ padding: '0', justifyContent: 'center' }}>✕</button>
                  )}
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={addProduct} style={{ marginBottom: '16px' }}>+ Add Product</button>
              <div className="form-group">
                <label className="form-label">Total Amount *</label>
                <input className="form-input" type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} placeholder="0.00" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Order'}</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <span className="modal-title">Delete Order</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6' }}>Are you sure you want to delete this order? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
