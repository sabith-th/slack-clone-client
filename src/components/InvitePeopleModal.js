import React from 'react';
import {
  Modal, Input, Button, Form,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import normalizeErrors from '../normalizeErrors';

const InvitePeopleModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  errors,
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Invite User to Team</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            fluid
            placeholder="User's Email ID"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Field>
        {touched.email && errors.email ? errors.email[0] : null}
        <Form.Group widths="equal">
          <Button fluid disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          <Button fluid disabled={isSubmitting} onClick={handleSubmit} type="submit">
            Invite User
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values,
      {
        props: { teamId, mutate, onClose }, setSubmitting, resetForm, setErrors,
      },
    ) => {
      const response = await mutate({
        variables: { teamId, email: values.email },
      });
      const { ok, errors } = response.data.addTeamMember;
      if (ok) {
        onClose();
        setSubmitting(false);
        resetForm();
      } else {
        setSubmitting(false);
        setErrors(normalizeErrors(errors));
      }
    },
  }),
)(InvitePeopleModal);
