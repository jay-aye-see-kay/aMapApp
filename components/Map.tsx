import React from 'react';
import mapboxgl, { Map as TMap } from 'mapbox-gl'

import { BusinessListQueryComponent, BusinessListQueryQuery } from '../generated/graphql';

import { LoadingGuard } from './LoadingGuard';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFja2RlcnJ5cm9zZSIsImEiOiJjankybGNkNWQwcHVpM2JvOXdmNzNvc2FlIn0.ahjk12cEB4FAaRR7IEXBag';

const getLngLat = (long?: string, lat?: string): [number, number] => {
  return [ long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0 ];
}

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
      this.props.data.businesses.forEach(business => {
         if (!this.map) return;
         const popup = new mapboxgl.Popup({ offset: 8 })
            .setHTML(`<h4>${business.name}</h4><p>Number of reviews: ${business.reviews.length}</p>`);

         const el = document.createElement('div');
         el.className = 'marker';
         new mapboxgl.Marker(el)
           .setLngLat(getLngLat(business.long, business.lat))
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

