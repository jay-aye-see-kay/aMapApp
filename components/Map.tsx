import React from 'react';

import { BusinessListQueryComponent, BusinessListQueryQuery } from '../generated/graphql';

import { LoadingGuard } from './LoadingGuard';


type Props = {
  data: BusinessListQueryQuery;
};

const MapView = ({ data }: Props) => {
  return (
    <div>{JSON.stringify(data)}</div>
  )
}

export const Map = () => {
  return (
    <BusinessListQueryComponent>
      {({ loading, error, data }) => (
        <LoadingGuard loading={loading} error={error}>
          {data && <MapView data={data} />}
        </LoadingGuard>
      )}
    </BusinessListQueryComponent>
  )
}

