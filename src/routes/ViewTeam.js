import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';

const ViewTeam = ({
  data: { loading, allTeams, guestTeams },
  match: {
    params: { teamId, channelId },
  },
}) => {
  if (loading) {
    return null;
  }

  const teams = [...allTeams, ...guestTeams];

  if (!teams.length) {
    return <Redirect to="/createTeam" />;
  }

  const teamIdInt = parseInt(teamId, 10);
  const teamIndex = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
  const team = teamIndex === -1 ? teams[0] : teams[teamIndex];
  const channelIdInt = parseInt(channelId, 10);
  const channelIndex = channelIdInt ? findIndex(team.channels, ['id', channelIdInt]) : 0;
  const channel = channelIndex === -1 ? team.channels[0] : team.channels[channelIndex];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          initial: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
      />
      {channel && <Header channelName={channel.name} />}
      {channel && (
        <Messages channelId={channel.id}>
          <ul className="message-list">
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </Messages>
      )}
      {channel && <SendMessage channelName={channel.name} />}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
