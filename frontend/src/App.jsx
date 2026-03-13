import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pages = {
    dashboard: <Dashboard setPage={setCurrentPage} />,
    products: <ProductsPage />,
    users: <UsersPage />,
    orders: <OrdersPage />,
  };

  return (
    <div className="app-shell">
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} />
      <main className="main-content">
        {pages[currentPage]}
      </main>
    </div>
  );
}
