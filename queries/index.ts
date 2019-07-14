import gql from 'graphql-tag';

// Graphql codegen reads these. Don't export them, use generated code for Apollo

export const businessFragment = gql`
  fragment business on businesses {
    id
    name
    lat
    long
    reviews {
      id
      rating
      text
    }
  }
`;

const businessListQuery = gql`
  query businessListQuery {
    businesses(limit:10) {
      ...business
    }
  }

  ${businessFragment}
`;
