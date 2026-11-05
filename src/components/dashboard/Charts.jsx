'use client';
import { memo } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { shortDate } from '@/lib/utils';

export const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444', '#84cc16'];
const tooltipStyle = { borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgb(0 0 0 / 0.06)', fontSize: 12 };

function TimelineChartBase({ patients, doctors }) {
  const data = patients.map((p, i) => ({ date: p.date, patients: p.count, doctors: doctors[i]?.count ?? 0 }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
          <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} /><stop offset="95%" stopColor="#14b8a6" stopOpacity={0} /></linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={shortDate} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="patients" name="New patients" stroke="#6366f1" strokeWidth={2} fill="url(#gp)" />
        <Area type="monotone" dataKey="doctors" name="New doctors" stroke="#14b8a6" strokeWidth={2} fill="url(#gd)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PatientsPerDoctorChartBase({ data }) {
  const rows = data.map((d) => ({ ...d, label: d.name.replace(/^Dr\.?\s+/i, '') }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(260, rows.length * 36)}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11, fill: '#334155' }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }} formatter={(v) => [v, 'Patients']} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#6366f1" barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DonutChartBase({ data, nameKey }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey={nameKey} innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, textTransform: 'capitalize' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export const TimelineChart = memo(TimelineChartBase);
export const PatientsPerDoctorChart = memo(PatientsPerDoctorChartBase);
export const DonutChart = memo(DonutChartBase);
