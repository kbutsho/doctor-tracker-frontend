'use client';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { KeyRound, UserRound } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Avatar from '@/components/common/Avatar';
import { Badge, Button, Card, Input, PasswordInput } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';
import { formatDate, getErrorMessage } from '@/lib/utils';

const SectionTitle = ({ icon: Icon, tone, title, subtitle }) => (
  <div className="d-flex align-items-center gap-3 mb-4">
    <div className={`stat-icon bg-${tone}-subtle text-${tone}-emphasis`} style={{ width: 40, height: 40 }}><Icon size={20} /></div>
    <div><h2 className="h6 fw-semibold mb-0">{title}</h2><small className="text-secondary">{subtitle}</small></div>
  </div>
);

function ProfileForm() {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({ defaultValues: { name: user.name, email: user.email } });

  const mutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (u) => { updateUser(u); reset({ name: u.name, email: u.email }); toast.success('Profile updated'); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Card className="p-3 p-sm-4 h-100">
      <SectionTitle icon={UserRound} tone="primary" title="Profile information" subtitle="Update your name and email address." />
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <div className="mb-3"><Input label="Full name" error={errors.name?.message} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} /></div>
        <div className="mb-3"><Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} /></div>
        <div className="d-flex justify-content-end pt-2"><Button type="submit" loading={mutation.isPending} disabled={!isDirty}>Save changes</Button></div>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });

  const mutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }) => authService.changePassword({ currentPassword, newPassword }),
    onSuccess: () => { reset(); toast.success('Password updated'); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Card className="p-3 p-sm-4 h-100">
      <SectionTitle icon={KeyRound} tone="warning" title="Change password" subtitle="Other devices will be signed out." />
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <div className="mb-3">
          <PasswordInput label="Current password" autoComplete="current-password"
            error={errors.currentPassword?.message} {...register('currentPassword', { required: 'Current password is required' })} />
        </div>
        <div className="mb-3">
          <PasswordInput label="New password" autoComplete="new-password" error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
              validate: (v) => (/[A-Za-z]/.test(v) && /\d/.test(v)) || 'Must include a letter and a number',
            })} />
        </div>
        <div className="mb-2">
          <PasswordInput label="Confirm new password" autoComplete="new-password" error={errors.confirmPassword?.message}
            {...register('confirmPassword', { required: 'Please confirm the new password', validate: (v) => v === watch('newPassword') || 'Passwords do not match' })} />
        </div>
        <p className="text-secondary small">Use at least 8 characters with a mix of letters and numbers.</p>
        <div className="d-flex justify-content-end pt-1"><Button type="submit" loading={mutation.isPending}>Update password</Button></div>
      </form>
    </Card>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="My profile" subtitle="Manage your account details and security" />
      <Card className="d-flex flex-row align-items-center gap-3 p-3 p-sm-4 mb-4">
        <Avatar name={user.name} size={64} />
        <div>
          <h2 className="h5 fw-bold mb-0">{user.name}</h2>
          <div className="text-secondary small">{user.email}</div>
          <div className="d-flex align-items-center gap-2 mt-2"><Badge className="text-capitalize">{user.role}</Badge><small className="text-secondary">Member since {formatDate(user.createdAt)}</small></div>
        </div>
      </Card>
      <div className="row g-4">
        <div className="col-12 col-lg-6"><ProfileForm /></div>
        <div className="col-12 col-lg-6"><PasswordForm /></div>
      </div>
    </>
  );
}
