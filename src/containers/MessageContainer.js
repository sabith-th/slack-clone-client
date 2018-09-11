import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Comment, Header } from 'semantic-ui-react';
import Messages from '../components/Messages';

const message = ({ id, text, user: { username } }, createdAt) => (
  <Comment key={`message-${id}`}>
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

const MessageContainer = ({ data: { loading, messages } }) => {
  if (loading) {
    return null;
  }
  return (
    <Messages>
      <Comment.Group>
        <Header as="h3" dividing>
          Messages
        </Header>
        {messages.map((msg) => {
          const createdAt = new Date(parseInt(msg.created_at, 10));
          return message(msg, createdAt);
        })}
      </Comment.Group>
    </Messages>
  );
};

const messagesQuery = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      text
      user {
        id
        username
      }
      id
      created_at
    }
  }
`;

export default graphql(messagesQuery, {
  variables: props => ({
    channelId: props.channelId,
  }),
})(MessageContainer);
