'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, Stethoscope, Users, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: Users },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  return (
    <>
      {open && <div className="app-overlay" onClick={onClose} />}
      <aside className={cn('app-sidebar', open && 'open')}>
        <div className="d-flex align-items-center justify-content-between px-4" style={{ height: 64 }}>
          <div className="d-flex align-items-center gap-2">
            <div className="brand-icon"><Stethoscope size={20} /></div>
            <span className="fs-5 fw-bold text-white">DoctorTracker</span>
          </div>
          <button type="button" className="btn btn-link text-secondary p-0 d-lg-none" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="flex-grow-1 d-flex flex-column gap-1 px-3 pt-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} onClick={onClose} className={cn('sidebar-link', active && 'active')}>
                <Icon size={20} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-2">
          <button type="button" className="sidebar-logout" onClick={() => { onClose(); logout(); }}><LogOut size={20} /> Logout</button>
        </div>
        <p className="px-4 pb-3 pt-2 small mb-0" style={{ color: '#64748b' }}>© {new Date().getFullYear()} Doctor Tracker</p>
      </aside>
    </>
  );
}
