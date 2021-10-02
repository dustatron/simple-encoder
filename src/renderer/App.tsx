import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import AlertMessage from './components/AlertMessage';
import { SettingsProvider } from './context/SettingsContext';
import Home from './containers/Home';

declare global {
  interface Window {
    api: any;
  }
}

export default function App() {
  return (
    <Router>
      <ChakraProvider>
        <SettingsProvider>
          <AlertMessage />
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
        </SettingsProvider>
      </ChakraProvider>
    </Router>
  );
}
