import React from 'react';
import FlagProvider from '@unleash/proxy-client-react';
import App from '../App';

const config = {
  url: `http://localhost:8080/api/featureflags/v0`,
  clientKey: 'proxy-123',
  appName: 'web',
  headerName: 'X-Unleash-Auth',
  refreshInterval: 60000,
  metricsInterval: 120000,
};

const SatelliteEntry = () => {
  return (
    <FlagProvider config={config}>
      <App />
    </FlagProvider>
  );
};

export default SatelliteEntry;
