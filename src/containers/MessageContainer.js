import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Messages from '../components/Messages';

const message = ({ id, text }) => <li key={id}>{text}</li>;

const MessageContainer = ({ data: { loading, messages } }) => {
  if (loading) {
    return null;
  }
  return (
    <Messages>
      <ul className="message-list">{messages.map(msg => message(msg))}</ul>
    </Messages>
  );
};

const messagesQuery = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      text
      userId
      channelId
      id
    }
  }
`;

export default graphql(messagesQuery, {
  variables: props => ({
    channelId: props.channelId,
  }),
})(MessageContainer);
