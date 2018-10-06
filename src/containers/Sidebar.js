import React from 'react';
import AddChannelModal from '../components/AddChannelModal';
import Channels from '../components/Channels';
import DirectMessageModal from '../components/DirectMessageModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import Teams from '../components/Teams';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddChannelModal: false,
      openInvitePeopleModal: false,
      openDirectMessageModal: false,
    };
    this.toggleAddChannelModal = this.toggleAddChannelModal.bind(this);
    this.toggleInvitePeopleModal = this.toggleInvitePeopleModal.bind(this);
    this.toggleDirectMessageModal = this.toggleDirectMessageModal.bind(this);
  }

  toggleAddChannelModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openAddChannelModal: !state.openAddChannelModal }));
  };

  toggleInvitePeopleModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openInvitePeopleModal: !state.openInvitePeopleModal }));
  };

  toggleDirectMessageModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openDirectMessageModal: !state.openDirectMessageModal }));
  };

  render() {
    const {
      teams, team, username, currentUserId,
    } = this.props;
    const { openAddChannelModal, openInvitePeopleModal, openDirectMessageModal } = this.state;
    const regularChannels = [];
    const dmChannels = [];
    team.channels.forEach((ch) => {
      if (ch.dm) {
        dmChannels.push(ch);
      } else {
        regularChannels.push(ch);
      }
    });

    return (
      <React.Fragment>
        <Teams key="team-sidebar" teams={teams} />
        <Channels
          key="channel-sidebar"
          teamName={team.name}
          userName={username}
          teamId={team.id}
          isOwner={team.admin}
          channels={regularChannels}
          dmChannels={dmChannels}
          onAddChannelClick={this.toggleAddChannelModal}
          onInvitePeopleClick={this.toggleInvitePeopleModal}
          onDirectMessageClick={this.toggleDirectMessageModal}
        />
        <AddChannelModal
          teamId={team.id}
          open={openAddChannelModal}
          key="sidebar-add-channel-modal"
          onClose={this.toggleAddChannelModal}
          currentUserId={currentUserId}
        />
        <InvitePeopleModal
          teamId={team.id}
          open={openInvitePeopleModal}
          key="sidebar-invite-people-modal"
          onClose={this.toggleInvitePeopleModal}
        />
        <DirectMessageModal
          teamId={team.id}
          open={openDirectMessageModal}
          key="sidebar-direct-message-modal"
          onClose={this.toggleDirectMessageModal}
          currentUserId={currentUserId}
        />
      </React.Fragment>
    );
  }
}
