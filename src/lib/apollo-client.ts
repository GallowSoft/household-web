import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
});

const authLink = setContext((operation, { headers }) => {
  // Check if this is a login mutation
  const isLogin = operation.operationName === 'Login';
  
  if (isLogin) {
    // Use static client access token for login
    const clientToken = process.env.NEXT_PUBLIC_CLIENT_ACCESS_TOKEN;
    return {
      headers: {
        ...headers,
        authorization: clientToken ? `Bearer ${clientToken}` : '',
      },
    };
  } else {
    // Use dynamic token from localStorage for all other requests
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  }
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

