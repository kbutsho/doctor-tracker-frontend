'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (count, err) => (err?.response?.status >= 500 || !err?.response) && count < 1,
      },
    },
  }));
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" toastOptions={{ style: { fontSize: 14, borderRadius: 12 } }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
