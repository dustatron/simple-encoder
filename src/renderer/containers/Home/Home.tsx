import React from 'react';
import {
  Container,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import Settings from '../../components/Settings';
import GetFiles from '../../components/GetFiles';

type API = any;
declare global {
  interface Window {
    electron: API;
  }
}

const Home = () => {
  return (
    <Container maxW="container.xl" padding="4">
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Batch Convert</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <GetFiles />
          </TabPanel>
          <TabPanel>
            <Settings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Home;
