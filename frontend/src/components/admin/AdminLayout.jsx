import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

export default function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  function handleLogout() {
    dispatch(logout());
    router.push('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>RenewCred CMS</h2>
        <p>Dashboard</p>
        <button onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
