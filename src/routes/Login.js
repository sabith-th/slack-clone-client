import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Container, Input, Header, Button,
} from 'semantic-ui-react';

class Login extends Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
    });
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {
    const { email, password } = this;
    const { mutate } = this.props;
    const response = await mutate({
      variables: { email, password },
    });
    const { ok, token, refreshToken } = response.data.login;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  onChange(e) {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const { email, password } = this;
    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Input fluid placeholder="Email" value={email} onChange={this.onChange} name="email" />
        <Input fluid placeholder="Password" type="password" value={password} onChange={this.onChange} name="password" />
        <Button onClick={this.onSubmit}>Submit</Button>
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
