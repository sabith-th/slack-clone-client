import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Comment, Header } from 'semantic-ui-react';
import Messages from '../components/Messages';

const message = ({ id, text, sender: { username } }, createdAt) => (
  <Comment key={`direct-message-${id}`}>
    <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
    <Comment.Content>
      <Comment.Author as="a">{username}</Comment.Author>
      <Comment.Metadata>
        <div>{createdAt.toString()}</div>
      </Comment.Metadata>
      <Comment.Text>{text}</Comment.Text>
      <Comment.Actions>
        <Comment.Action>Reply</Comment.Action>
      </Comment.Actions>
    </Comment.Content>
  </Comment>
);

const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $otherUserId: Int!) {
    newDirectMessage(teamId: $teamId, otherUserId: $otherUserId) {
      text
      sender {
        username
      }
      id
      created_at
    }
  }
`;

class DirectMessageContainer extends React.Component {
  componentWillMount() {
    const { teamId, otherUserId } = this.props;
    this.unsubscribe = this.subscribe(teamId, otherUserId);
  }

  componentWillReceiveProps({ teamId, otherUserId }) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.teamId !== teamId || this.props.otherUserId !== otherUserId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(teamId, otherUserId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (teamId, otherUserId) => {
    const { data } = this.props;
    return data.subscribeToMore({
      document: newDirectMessageSubscription,
      variables: {
        teamId,
        otherUserId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        return {
          ...prev,
          directMessages: [...prev.directMessages, subscriptionData.data.newDirectMessage],
        };
      },
    });
  };

  render() {
    const {
      data: { loading, directMessages },
    } = this.props;
    return loading ? null : (
      <Messages>
        <Comment.Group>
          <Header as="h3" dividing>
            Messages
          </Header>
          {directMessages.map((msg) => {
            const createdAt = new Date(parseInt(msg.created_at, 10));
            return message(msg, createdAt);
          })}
        </Comment.Group>
      </Messages>
    );
  }
}

const directMessagesQuery = gql`
  query($teamId: Int!, $otherUserId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $otherUserId) {
      id
      text
      sender {
        username
      }
      created_at
    }
  }
`;

export default graphql(directMessagesQuery, {
  options: props => ({
    variables: {
      teamId: props.teamId,
      otherUserId: props.otherUserId,
    },
    fetchPolicy: 'network-only',
  }),
})(DirectMessageContainer);
