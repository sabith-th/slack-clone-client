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
    this.handleAddChannelClick = this.handleAddChannelClick.bind(this);
    this.handleCloseAddChannelModal = this.handleCloseAddChannelModal.bind(this);
    this.handleInvitePeopleClick = this.handleInvitePeopleClick.bind(this);
    this.handleCloseInvitePeopleModal = this.handleCloseInvitePeopleModal.bind(this);
  }

  handleAddChannelClick = () => {
    this.setState({
      openAddChannelModal: true,
    });
  };

  handleCloseAddChannelModal = () => {
    this.setState({
      openAddChannelModal: false,
    });
  };

  handleInvitePeopleClick = () => {
    this.setState({
      openInvitePeopleModal: true,
    });
  };

  handleCloseInvitePeopleModal = () => {
    this.setState({
      openInvitePeopleModal: false,
    });
  };

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal, openInvitePeopleModal } = this.state;

    let username = '';
    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      ({ username } = user);
    } catch (error) {} // eslint-disable-line

    return (
      <React.Fragment>
        <Teams key="team-sidebar" teams={teams} />
        <Channels
          key="channel-sidebar"
          teamName={team.name}
          userName={username}
          teamId={team.id}
          channels={team.channels}
          users={[{ id: 1, name: 'Scarlett' }, { id: 2, name: 'Ella' }]}
          onAddChannelClick={this.handleAddChannelClick}
          onInvitePeopleClick={this.handleInvitePeopleClick}
        />
        <AddChannelModal
          teamId={team.id}
          open={openAddChannelModal}
          key="sidebar-add-channel-modal"
          onClose={this.handleCloseAddChannelModal}
        />
        <InvitePeopleModal
          teamId={team.id}
          open={openInvitePeopleModal}
          key="sidebar-invite-people-modal"
          onClose={this.handleCloseInvitePeopleModal}
        />
      </React.Fragment>
    );
  }
}
