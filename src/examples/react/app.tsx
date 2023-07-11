import React from 'react';
import ReactDOM from 'react-dom/client';
import { ComponentUsingKrayon } from './component-using-krayon';
import { KrayonWithAuth0SDKProvider } from 'sdk/flavors/react/auth0-sdk-provider';
import { krayonSDK } from '../vanilla/instance';
import { Auth0Provider } from '@auth0/auth0-react';

// TODO: Enter your client information
const auth0Config = {
  domain: 'YOUR_AUTH0_DOMAIN',
  clientId: 'Your_Auth0_Client_ID',
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    
    {/* Here goes any stuff you might not need Krayon for */}
    {/* Please note you can't use Krayon hooks outside of the provider below */}
    {/* Depending on your use case, you might want to use Krayon provider only within the 
    routes that require Krayo nor simply wrap the whole app in it. */}

    {/* Krayon SDK (currently) depends on Auth0, so we must use its provider on the level above krayon */}
    <Auth0Provider {...auth0Config}>
      {/* Initialize the Krayon Provider with the SDK instance */}
      <KrayonWithAuth0SDKProvider krayonSdkInstance={krayonSDK}>
          {/* Here goes any stuff you need Krayon for */}
          {/* The below is just showcasing a super simple component using Krayon */}
          <ComponentUsingKrayon />
      </KrayonWithAuth0SDKProvider>
    </Auth0Provider>
  </React.StrictMode>
);
