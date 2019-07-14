import dynamic from 'next/dynamic';

import { App } from '../components/App'
import { Header } from '../components/Header'

// mapbox gl crashes server side -> can't even be imported
const DynamicMap = dynamic(() => import('../components/Map').then(mod => mod.Map as any), {
  ssr: false,
});

export default () => (
  <App>
    <Header />
    <DynamicMap />
  </App>
);

