'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button, Input, Modal, Select, Textarea } from '@/components/ui';
import { doctorService, patientService } from '@/services';
import useInvalidate from '@/hooks/useInvalidate';
import { getErrorMessage } from '@/lib/utils';

const empty = { name: '', age: '', gender: 'male', phone: '', condition: '', notes: '', doctor: '' };

export default function PatientFormModal({ open, onClose, patient, doctorId }) {
  const isEdit = Boolean(patient);
  const invalidate = useInvalidate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: empty });

  const { data: doctors } = useQuery({
    queryKey: ['doctor-options'],
    queryFn: () => doctorService.list({ limit: 100, sortBy: 'name', order: 'asc' }),
    enabled: open && !doctorId,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!open) return;
    reset(patient ? {
      name: patient.name, age: patient.age, gender: patient.gender, phone: patient.phone,
      condition: patient.condition, notes: patient.notes || '', doctor: patient.doctor?._id || '',
    } : empty);
  }, [open, patient, reset]);

  const mutation = useMutation({
    mutationFn: (v) => {
      const body = { ...v, age: Number(v.age) };
      if (doctorId) return doctorService.addPatient({ doctorId, ...body });
      return isEdit ? patientService.update({ id: patient._id, ...body }) : patientService.create(body);
    },
    onSuccess: () => { toast.success(isEdit ? 'Patient updated' : 'Patient added'); invalidate(); onClose(); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit patient' : 'Add new patient'} size="lg">
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <div className="row g-3">
          <div className="col-12 col-sm-6"><Input label="Full name" error={errors.name?.message} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} /></div>
          <div className="col-12 col-sm-6"><Input label="Phone" placeholder="+8801800000000" error={errors.phone?.message} {...register('phone', { required: 'Required', pattern: { value: /^\+?[\d\s-]{7,20}$/, message: 'Invalid phone number' } })} /></div>
          <div className="col-12 col-sm-6"><Input label="Age" type="number" error={errors.age?.message} {...register('age', { required: 'Required', min: { value: 0, message: 'Invalid age' }, max: { value: 150, message: 'Invalid age' } })} /></div>
          <div className="col-12 col-sm-6">
            <Select label="Gender" {...register('gender')}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div className="col-12 col-sm-6"><Input label="Condition" placeholder="e.g. Hypertension" error={errors.condition?.message} {...register('condition', { required: 'Required' })} /></div>
          {!doctorId && (
            <div className="col-12 col-sm-6">
              <Select label="Doctor" error={errors.doctor?.message} {...register('doctor', { required: 'Select a doctor' })}>
                <option value="">Select doctor…</option>
                {doctors?.items.map((d) => <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>)}
              </Select>
            </div>
          )}
          <div className="col-12"><Textarea label="Notes (optional)" {...register('notes')} /></div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Save changes' : 'Add patient'}</Button>
        </div>
      </form>
    </Modal>
  );
}
