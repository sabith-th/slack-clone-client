import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import MessageContainer from '../containers/MessageContainer';
import Sidebar from '../containers/Sidebar';
import { meQuery } from '../graphql/team';

const ViewTeam = ({
  mutate,
  data: { loading, me },
  match: {
    params: { teamId, channelId },
  },
}) => {
  if (loading || !me) {
    return null;
  }

  const { id: currentUserId, teams, username } = me;

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
        username={username}
        currentUserId={currentUserId}
      />
      {channel && <Header channelName={channel.name} />}
      {channel && <MessageContainer channelId={channel.id} />}
      {channel && (
        <SendMessage
          placeholder={channel.name}
          onSubmit={async (text) => {
            await mutate({ variables: { text, channelId: channel.id } });
          }}
        />
      )}
    </AppLayout>
  );
};

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(meQuery, {
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(createMessageMutation),
)(ViewTeam);
