'use client';
import { memo } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge, Button, EmptyState, TableSkeleton } from '@/components/ui';
import Avatar from '@/components/common/Avatar';
import { formatDate } from '@/lib/utils';

function PatientsTable({ patients, loading, showDoctor = true, onEdit, onDelete, emptyAction }) {
  if (loading) return <TableSkeleton cols={5} />;
  if (!patients?.length) return <EmptyState title="No patients found" description="Try changing your search or filters." action={emptyAction} />;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Age / Gender</th>
            <th>Condition</th>
            {showDoctor && <th className="d-none d-md-table-cell">Doctor</th>}
            <th className="d-none d-lg-table-cell">Added</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <Avatar name={p.name} />
                  <div className="lh-sm">
                    <div className="fw-medium">{p.name}</div>
                    <small className="text-secondary">{p.phone}</small>
                  </div>
                </div>
              </td>
              <td className="text-secondary text-capitalize text-nowrap">{p.age} · {p.gender}</td>
              <td><Badge tone="teal">{p.condition}</Badge></td>
              {showDoctor && (
                <td className="d-none d-md-table-cell">
                  {p.doctor ? (
                    <Link href={`/doctors/${p.doctor._id}`} className="text-decoration-none text-body lh-sm d-block">
                      {p.doctor.name}
                      <small className="d-block text-secondary">{p.doctor.specialization}</small>
                    </Link>
                  ) : '—'}
                </td>
              )}
              <td className="d-none d-lg-table-cell text-secondary text-nowrap">{formatDate(p.createdAt)}</td>
              <td>
                <div className="d-flex justify-content-end gap-1">
                  {onEdit && <Button variant="ghost" size="icon" onClick={() => onEdit(p)} aria-label="Edit patient"><Pencil size={16} /></Button>}
                  <Button variant="ghost-danger" size="icon" onClick={() => onDelete(p)} aria-label="Delete patient"><Trash2 size={16} /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(PatientsTable);
