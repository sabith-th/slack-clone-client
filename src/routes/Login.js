import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Container, Input, Header, Button, Form, Message,
} from 'semantic-ui-react';

class Login extends Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    });
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {
    const { email, password } = this;
    const { mutate, history } = this.props;
    const response = await mutate({
      variables: { email, password },
    });

    const {
      ok, token, refreshToken, errors,
    } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      history.push('/viewTeam');
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
      email,
      password,
      errors: { emailError, passwordError },
    } = this;
    const errorList = [];
    if (emailError) errorList.push(emailError);
    if (passwordError) errorList.push(passwordError);
    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Form>
          <Form.Field error={!!emailError}>
            <Input fluid placeholder="Email" value={email} onChange={this.onChange} name="email" />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input
              fluid
              placeholder="Password"
              type="password"
              value={password}
              onChange={this.onChange}
              name="password"
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
        {errorList.length > 0 && (
          <Message error header="There were some errors in your submission" list={errorList} />
        )}
      </Container>
    );
  }
}

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginMutation)(observer(Login));
