'use client';
import { Button, Card, EmptyState } from '@/components/ui';

export default function AppError({ error, reset }) {
  return (
    <Card>
      <EmptyState title="Something went wrong" description={error?.message || 'An unexpected error occurred.'}
        action={<Button onClick={reset}>Try again</Button>} />
    </Card>
  );
}
