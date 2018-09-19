import React from 'react';
import { graphql, compose } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { meQuery } from '../graphql/team';
import DirectMessageContainer from '../containers/DirectMessageContainer';

const DirectMessages = ({
  mutate,
  data: { loading, me },
  match: {
    params: { teamId, userId },
  },
}) => {
  if (loading) {
    return null;
  }

  const { teams, username } = me;

  if (!teams.length) {
    return <Redirect to="/createTeam" />;
  }

  const teamIdInt = parseInt(teamId, 10);
  const teamIndex = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
  const team = teamIndex === -1 ? teams[0] : teams[teamIndex];
  const otherUserId = parseInt(userId, 10);

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          initial: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        username={username}
      />
      <Header channelName="Username" />
      <DirectMessageContainer teamId={team.id} otherUserId={otherUserId} />
      <SendMessage
        onSubmit={async (text) => {
          await mutate({ variables: { text, receiverId: otherUserId, teamId: team.id } });
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $teamId: Int!, $text: String!) {
    createDirectMessage(receiverId: $receiverId, teamId: $teamId, text: $text)
  }
`;

export default compose(
  graphql(meQuery, {
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(createDirectMessageMutation),
)(DirectMessages);
