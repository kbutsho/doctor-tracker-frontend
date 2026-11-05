import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ResetFilters({ onClick, className }) {
  return (
    <div className={className}>
      <Button variant="secondary" className="w-100" onClick={onClick}><RotateCcw size={16} /> Reset filters</Button>
    </div>
  );
}
