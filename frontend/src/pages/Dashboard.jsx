import { useState, useEffect } from 'react';
import { usersAPI, productsAPI } from '../services/api';

export default function Dashboard({ setPage }) {
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([usersAPI.getAll(), productsAPI.getAll()])
      .then(([usersRes, productsRes]) => {
        const users = usersRes.status === 'fulfilled' ? usersRes.value : [];
        const products = productsRes.status === 'fulfilled' ? productsRes.value : [];
        setStats({ users: users.length, products: products.length });
        setRecentUsers(users.slice(0, 5));
        setRecentProducts(products.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">// Overview of your e-commerce platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{loading ? '—' : stats.users}</div>
          <div className="stat-icon">○</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{loading ? '—' : stats.products}</div>
          <div className="stat-icon">⬡</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setPage('orders')}>
          <div className="stat-label">Orders</div>
          <div className="stat-value" style={{ fontSize: '14px', color: 'var(--text-muted)', paddingTop: '10px' }}>Query by ID →</div>
          <div className="stat-icon">◻</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="table-container">
          <div className="table-header">
            <span className="table-title">Recent Users</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('users')}>View All</button>
          </div>
          {loading
            ? <div className="loading-state"><div className="spinner" /></div>
            : recentUsers.length === 0
              ? <div className="empty-state"><div className="empty-icon">○</div><div className="empty-text">No users yet</div></div>
              : <table>
                  <thead><tr><th>Username</th><th>Email</th></tr></thead>
                  <tbody>
                    {recentUsers.map(u => (
                      <tr key={u._id}>
                        <td>{u.username}</td>
                        <td className="mono">{u.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          }
        </div>

        <div className="table-container">
          <div className="table-header">
            <span className="table-title">Recent Products</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('products')}>View All</button>
          </div>
          {loading
            ? <div className="loading-state"><div className="spinner" /></div>
            : recentProducts.length === 0
              ? <div className="empty-state"><div className="empty-icon">⬡</div><div className="empty-text">No products yet</div></div>
              : <table>
                  <thead><tr><th>Name</th><th>Price</th><th>Stock</th></tr></thead>
                  <tbody>
                    {recentProducts.map(p => (
                      <tr key={p._id}>
                        <td>{p.name}</td>
                        <td className="mono">${p.price}</td>
                        <td><span className={`badge ${p.stock ? 'badge-success' : 'badge-danger'}`}>{p.stock ? 'In Stock' : 'Out'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          }
        </div>
      </div>
    </div>
  );
}
