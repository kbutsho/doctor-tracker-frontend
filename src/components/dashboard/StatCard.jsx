import { memo } from 'react';
import { Card } from '@/components/ui';

const tones = { indigo: 'primary', teal: 'success', amber: 'warning', rose: 'danger' };

function StatCard({ label, value, hint, icon: Icon, tone = 'indigo' }) {
  const t = tones[tone];
  return (
    <Card className="p-3 p-sm-4 h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="text-secondary small mb-2">{label}</p>
          <p className="display-6 fw-bold mb-0 lh-1">{value}</p>
        </div>
        <div className={`stat-icon bg-${t}-subtle text-${t}-emphasis`}><Icon size={20} /></div>
      </div>
      {hint && <p className="text-secondary small mt-3 mb-0">{hint}</p>}
    </Card>
  );
}

export default memo(StatCard);
