import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './components/Home';

const Hello = () => {
  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
