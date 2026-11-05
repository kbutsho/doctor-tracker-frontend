'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Stethoscope, ShieldCheck, BarChart3, Users, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, PasswordInput, Spinner } from '@/components/ui';
import { getErrorMessage } from '@/lib/utils';

const DEMO = {
  enabled: process.env.NEXT_PUBLIC_DEMO_LOGIN === 'true',
  email: process.env.NEXT_PUBLIC_DEMO_EMAIL || '',
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || '',
};

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const mutation = useMutation({ mutationFn: login, onSuccess: () => router.replace('/dashboard') });

  useEffect(() => { if (!loading && user) router.replace('/dashboard'); }, [loading, user, router]);

  if (loading || user) return <div className="d-flex vh-100 align-items-center justify-content-center"><Spinner size={32} /></div>;

  return (
    <div className="row g-0 min-vh-100">
      <div className="col-lg-6 d-none d-lg-flex auth-hero flex-column justify-content-between p-5">
        <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 40, height: 40, background: 'rgba(255,255,255,.15)' }}><Stethoscope size={24} /></div>
          <span className="fs-4 fw-bold">DoctorTracker</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="display-5 fw-bold lh-sm">Every doctor.<br />Every patient.<br />One clear view.</h2>
          <ul className="list-unstyled mt-4 mb-0" style={{ color: '#e0e7ff' }}>
            <li className="d-flex align-items-center gap-3 mb-3"><Users size={20} /> Manage doctors and their patients</li>
            <li className="d-flex align-items-center gap-3 mb-3"><BarChart3 size={20} /> Live analytics and insights</li>
            <li className="d-flex align-items-center gap-3"><ShieldCheck size={20} /> Secure, role-based access</li>
          </ul>
        </div>
        <p className="small mb-0" style={{ color: '#c7d2fe', position: 'relative', zIndex: 1 }}>© {new Date().getFullYear()} Doctor Tracker</p>
      </div>

      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-sm-5">
        <div className="w-100" style={{ maxWidth: 380 }}>
          <div className="d-flex align-items-center gap-2 mb-4 d-lg-none">
            <div className="brand-icon"><Stethoscope size={20} /></div>
            <span className="fs-5 fw-bold">DoctorTracker</span>
          </div>
          <h1 className="h3 fw-bold">Welcome back</h1>
          <p className="text-secondary small">Sign in to access the admin portal.</p>

          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mt-4" noValidate>
            <div className="mb-3">
              <Input label="Email" type="email" autoComplete="email" placeholder="admin@gmail.com"
                error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
            </div>
            <div className="mb-3">
              <PasswordInput label="Password" autoComplete="current-password" placeholder="••••••••"
                error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
            </div>
            {mutation.isError && <div className="alert alert-danger py-2 small">{getErrorMessage(mutation.error)}</div>}
            <Button type="submit" className="w-100" loading={mutation.isPending}>Sign in</Button>
          </form>

          {DEMO.enabled && DEMO.email && DEMO.password && (
            <button type="button" className="demo-btn d-flex w-100 align-items-center gap-3 p-3 mt-4"
              onClick={() => { setValue('email', DEMO.email, { shouldValidate: true }); setValue('password', DEMO.password, { shouldValidate: true }); }}>
              <span className="stat-icon bg-primary-subtle text-primary flex-shrink-0" style={{ width: 36, height: 36 }}><KeyRound size={16} /></span>
              <span className="small text-truncate">
                <span className="d-block fw-semibold text-primary-emphasis">Use demo credentials</span>
                <span className="d-block text-truncate text-primary" style={{ fontSize: 12 }}>{DEMO.email} · {DEMO.password}</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
