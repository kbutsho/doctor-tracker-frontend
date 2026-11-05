'use client';
import { useCallback, useState } from 'react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import DateRange from '@/components/common/DateRange';
import ResetFilters from '@/components/common/ResetFilters';
import PatientFormModal from '@/components/patients/PatientFormModal';
import PatientsTable from '@/components/patients/PatientsTable';
import { Button, Card, ConfirmDialog, Pagination, Select } from '@/components/ui';
import useListState from '@/hooks/useListState';
import useClampPage from '@/hooks/useClampPage';
import useInvalidate from '@/hooks/useInvalidate';
import { doctorService, patientService } from '@/services';
import { getErrorMessage } from '@/lib/utils';

const SORTS = [['createdAt:desc', 'Newest first'], ['createdAt:asc', 'Oldest first'], ['name:asc', 'Name A–Z'], ['age:desc', 'Age (high → low)'], ['age:asc', 'Age (low → high)']];
const initial = { search: '', condition: '', gender: '', doctor: '', from: '', to: '', sortBy: 'createdAt', order: 'desc' };
const COL = 'col-12 col-sm-6 col-lg-3';

export default function PatientsPage() {
  const invalidate = useInvalidate();
  const { params, update, setPage, reset } = useListState(initial);
  const [form, setForm] = useState({ open: false, patient: null });
  const [deleting, setDeleting] = useState(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientService.list(params),
    placeholderData: keepPreviousData,
  });
  useClampPage(data?.meta, setPage);
  const { data: conditions } = useQuery({ queryKey: ['conditions'], queryFn: patientService.conditions, staleTime: 60_000 });
  const { data: doctors } = useQuery({
    queryKey: ['doctor-options'],
    queryFn: () => doctorService.list({ limit: 100, sortBy: 'name', order: 'asc' }),
    staleTime: 60_000,
  });

  const onEdit = useCallback((p) => setForm({ open: true, patient: p }), []);

  const remove = useMutation({
    mutationFn: (id) => patientService.remove(id),
    onSuccess: () => { toast.success('Patient deleted'); invalidate(); setDeleting(null); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <>
      <PageHeader title="Patients" subtitle="All patients across doctors"
        action={<Button onClick={() => setForm({ open: true, patient: null })}><Plus size={16} /> Add patient</Button>} />

      <Card>
        <div className="row g-2 p-3 border-bottom">
          <div className="col-12 col-lg-3"><SearchInput value={params.search} onChange={(search) => update({ search })} placeholder="Search name, phone, condition…" /></div>
          <div className={COL}>
            <Select aria-label="Condition" value={params.condition} onChange={(e) => update({ condition: e.target.value })}>
              <option value="">All conditions</option>
              {conditions?.conditions.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div className={COL}>
            <Select aria-label="Doctor" value={params.doctor} onChange={(e) => update({ doctor: e.target.value })}>
              <option value="">All doctors</option>
              {doctors?.items.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Select>
          </div>
          <div className={COL}>
            <Select aria-label="Gender" value={params.gender} onChange={(e) => update({ gender: e.target.value })}>
              <option value="">All genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <DateRange from={params.from} to={params.to} onChange={update} colClass={COL} />
          <div className={COL}>
            <Select aria-label="Sort" value={`${params.sortBy}:${params.order}`} onChange={(e) => { const [sortBy, order] = e.target.value.split(':'); update({ sortBy, order }); }}>
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </div>
          <ResetFilters onClick={reset} className={COL} />
        </div>

        <div className={isFetching ? 'is-fetching' : 'is-loaded'}>
          <PatientsTable patients={data?.items} loading={isLoading} onEdit={onEdit} onDelete={setDeleting} />
        </div>
        <Pagination meta={data?.meta} onPage={setPage} />
      </Card>

      <PatientFormModal open={form.open} patient={form.patient} onClose={() => setForm({ open: false, patient: null })} />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id)} title="Delete patient?"
        message={`${deleting?.name} will be permanently deleted.`} />
    </>
  );
}
