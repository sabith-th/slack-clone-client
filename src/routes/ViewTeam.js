import React from 'react';
import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import Header from '../components/Header';
import Teams from '../components/Teams';
import Input from '../components/Input';

export default () => (
  <AppLayout>
    <Teams>Teams</Teams>
    <Channels>Channels</Channels>
    <Header>Header</Header>
    <Messages>
      <ul className="message-list">
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </Messages>
    <Input>
      <input type="text" placeholder="Send a message" />
    </Input>
  </AppLayout>
);
