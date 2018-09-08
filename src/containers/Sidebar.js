import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';
import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';
import { allTeamsQuery } from '../graphql/team';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddChannelModal: false,
    };
    this.handleAddChannelClick = this.handleAddChannelClick.bind(this);
    this.handleCloseAddChannelModal = this.handleCloseAddChannelModal.bind(this);
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

  render() {
    const {
      data: { loading, allTeams },
      currentTeamId,
    } = this.props;
    if (loading) {
      return null;
    }

    const { openAddChannelModal } = this.state;

    const teamIndex = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
    const team = allTeams[teamIndex];
    let username = '';
    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      ({ username } = user);
    } catch (error) {} // eslint-disable-line

    return (
      <React.Fragment>
        <Teams
          key="team-sidebar"
          teams={allTeams.map(t => ({
            id: t.id,
            initial: t.name.charAt(0).toUpperCase(),
          }))}
        />
        <Channels
          key="channel-sidebar"
          teamName={team.name}
          userName={username}
          teamId={team.id}
          channels={team.channels}
          users={[{ id: 1, name: 'Scarlett' }, { id: 2, name: 'Ella' }]}
          onAddChannelClick={this.handleAddChannelClick}
        />
        <AddChannelModal
          teamId={team.id}
          open={openAddChannelModal}
          key="sidebar-add-channel-modal"
          onClose={this.handleCloseAddChannelModal}
        />
      </React.Fragment>
    );
  }
}

export default graphql(allTeamsQuery)(Sidebar);
