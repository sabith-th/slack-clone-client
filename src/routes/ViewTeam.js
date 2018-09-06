import React from 'react';
import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import Header from '../components/Header';
import Teams from '../components/Teams';
import SendMessage from '../components/SendMessage';

export default () => (
  <AppLayout>
    <Teams teams={[{ id: 1, initial: 'A' }, { id: 2, initial: 'B' }]} />
    <Channels
      teamName="Avengers"
      userName="Scarlett"
      channels={[{ id: 1, name: 'general' }, { id: 2, name: 'random' }]}
      users={[{ id: 1, name: 'Scarlett' }, { id: 2, name: 'Ella' }]}
    />
    <Header channelName="general" />
    <Messages>
      <ul className="message-list">
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </Messages>
    <SendMessage channelName="general" />
  </AppLayout>
);
