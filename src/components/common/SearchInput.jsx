'use client';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';

export default function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  const [text, setText] = useState(value || '');
  const debounced = useDebounce(text, 400);

  useEffect(() => { setText(value || ''); }, [value]);
  useEffect(() => { if (debounced !== (value || '')) onChange(debounced); }, [debounced]);

  return (
    <div className="position-relative">
      <Search size={16} className="position-absolute top-50 translate-middle-y text-secondary" style={{ left: 14, pointerEvents: 'none' }} />
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} className="form-control" style={{ paddingLeft: 38 }} aria-label={placeholder} />
    </div>
  );
}
