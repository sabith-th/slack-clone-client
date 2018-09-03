import React, { Component } from 'react';
import { Container, Input, Header, Button, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {
  state = {
    username: '',
    usernameError: '',
    password: '',
    passwordError: '',
    email: '',
    emailError: '',
  }

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      passwordError: '',
      emailError: '',
    });
    const { username, password, email } = this.state;
    const response = await this.props.mutate({
      variables: { username, password, email },
    });
    const { ok, errors } = response.data.register;
    if (ok) {
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.setState(err);
    }
    console.log(response);
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const { username, email, password, usernameError, emailError, passwordError } = this.state;
    const errorList = [];
    if (usernameError) errorList.push(usernameError);
    if (emailError) errorList.push(emailError);
    if (passwordError) errorList.push(passwordError);
    
    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Input fluid placeholder="Username" value={username} onChange={this.onChange} name="username" error={!!usernameError} />
        <Input fluid placeholder="Email" value={email} onChange={this.onChange} name="email" error={!!emailError} />
        <Input fluid placeholder="Password" type="password" value={password} onChange={this.onChange} name="password" error={!!passwordError} />
        <Button onClick={this.onSubmit}>Submit</Button>
        {errorList.length > 0 ? 
          (
            <Message 
            error 
            header="There were some errors in your submission"
            list={errorList}
          />
          ) : null
        }
        
      </Container>
    )
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