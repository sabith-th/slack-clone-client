import React from 'react';
import styled from 'styled-components';

const TeamsWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362234;
  color: #958993;
`;

const team = ({ id, initial }) => <li key={`team-${id}`}>{initial}</li>;

export default ({ teams }) => (
  <TeamsWrapper>
    <ul>
      <li>Teams</li>
      {teams.map(team)}
    </ul>
  </TeamsWrapper>
);
