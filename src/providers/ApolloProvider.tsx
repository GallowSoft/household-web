'use client';

import { ApolloProvider as ClientApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/lib/apollo-client';

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ClientApolloProvider client={apolloClient}>{children}</ClientApolloProvider>;
}

