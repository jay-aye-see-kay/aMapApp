import dynamic from 'next/dynamic';

import { App } from '../components/App'

// mapbox gl crashes server side -> can't even be imported
const DynamicMap = dynamic(() => import('../components/Map').then(mod => mod.Map as any), {
  ssr: false,
});

export default () => (
  <App>
    <DynamicMap />
  </App>
);

