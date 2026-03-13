export default function Sidebar({ currentPage, setPage }) {
  const nav = [
    { id: 'dashboard', icon: '◈', label: 'Dashboard' },
    { id: 'products', icon: '⬡', label: 'Products' },
    { id: 'users', icon: '○', label: 'Users' },
    { id: 'orders', icon: '◻', label: 'Orders' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>ShopAPI</h1>
        <span>Admin Panel v1.0</span>
      </div>
      <nav className="sidebar-nav">
        {nav.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="api-status">
          <div className="dot" />
          <span>API: localhost:3000</span>
        </div>
      </div>
    </aside>
  );
}
