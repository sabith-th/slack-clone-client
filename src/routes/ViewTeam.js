import React from 'react';
import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';

export default () => (
  <AppLayout>
    <Sidebar currentTeamId={1} />
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
