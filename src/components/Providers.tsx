'use client';

import { ApolloProviderWrapper } from '@/providers/ApolloProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProviderWrapper>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ApolloProviderWrapper>
  );
}


