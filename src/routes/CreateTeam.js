import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import {
  Container, Header, Form, Input, Button, Message,
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { observer } from 'mobx-react';

class CreateTeam extends Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      name: '',
      errors: {},
    });
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {
    const { name } = this;
    const { mutate, history } = this.props;
    let response = null;

    try {
      response = await mutate({
        variables: { name },
      });
    } catch (err) {
      history.push('/login');
      return;
    }

    const { ok, errors } = response.data.createTeam;

    if (ok) {
      history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.errors = err;
    }
  }

  onChange(e) {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const {
      name,
      errors: { nameError },
    } = this;
    const errorList = [];
    if (nameError) errorList.push(nameError);

    return (
      <Container text>
        <Header as="h2">Create Team</Header>
        <Form>
          <Form.Field error={!!nameError}>
            <Input
              fluid
              placeholder="Team Name"
              value={name}
              onChange={this.onChange}
              name="name"
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
        {errorList.length > 0 && <Message error header="Error in form" list={errorList} />}
      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
