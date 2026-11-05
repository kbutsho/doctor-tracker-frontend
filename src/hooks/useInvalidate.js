import { useQueryClient } from '@tanstack/react-query';

export default function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}
