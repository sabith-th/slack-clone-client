import React from 'react';
import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({ match: { params } }) => (
  <AppLayout>
    <Sidebar currentTeamId={params.teamId} />
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

export default ViewTeam;
