import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const paddingLeft = 'padding-left: 10px';

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const SideBarListHeader = styled.li`
  ${paddingLeft};
`;

const PushLeft = styled.div`
  ${paddingLeft};
`;

const Green = styled.span`
  color: #38978d;
`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const channel = ({ id, name }, teamId) => (
  <Link to={`/viewTeam/${teamId}/${id}`} key={`channel-${id}`}>
    <SideBarListItem>{`# ${name}`}</SideBarListItem>
  </Link>
);
const dmChannel = ({ id, name }, teamId) => (
  <Link to={`/viewTeam/user/${teamId}/${id}`} key={`user-${id}`}>
    <SideBarListItem>
      <Bubble />
      {' '}
      {name}
    </SideBarListItem>
  </Link>
);

export default ({
  teamName,
  userName,
  channels,
  dmChannels,
  onAddChannelClick,
  teamId,
  isOwner,
  onInvitePeopleClick,
  onDirectMessageClick,
}) => (
  <ChannelWrapper>
    <PushLeft>
      <TeamNameHeader>{teamName}</TeamNameHeader>
      {userName}
    </PushLeft>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Channels
          {' '}
          {isOwner && <Icon name="add circle" onClick={onAddChannelClick} />}
        </SideBarListHeader>
        {channels.map(ch => channel(ch, teamId))}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Direct Messages
          <Icon name="add circle" onClick={onDirectMessageClick} />
        </SideBarListHeader>
        {dmChannels.map(dmC => dmChannel(dmC, teamId))}
      </SideBarList>
    </div>
    {isOwner && (
      <div>
        <a href="#invite-people" onClick={onInvitePeopleClick}>
          + Invite People
        </a>
      </div>
    )}
  </ChannelWrapper>
);
