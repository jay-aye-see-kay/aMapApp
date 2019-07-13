import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const MapView = ({ data }: any) => {
  console.log(data);
  return <div />
}


const businessListQuery = gql`
  query {
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

export const Map = () => {
  return (
    <Query query={businessListQuery}>
      {({ loading, error, data }: any) => (
        <MapView data={data} />
      )}
    </Query>
  )
}
