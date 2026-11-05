import { useEffect } from 'react';

export default function useClampPage(meta, setPage) {
  useEffect(() => {
    if (meta && meta.page > meta.totalPages) setPage(meta.totalPages);
  }, [meta, setPage]);
}
