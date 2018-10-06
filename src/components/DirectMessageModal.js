import { withFormik } from 'formik';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Button, Form, Modal } from 'semantic-ui-react';
import { meQuery } from '../graphql/team';
import MultiSelectUser from './MultiSelectUser';

const DirectMessageModal = ({
  open,
  onClose,
  teamId,
  currentUserId,
  values,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Direct Messages</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <MultiSelectUser
            value={values.members}
            handleChange={(e, { value }) => setFieldValue('members', value)}
            teamId={teamId}
            placeholder="Select members to message"
            currentUserId={currentUserId}
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Button
            disabled={isSubmitting}
            fluid
            onClick={(e) => {
              resetForm();
              onClose(e);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} fluid onClick={handleSubmit} type="submit">
            Start Messaging
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const getOrCreateDMChannelMutation = gql`
  mutation($teamId: Int!, $members: [Int!]) {
    getOrCreateDMChannel(teamId: $teamId, members: $members) {
      id
      name
    }
  }
`;

export default compose(
  withRouter,
  graphql(getOrCreateDMChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ members: [] }),
    handleSubmit: async ({ members }, { props: { teamId, mutate, onClose }, resetForm }) => {
      await mutate({
        variables: { members, teamId },
        update: (store, { data: { getOrCreateDMChannel } }) => {
          const { id, name } = getOrCreateDMChannel;
          const data = store.readQuery({ query: meQuery });
          const teamIndex = findIndex(data.me.teams, ['id', teamId]);
          const notInChannelList = data.me.teams[teamIndex].channels.every(ch => ch.id !== id);
          if (notInChannelList) {
            data.me.teams[teamIndex].channels.push({
              __typename: 'Channel',
              id,
              name,
              dm: true,
            });
            store.writeQuery({ query: meQuery, data });
          }
        },
      });
      onClose();
      resetForm();
    },
  }),
)(DirectMessageModal);
