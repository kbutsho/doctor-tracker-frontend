'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button, Input, Modal } from '@/components/ui';
import { doctorService } from '@/services';
import useInvalidate from '@/hooks/useInvalidate';
import { getErrorMessage } from '@/lib/utils';

const empty = { name: '', specialization: '', hospital: '', phone: '', email: '' };

export default function DoctorFormModal({ open, onClose, doctor }) {
  const isEdit = Boolean(doctor);
  const invalidate = useInvalidate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: empty });

  useEffect(() => {
    if (open) reset(doctor ? { name: doctor.name, specialization: doctor.specialization, hospital: doctor.hospital, phone: doctor.phone, email: doctor.email } : empty);
  }, [open, doctor, reset]);

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? doctorService.update({ id: doctor._id, ...values }) : doctorService.create(values)),
    onSuccess: () => { toast.success(isEdit ? 'Doctor updated' : 'Doctor created'); invalidate(); onClose(); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit doctor' : 'Add new doctor'}>
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <div className="row g-3">
          <div className="col-12"><Input label="Full name" placeholder="Dr. Jane Doe" error={errors.name?.message} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} /></div>
          <div className="col-12 col-sm-6"><Input label="Specialization" placeholder="Cardiology" error={errors.specialization?.message} {...register('specialization', { required: 'Required' })} /></div>
          <div className="col-12 col-sm-6"><Input label="Hospital" placeholder="Square Hospital" error={errors.hospital?.message} {...register('hospital', { required: 'Required' })} /></div>
          <div className="col-12 col-sm-6"><Input label="Phone" placeholder="+8801700000000" error={errors.phone?.message} {...register('phone', { required: 'Required', pattern: { value: /^\+?[\d\s-]{7,20}$/, message: 'Invalid phone number' } })} /></div>
          <div className="col-12 col-sm-6"><Input label="Email" type="email" placeholder="doctor@hospital.com" error={errors.email?.message} {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} /></div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Save changes' : 'Create doctor'}</Button>
        </div>
      </form>
    </Modal>
  );
}
