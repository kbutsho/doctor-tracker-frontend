import { Input } from '@/components/ui';

export default function DateRange({ from, to, onChange, colClass = 'col-12 col-sm-6 col-lg-3' }) {
  return (
    <>
      <div className={colClass}><Input type="date" aria-label="From date" value={from} max={to || undefined} onChange={(e) => onChange({ from: e.target.value })} /></div>
      <div className={colClass}><Input type="date" aria-label="To date" value={to} min={from || undefined} onChange={(e) => onChange({ to: e.target.value })} /></div>
    </>
  );
}
