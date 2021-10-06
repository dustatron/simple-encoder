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
    <>
      <Tabs isFitted variant="enclosed" padding="2">
        <TabList mb="1em">
          <Tab>Batch Convert</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels padding="0">
          <TabPanel padding="0">
            <GetFiles />
          </TabPanel>
          <TabPanel>
            <Settings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Home;
