import gql from 'graphql-tag';

// Graphql codegen reads these. Don't export them, use generated code for Apollo

const businessListQuery = gql`
  query businessListQuery {
    businesses(limit:10){
      id
      name
      reviews {
        id
        rating
        text
      }
    }
  }
`;

