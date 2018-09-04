import React, { Component } from 'react';
import {
  Container, Input, Header, Button, Message, Form,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      email: '',
      emailError: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {
    this.setState({
      usernameError: '',
      passwordError: '',
      emailError: '',
    });
    const { username, password, email } = this.state;
    const { mutate, history } = this.props;
    const response = await mutate({
      variables: { username, password, email },
    });
    const { ok, errors } = response.data.register;
    if (ok) {
      history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.setState(err);
    }
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const {
      username, email, password, usernameError, emailError, passwordError,
    } = this.state;
    const errorList = [];
    if (usernameError) errorList.push(usernameError);
    if (emailError) errorList.push(emailError);
    if (passwordError) errorList.push(passwordError);

    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Form>
          <Form.Field error={!!usernameError}>
            <Input fluid placeholder="Username" value={username} onChange={this.onChange} name="username" />
          </Form.Field>
          <Form.Field error={!!emailError}>
            <Input fluid placeholder="Email" value={email} onChange={this.onChange} name="email" />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input fluid placeholder="Password" type="password" value={password} onChange={this.onChange} name="password" />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
        {errorList.length > 0
          && <Message error header="There were some errors in your submission" list={errorList} />
        }
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message 
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
