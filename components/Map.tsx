import React from 'react';
import mapboxgl, { Map as TMap } from 'mapbox-gl'

import { BusinessListQueryComponent, BusinessListQueryQuery } from '../generated/graphql';

import { LoadingGuard } from './LoadingGuard';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFja2RlcnJ5cm9zZSIsImEiOiJjankybGNkNWQwcHVpM2JvOXdmNzNvc2FlIn0.ahjk12cEB4FAaRR7IEXBag';

var geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [144.993523, -37.801265] as [number, number],
    },
    properties: {
      title: 'Common code',
      description: '8 Studly St, Abottsford'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [144.988180, -37.805749] as [number, number],
    },
    properties: {
      title: 'Mapbox',
      description: 'San Francisco, California'
    }
  }]
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
  zoom: 12,
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

    this.map.on('load', () => {
      if (!this.map) return;
       geojson.features.forEach((marker) => {
         if (!this.map) return;
         const el = document.createElement('div');
         el.className = 'marker';

         const popup = new mapboxgl.Popup({ offset: 8 })
           .setHTML(`<h3>${marker.properties.title}</h3><p>${marker.properties.description}</p>`);

         new mapboxgl.Marker(el)
           .setLngLat(marker.geometry.coordinates)
           .setPopup(popup)
           .addTo(this.map);
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

