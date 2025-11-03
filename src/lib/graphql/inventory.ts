import { gql } from '@apollo/client';

export const GET_INVENTORY_ITEMS = gql`
  query GetInventoryItems {
    inventoryItems {
      id
      name
      description
      currentQuantity
      unitOfMeasure
      category
      storageLocation
      expirationDate
      createdAt
      updatedAt
    }
  }
`;

