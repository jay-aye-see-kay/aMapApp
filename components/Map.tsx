import React from 'react';
import mapboxgl, { Map as TMap } from 'mapbox-gl'

import { BusinessListQueryComponent, BusinessListQueryQuery } from '../generated/graphql';

import { LoadingGuard } from './LoadingGuard';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFja2RlcnJ5cm9zZSIsImEiOiJjankybGNkNWQwcHVpM2JvOXdmNzNvc2FlIn0.ahjk12cEB4FAaRR7IEXBag';

const getLngLat = (long?: string, lat?: string): [number, number] => {
  return [ long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0 ];
}

const businessesToGeoJson = (businesses: BusinessListQueryQuery["businesses"]) => {
  return {
    type: 'FeatureCollection' as 'FeatureCollection',
    features: businesses.map(business => ({
      type: 'Feature' as 'Feature',
      geometry: {
        type: 'Point' as 'Point',
        coordinates: getLngLat(business.long, business.lat),
      },
      properties: {
        title: business.name,
        icon: 'triangle',
      }
    })),
  }
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

    // TMP
    (window as any).aMap = this.map;

    this.map.on('move', () => {
      if (!this.map) return;

      const { lng, lat } = this.map.getCenter();
      this.setState({
        lng: lng,
        lat: lat,
        zoom: this.map.getZoom()
      });
    });

    this.map.on('load', this.drawMarkers);
    this.map.on('click', 'places', (e) => {
      if (!this.map || !e.features) return;

      const coordinates = ((e.features[0].geometry as any).coordinates as any).slice();
      const title = (e.features[0].properties as any).title;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(title)
        .addTo(this.map);
    })
  }

  private drawMarkers = () => {
    if (!this.map) return;
    this.map.addSource('businesses', {
      type: 'geojson',
      data: businessesToGeoJson(this.props.data.businesses),
    });

    this.map.addLayer({
      id: 'places',
      type: 'symbol',
      source: 'businesses',
      layout: {
        "icon-image": "{icon}-15",
        "icon-allow-overlap": true,
      }
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

