'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Building2, Mail, Pencil, Phone, Plus } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import SearchInput from '@/components/common/SearchInput';
import DateRange from '@/components/common/DateRange';
import ResetFilters from '@/components/common/ResetFilters';
import DoctorFormModal from '@/components/doctors/DoctorFormModal';
import PatientFormModal from '@/components/patients/PatientFormModal';
import PatientsTable from '@/components/patients/PatientsTable';
import { Badge, Button, Card, ConfirmDialog, EmptyState, Pagination, Select, Skeleton } from '@/components/ui';
import useListState from '@/hooks/useListState';
import useClampPage from '@/hooks/useClampPage';
import useInvalidate from '@/hooks/useInvalidate';
import { doctorService, patientService } from '@/services';
import { formatDate, getErrorMessage } from '@/lib/utils';

const initial = { search: '', condition: '', from: '', to: '', sortBy: 'createdAt', order: 'desc' };

export default function DoctorDetailPage() {
  const { id } = useParams();
  const invalidate = useInvalidate();
  const { params, update, setPage, reset } = useListState(initial);
  const [editDoctor, setEditDoctor] = useState(false);
  const [patientForm, setPatientForm] = useState({ open: false, patient: null });
  const [deleting, setDeleting] = useState(null);

  const { data: doctor, isLoading, isError } = useQuery({ queryKey: ['doctor', id], queryFn: () => doctorService.get(id) });
  const { data: patients, isLoading: loadingPatients, isFetching } = useQuery({
    queryKey: ['doctor-patients', id, params],
    queryFn: () => doctorService.patients(id, params),
    placeholderData: keepPreviousData,
  });
  useClampPage(patients?.meta, setPage);
  const { data: conditions } = useQuery({ queryKey: ['conditions'], queryFn: patientService.conditions, staleTime: 60_000 });

  const onEditPatient = useCallback((p) => setPatientForm({ open: true, patient: p }), []);

  const remove = useMutation({
    mutationFn: (patientId) => doctorService.removePatient({ doctorId: id, patientId }),
    onSuccess: () => { toast.success('Patient removed'); invalidate(); setDeleting(null); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isError) return <Card><EmptyState title="Doctor not found" action={<Link href="/doctors" className="btn btn-primary">Back to doctors</Link>} /></Card>;

  return (
    <>
      <Link href="/doctors" className="d-inline-flex align-items-center gap-2 small text-secondary text-decoration-none mb-3"><ArrowLeft size={16} /> All doctors</Link>

      <Card className="p-3 p-sm-4 mb-4">
        {isLoading ? <Skeleton height={80} /> : (
          <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <Avatar name={doctor.name} size={64} />
              <div>
                <h1 className="h4 fw-bold mb-1">{doctor.name}</h1>
                <div className="d-flex flex-wrap align-items-center gap-2"><Badge>{doctor.specialization}</Badge><small className="text-secondary">Joined {formatDate(doctor.createdAt)}</small></div>
                <div className="d-flex flex-wrap column-gap-4 row-gap-1 mt-3 small text-secondary">
                  <span className="d-inline-flex align-items-center gap-2"><Building2 size={16} />{doctor.hospital}</span>
                  <span className="d-inline-flex align-items-center gap-2"><Mail size={16} />{doctor.email}</span>
                  <span className="d-inline-flex align-items-center gap-2"><Phone size={16} />{doctor.phone}</span>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-primary-subtle text-center px-4 py-2"><div className="h4 fw-bold text-primary-emphasis mb-0">{doctor.patientsCount}</div><small className="text-primary">Patients</small></div>
              <Button variant="secondary" onClick={() => setEditDoctor(true)}><Pencil size={16} /> Edit</Button>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 p-3 border-bottom">
          <h2 className="h6 fw-semibold mb-0">Patients</h2>
          <Button onClick={() => setPatientForm({ open: true, patient: null })}><Plus size={16} /> Add patient</Button>
        </div>
        <div className="row g-2 p-3 border-bottom">
          <div className="col-12 col-sm-6 col-lg-3"><SearchInput value={params.search} onChange={(search) => update({ search })} placeholder="Search patients…" /></div>
          <div className="col-12 col-sm-6 col-lg-3">
            <Select aria-label="Condition" value={params.condition} onChange={(e) => update({ condition: e.target.value })}>
              <option value="">All conditions</option>
              {conditions?.conditions.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <DateRange from={params.from} to={params.to} onChange={update} colClass="col-12 col-sm-6 col-lg-2" />
          <ResetFilters onClick={reset} className="col-12 col-sm-6 col-lg-2" />
        </div>
        <div className={isFetching ? 'is-fetching' : 'is-loaded'}>
          <PatientsTable patients={patients?.items} loading={loadingPatients} showDoctor={false} onEdit={onEditPatient} onDelete={setDeleting} />
        </div>
        <Pagination meta={patients?.meta} onPage={setPage} />
      </Card>

      <DoctorFormModal open={editDoctor} onClose={() => setEditDoctor(false)} doctor={doctor} />
      <PatientFormModal open={patientForm.open} patient={patientForm.patient} doctorId={patientForm.patient ? undefined : id}
        onClose={() => setPatientForm({ open: false, patient: null })} />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id)} title="Remove patient?" confirmLabel="Remove"
        message={`${deleting?.name} will be permanently removed from this doctor's patient list.`} />
    </>
  );
}
