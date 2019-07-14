import React from 'react';
import mapboxgl, { Map as TMap } from 'mapbox-gl'

import { BusinessListQueryComponent, BusinessListQueryQuery } from '../generated/graphql';

import { LoadingGuard } from './LoadingGuard';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFja2RlcnJ5cm9zZSIsImEiOiJjankybGNkNWQwcHVpM2JvOXdmNzNvc2FlIn0.ahjk12cEB4FAaRR7IEXBag';

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

type State = {
  lat: number;
  lng: number;
  zoom: number;
};

const initialState: State = {
  // melbourne for now
  lat: -37.808163434,
  lng: 144.957829502,
  zoom: 8
};

class MapView extends React.Component<Props, State> {
  private mapRef: React.RefObject<HTMLDivElement>;
  private map: TMap | undefined;

  constructor(props: Props) {
    super(props);
    this.state = initialState;
    this.mapRef = React.createRef();
  }

  componentDidMount = () => {
    if (!this.mapRef.current) return;

    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });

    this.map.on('move', () => {
      if (!this.map) return;

      const { lng, lat } = this.map.getCenter();
      this.setState({
        lng: lng,
        lat: lat,
        zoom: this.map.getZoom()
      });
    });
  }

  render = () => {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '100%'
        }}
        ref={this.mapRef}
        className="absolute top right left bottom"
      />
    )
  }
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

