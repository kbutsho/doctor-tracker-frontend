'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Activity, Stethoscope, UserPlus, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import Avatar from '@/components/common/Avatar';
import { Badge, Card, EmptyState, Select, Skeleton } from '@/components/ui';
import { dashboardService } from '@/services';
import { formatDate } from '@/lib/utils';

const chartLoading = () => <Skeleton height={256} />;
const lazyChart = (name) => dynamic(() => import('@/components/dashboard/Charts').then((m) => m[name]), { ssr: false, loading: chartLoading });
const TimelineChart = lazyChart('TimelineChart');
const PatientsPerDoctorChart = lazyChart('PatientsPerDoctorChart');
const DonutChart = lazyChart('DonutChart');

const ChartCard = ({ title, subtitle, children, className }) => (
  <div className={className}>
    <Card className="p-3 p-sm-4 h-100">
      <h3 className="h6 fw-semibold mb-1">{title}</h3>
      {subtitle && <p className="text-secondary small mb-3">{subtitle}</p>}
      {children}
    </Card>
  </div>
);

export default function DashboardPage() {
  const [days, setDays] = useState(30);
  const { data, isLoading, isError } = useQuery({ queryKey: ['dashboard', days], queryFn: () => dashboardService.stats({ days }) });

  const range = (
    <div style={{ width: 170 }}>
      <Select aria-label="Date range" value={days} onChange={(e) => setDays(Number(e.target.value))}>
        <option value={7}>Last 7 days</option>
        <option value={30}>Last 30 days</option>
        <option value={90}>Last 90 days</option>
      </Select>
    </div>
  );

  if (isError) return <Card><EmptyState title="Could not load dashboard" description="Please refresh the page." /></Card>;

  if (isLoading) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Overview of doctors and patients" />
        <div className="row g-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="col-12 col-sm-6 col-xl-3"><Skeleton height={128} /></div>)}
          <div className="col-12 col-lg-8"><Skeleton height={320} /></div>
          <div className="col-12 col-lg-4"><Skeleton height={320} /></div>
        </div>
      </>
    );
  }

  const { totals } = data;
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of doctors and patients" action={range} />

      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3"><StatCard label="Total doctors" value={totals.doctors} icon={Stethoscope} tone="indigo" hint={`+${totals.newDoctorsLast7Days} in the last 7 days`} /></div>
        <div className="col-12 col-sm-6 col-xl-3"><StatCard label="Total patients" value={totals.patients} icon={Users} tone="teal" hint={`+${totals.newPatientsLast7Days} in the last 7 days`} /></div>
        <div className="col-12 col-sm-6 col-xl-3"><StatCard label="Avg patients / doctor" value={totals.avgPatientsPerDoctor} icon={Activity} tone="amber" hint="Across all doctors" /></div>
        <div className="col-12 col-sm-6 col-xl-3"><StatCard label="New patients (7d)" value={totals.newPatientsLast7Days} icon={UserPlus} tone="rose" hint="Recently registered" /></div>

        <ChartCard className="col-12 col-lg-8" title="Registrations over time" subtitle={`New patients and doctors per day · last ${data.rangeDays} days`}>
          <TimelineChart patients={data.patientsTimeline} doctors={data.doctorsTimeline} />
        </ChartCard>
        <ChartCard className="col-12 col-lg-4" title="Patient conditions" subtitle="Most common conditions">
          {data.conditionDistribution.length ? <DonutChart data={data.conditionDistribution} nameKey="condition" /> : <EmptyState title="No data" />}
        </ChartCard>

        <ChartCard className="col-12 col-lg-8" title="Patients per doctor" subtitle="Top doctors by number of patients">
          {data.patientsPerDoctor.length ? <PatientsPerDoctorChart data={data.patientsPerDoctor} /> : <EmptyState title="No data" />}
        </ChartCard>
        <ChartCard className="col-12 col-lg-4" title="Specializations" subtitle="Doctors by specialization">
          {data.specializationDistribution.length ? <DonutChart data={data.specializationDistribution} nameKey="specialization" /> : <EmptyState title="No data" />}
        </ChartCard>

        <ChartCard className="col-12 col-lg-4" title="Gender split" subtitle="All patients">
          {data.genderDistribution.length ? <DonutChart data={data.genderDistribution} nameKey="gender" /> : <EmptyState title="No data" />}
        </ChartCard>
        <div className="col-12 col-lg-8">
          <Card className="h-100">
            <div className="d-flex align-items-center justify-content-between p-3 p-sm-4 pb-2">
              <div><h3 className="h6 fw-semibold mb-1">Recent patients</h3><p className="text-secondary small mb-0">Latest registrations</p></div>
              <Link href="/patients" className="small fw-medium text-decoration-none">View all</Link>
            </div>
            {data.recentPatients.length === 0 ? <EmptyState title="No patients yet" /> : (
              <ul className="list-group list-group-flush">
                {data.recentPatients.map((p) => (
                  <li key={p._id} className="list-group-item d-flex align-items-center gap-3 px-3 px-sm-4 py-3">
                    <Avatar name={p.name} />
                    <div className="flex-grow-1 min-w-0" style={{ minWidth: 0 }}>
                      <div className="small fw-medium text-truncate">{p.name}</div>
                      <div className="text-secondary text-truncate" style={{ fontSize: 12 }}>{p.doctor?.name} · {formatDate(p.createdAt)}</div>
                    </div>
                    <Badge tone="teal">{p.condition}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
