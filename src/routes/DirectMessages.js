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
  data: { loading, me, getUser },
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
      <Header channelName={getUser.username} />
      <DirectMessageContainer teamId={team.id} otherUserId={otherUserId} />
      <SendMessage
        onSubmit={async (text) => {
          await mutate({
            variables: { text, receiverId: otherUserId, teamId: team.id },
            optimisticResponse: {
              createDirectMessage: true,
            },
            update: (store) => {
              const data = store.readQuery({ query: meQuery });
              const teamIndex2 = findIndex(data.me.teams, ['id', team.id]);
              const notAlreadyThere = data.me.teams[teamIndex2].directMessageMembers.every(
                member => member.id !== otherUserId,
              );
              if (notAlreadyThere) {
                data.me.teams[teamIndex2].directMessageMembers.push({
                  __typename: 'User',
                  id: otherUserId,
                  username: getUser.username,
                });
                store.writeQuery({ query: meQuery, data });
              }
            },
          });
        }}
        placeholder={getUser.username}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $teamId: Int!, $text: String!) {
    createDirectMessage(receiverId: $receiverId, teamId: $teamId, text: $text)
  }
`;

const directMessageMeQuery = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

export default compose(
  graphql(directMessageMeQuery, {
    options: props => ({
      variables: {
        userId: parseInt(props.match.params.userId, 10),
      },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(createDirectMessageMutation),
)(DirectMessages);
