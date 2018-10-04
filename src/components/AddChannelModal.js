import React from 'react';
import {
  Modal, Input, Button, Form, Checkbox,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { meQuery } from '../graphql/team';
import MultiSelectUser from './MultiSelectUser';

const ENTER_KEY = 13;

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
  teamId,
}) => (
  <Modal
    open={open}
    onClose={(e) => {
      resetForm();
      onClose(e);
    }}
  >
    <Modal.Header>Create a new Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            fluid
            placeholder="Channel Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.keyCode === ENTER_KEY && !isSubmitting) {
                handleSubmit(e);
              }
            }}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Private"
            value={!values.public}
            toggle
            onChange={(e, { checked }) => setFieldValue('public', !checked)}
          />
        </Form.Field>
        {values.public ? null : (
          <Form.Field>
            <MultiSelectUser
              value={values.members}
              handleChange={(e, { value }) => setFieldValue('members', value)}
              teamId={teamId}
              placeholder="Select members to invite"
            />
          </Form.Field>
        )}
        <Form.Group widths="equal">
          <Button
            fluid
            disabled={isSubmitting}
            onClick={(e) => {
              resetForm();
              onClose(e);
            }}
          >
            Cancel
          </Button>
          <Button fluid disabled={isSubmitting} onClick={handleSubmit} type="submit">
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '', public: true, members: [] }),
    handleSubmit: async (
      values,
      { props: { teamId, mutate, onClose }, setSubmitting, resetForm },
    ) => {
      await mutate({
        variables: {
          teamId, name: values.name, public: values.public, members: values.members,
        },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name,
            },
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }
          const data = store.readQuery({ query: meQuery });
          const teamIndex = findIndex(data.me.teams, ['id', teamId]);
          data.me.teams[teamIndex].channels.push(channel);
          store.writeQuery({ query: meQuery, data });
        },
      });
      onClose();
      setSubmitting(false);
      resetForm();
    },
  }),
)(AddChannelModal);
