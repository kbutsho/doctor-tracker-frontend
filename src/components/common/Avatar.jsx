import { memo } from 'react';
import { initials } from '@/lib/utils';

function Avatar({ name, size = 36 }) {
  return <div className="avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}>{initials(name)}</div>;
}

export default memo(Avatar);
