import { useCallback, useState } from 'react';

export default function useListState(initial) {
  const [params, setParams] = useState({ page: 1, limit: 10, ...initial });
  const update = useCallback((patch) => setParams((p) => ({ ...p, ...patch, page: 1 })), []);
  const setPage = useCallback((page) => setParams((p) => ({ ...p, page })), []);
  const reset = useCallback(() => setParams({ page: 1, limit: 10, ...initial }), []);
  return { params, update, setPage, reset };
}
