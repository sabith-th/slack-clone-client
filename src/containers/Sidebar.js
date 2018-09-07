import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';
import Teams from '../components/Teams';
import Channels from '../components/Channels';

const Sidebar = ({ data: { loading, allTeams }, currentTeamId }) => {
  if (loading) {
    return null;
  }

  const teamIndex = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
  const team = allTeams[teamIndex];
  let username = '';
  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    ({ username } = user);
  } catch (error) {} // eslint-disable-line

  return [
    <Teams
      key="team-sidebar"
      teams={allTeams.map(t => ({
        id: t.id,
        initial: t.name.charAt(0).toUpperCase(),
      }))}
    />,
    <Channels
      key="channel-sidebar"
      teamName={team.name}
      userName={username}
      channels={team.channels}
      users={[{ id: 1, name: 'Scarlett' }, { id: 2, name: 'Ella' }]}
    />,
  ];
};

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(Sidebar);
