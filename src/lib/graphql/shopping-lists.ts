import { gql } from '@apollo/client';

export const GET_SHOPPING_LISTS = gql`
  query GetShoppingLists {
    shoppingLists {
      id
      name
      store {
        id
        name
      }
      itemsCount
    }
  }
`;

