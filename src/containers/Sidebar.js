import React from 'react';
import decode from 'jwt-decode';
import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddChannelModal: false,
      openInvitePeopleModal: false,
    };
    this.toggleAddChannelModal = this.toggleAddChannelModal.bind(this);
    this.toggleInvitePeopleModal = this.toggleInvitePeopleModal.bind(this);
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

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal, openInvitePeopleModal } = this.state;

    let username = '';
    let isOwner = false;
    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      ({ username } = user);
      isOwner = user.id === team.owner;
    } catch (error) {} // eslint-disable-line

    return (
      <React.Fragment>
        <Teams key="team-sidebar" teams={teams} />
        <Channels
          key="channel-sidebar"
          teamName={team.name}
          userName={username}
          teamId={team.id}
          isOwner={isOwner}
          channels={team.channels}
          users={[{ id: 1, name: 'Scarlett' }, { id: 2, name: 'Ella' }]}
          onAddChannelClick={this.toggleAddChannelModal}
          onInvitePeopleClick={this.toggleInvitePeopleModal}
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
      </React.Fragment>
    );
  }
}
