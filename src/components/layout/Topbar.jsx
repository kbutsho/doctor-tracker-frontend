'use client';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/common/Avatar';

export default function Topbar({ onMenu }) {
  const { user } = useAuth();
  return (
    <header className="app-topbar sticky-top d-flex align-items-center justify-content-between border-bottom px-3 px-sm-4">
      <button type="button" className="btn btn-ghost btn-icon d-lg-none" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <div className="d-none d-lg-block" />
      <div className="d-flex align-items-center gap-3">
        <Link href="/profile" className="profile-link d-flex align-items-center gap-2 p-1 pe-2" title="My profile">
          <div className="d-none d-sm-block text-end lh-sm">
            <div className="small fw-semibold">{user?.name}</div>
            <div className="text-secondary text-capitalize" style={{ fontSize: 12 }}>{user?.role}</div>
          </div>
          <Avatar name={user?.name} />
        </Link>
      </div>
    </header>
  );
}
