import React from 'react';
import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import DirectMessageModal from '../components/DirectMessageModal';

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
    const { teams, team, username } = this.props;
    const { openAddChannelModal, openInvitePeopleModal, openDirectMessageModal } = this.state;

    return (
      <React.Fragment>
        <Teams key="team-sidebar" teams={teams} />
        <Channels
          key="channel-sidebar"
          teamName={team.name}
          userName={username}
          teamId={team.id}
          isOwner={team.admin}
          channels={team.channels}
          users={[{ id: 1, name: 'Scarlett' }, { id: 2, name: 'Ella' }]}
          onAddChannelClick={this.toggleAddChannelModal}
          onInvitePeopleClick={this.toggleInvitePeopleModal}
          onDirectMessageClick={this.toggleDirectMessageModal}
        />
        <AddChannelModal
          teamId={team.id}
          open={openAddChannelModal}
          key="sidebar-add-channel-modal"
          onClose={this.toggleAddChannelModal}
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
        />
      </React.Fragment>
    );
  }
}
