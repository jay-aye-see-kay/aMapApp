import React from 'react';
import ReactMapGL, { ViewState } from 'react-map-gl';

import { BusinessListQueryComponent, BusinessListQueryQuery } from '../generated/graphql';

import { LoadingGuard } from './LoadingGuard';

const initialViewState: ViewState = {
  // melbourne for now
  latitude: -37.808163434,
  longitude: 144.957829502,
  zoom: 8
};

const mapStyle = {
  version: 8,
  sources: {
    points: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {type: 'Feature', geometry: {type: 'Point', coordinates: [-37.8, 144.9]}}
        ]
      }
    }
  },
  layers: [
    {
      id: 'my-layer',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-color': '#f00',
        'circle-radius': 4
      }
    }
  ]
};

type Props = {
  data: BusinessListQueryQuery;
};

const MapView = ({ data }: Props) => {
  const [viewport, setViewport] = React.useState<ViewState>(initialViewState);
  const dimentions = { height: 400, width: 400 };

  return (
    <ReactMapGL
      {...viewport}
      {...dimentions}
      // mapStyle={mapStyle}
      onViewportChange={(v) => setViewport(v)}
    />
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

