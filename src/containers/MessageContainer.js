import gql from 'graphql-tag';
import React from 'react';
import { graphql } from 'react-apollo';
import { Comment, Header } from 'semantic-ui-react';
import FileUpload from '../components/FileUpload';
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

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
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

class MessageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMoreItems: true,
    };
  }

  componentWillMount() {
    const { channelId } = this.props;
    this.unsubscribe = this.subscribe(channelId);
  }

  componentWillReceiveProps({ data: { messages }, channelId }) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
    const {
      data: { messages: oldMessages },
    } = this.props;
    if (
      this.scroller
      && this.scroller.scrollTop < 100
      && oldMessages
      && messages
      && oldMessages.length !== messages.length
    ) {
      const heightBeforeRender = this.scroller.scrollHeight;
      setTimeout(() => {
        this.scroller.scrollTop = this.scroller.scrollHeight - heightBeforeRender;
      }, 120);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (channelId) => {
    const { data } = this.props;
    return data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        return {
          ...prev,
          messages: [subscriptionData.data.newChannelMessage, ...prev.messages],
        };
      },
    });
  };

  handleScroll = () => {
    const {
      data: { messages, fetchMore },
      channelId,
    } = this.props;
    const { hasMoreItems } = this.state;
    if (this.scroller && this.scroller.scrollTop < 100 && hasMoreItems && messages.length >= 35) {
      fetchMore({
        variables: {
          channelId,
          cursor: messages[messages.length - 1].created_at,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          if (fetchMoreResult.messages.length < 35) {
            this.setState({ hasMoreItems: false });
          }
          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages],
          };
        },
      });
    }
  };

  render() {
    const {
      data: { loading, messages },
    } = this.props;
    return loading ? null : (
      <Messages>
        <div
          style={{
            gridColumn: 3,
            gridRow: 2,
            paddingLeft: '20px',
            paddingRight: '20px',
            display: 'flex',
            flexDirection: 'column-reverse',
            overflowY: 'auto',
          }}
          onScroll={this.handleScroll}
          ref={(scroller) => {
            this.scroller = scroller;
          }}
        >
          <FileUpload
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
            disableClick
          >
            <Comment.Group>
              <Header as="h3" dividing>
                Messages
              </Header>
              {[...messages].reverse().map((msg) => {
                const createdAt = new Date(parseInt(msg.created_at, 10));
                return message(msg, createdAt);
              })}
            </Comment.Group>
          </FileUpload>
        </div>
      </Messages>
    );
  }
}

const messagesQuery = gql`
  query($channelId: Int!, $cursor: String) {
    messages(channelId: $channelId, cursor: $cursor) {
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
  options: props => ({
    variables: {
      channelId: props.channelId,
    },
    fetchPolicy: 'network-only',
  }),
})(MessageContainer);
