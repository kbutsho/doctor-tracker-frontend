'use client';
import { useState } from 'react';
import Link from 'next/link';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import DateRange from '@/components/common/DateRange';
import ResetFilters from '@/components/common/ResetFilters';
import Avatar from '@/components/common/Avatar';
import DoctorFormModal from '@/components/doctors/DoctorFormModal';
import { Badge, Button, Card, ConfirmDialog, EmptyState, Pagination, Select, TableSkeleton } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import useListState from '@/hooks/useListState';
import useClampPage from '@/hooks/useClampPage';
import useInvalidate from '@/hooks/useInvalidate';
import { doctorService } from '@/services';
import { formatDate, getErrorMessage } from '@/lib/utils';

const SORTS = [
  ['createdAt:desc', 'Newest first'], ['createdAt:asc', 'Oldest first'],
  ['name:asc', 'Name A–Z'], ['name:desc', 'Name Z–A'],
  ['specialization:asc', 'Specialization A–Z'],
];
const initial = { search: '', specialization: '', hospital: '', from: '', to: '', sortBy: 'createdAt', order: 'desc' };
const COL = 'col-12 col-sm-6 col-lg-3';

export default function DoctorsPage() {
  const { user } = useAuth();
  const invalidate = useInvalidate();
  const { params, update, setPage, reset } = useListState(initial);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['doctors', params],
    queryFn: () => doctorService.list(params),
    placeholderData: keepPreviousData,
  });
  useClampPage(data?.meta, setPage);
  const { data: options } = useQuery({ queryKey: ['doctor-filters'], queryFn: doctorService.filters, staleTime: 60_000 });

  const remove = useMutation({
    mutationFn: (id) => doctorService.remove(id),
    onSuccess: () => { toast.success('Doctor deleted'); invalidate(); setDeleting(null); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const openForm = (doctor = null) => { setEditing(doctor); setFormOpen(true); };

  return (
    <>
      <PageHeader title="Doctors" subtitle="Manage doctors and view their patients"
        action={<Button onClick={() => openForm()}><Plus size={16} /> Add doctor</Button>} />

      <Card>
        <div className="row g-2 p-3 border-bottom">
          <div className="col-12 col-lg-3"><SearchInput value={params.search} onChange={(search) => update({ search })} placeholder="Search name, email, phone…" /></div>
          <div className={COL}>
            <Select aria-label="Specialization" value={params.specialization} onChange={(e) => update({ specialization: e.target.value })}>
              <option value="">All specializations</option>
              {options?.specializations.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div className={COL}>
            <Select aria-label="Hospital" value={params.hospital} onChange={(e) => update({ hospital: e.target.value })}>
              <option value="">All hospitals</option>
              {options?.hospitals.map((h) => <option key={h}>{h}</option>)}
            </Select>
          </div>
          <div className={COL}>
            <Select aria-label="Sort" value={`${params.sortBy}:${params.order}`}
              onChange={(e) => { const [sortBy, order] = e.target.value.split(':'); update({ sortBy, order }); }}>
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </div>
          <DateRange from={params.from} to={params.to} onChange={update} colClass={COL} />
          <ResetFilters onClick={reset} className="col-12 col-sm-6 col-lg-6" />
        </div>

        {isLoading ? <TableSkeleton /> : isError ? <EmptyState title="Failed to load doctors" /> : data.items.length === 0 ? (
          <EmptyState title="No doctors found" description="Try changing your search or filters." action={<Button onClick={() => openForm()}>Add doctor</Button>} />
        ) : (
          <div className={`table-responsive ${isFetching ? 'is-fetching' : 'is-loaded'}`}>
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th className="d-none d-md-table-cell">Hospital</th>
                  <th className="d-none d-lg-table-cell">Contact</th>
                  <th>Patients</th>
                  <th className="d-none d-xl-table-cell">Joined</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((d) => (
                  <tr key={d._id}>
                    <td>
                      <Link href={`/doctors/${d._id}`} className="d-flex align-items-center gap-3 text-decoration-none text-body">
                        <Avatar name={d.name} />
                        <span className="fw-medium text-nowrap">{d.name}</span>
                      </Link>
                    </td>
                    <td><Badge>{d.specialization}</Badge></td>
                    <td className="d-none d-md-table-cell text-secondary text-nowrap">{d.hospital}</td>
                    <td className="d-none d-lg-table-cell lh-sm"><div>{d.email}</div><small className="text-secondary">{d.phone}</small></td>
                    <td className="fw-semibold">{d.patientsCount}</td>
                    <td className="d-none d-xl-table-cell text-secondary text-nowrap">{formatDate(d.createdAt)}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-1">
                        <Link href={`/doctors/${d._id}`} className="btn btn-ghost btn-sm btn-icon" aria-label="View patients"><Eye size={16} /></Link>
                        <Button variant="ghost" size="icon" onClick={() => openForm(d)} aria-label="Edit doctor"><Pencil size={16} /></Button>
                        {user?.role === 'admin' && (
                          <Button variant="ghost-danger" size="icon" onClick={() => setDeleting(d)} aria-label="Delete doctor"><Trash2 size={16} /></Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination meta={data?.meta} onPage={setPage} />
      </Card>

      <DoctorFormModal open={formOpen} onClose={() => setFormOpen(false)} doctor={editing} />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id)} title="Delete doctor?"
        message={`This will permanently delete ${deleting?.name} and all of their ${deleting?.patientsCount ?? 0} patient record(s).`} />
    </>
  );
}
