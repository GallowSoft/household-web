import { gql } from '@apollo/client';

export const GET_STORES = gql`
  query GetStores {
    stores(isActive: true) {
      id
      name
      address
      phone
      website
      createdAt
    }
  }
`;

export const CREATE_STORE = gql`
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      name
      address
      phone
      website
      createdAt
    }
  }
`;

export const UPDATE_STORE = gql`
  mutation UpdateStore($id: ID!, $input: UpdateStoreInput!) {
    updateStore(id: $id, input: $input) {
      id
      name
      address
      phone
      website
      createdAt
    }
  }
`;

export const DELETE_STORE = gql`
  mutation DeleteStore($id: ID!) {
    deleteStore(id: $id) {
      id
    }
  }
`;

