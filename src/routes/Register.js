import React, { Component } from 'react';
import { Container, Input, Header, Button } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {
  state = {
    username: '',
    password: '',
    email: ''
  }

  onSubmit = async () => {
    const response = await this.props.mutate({
      variables: this.state,
    });
    console.log(response);
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    const {username, email, password } = this.state;
    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Input fluid placeholder="Username" value={username} onChange={this.onChange} name="username" /> 
        <Input fluid placeholder="Email" value={email} onChange={this.onChange} name="email" />
        <Input fluid placeholder="Password" type="password" value={password} onChange={this.onChange} name="password" />
        <Button onClick={this.onSubmit}>Submit</Button>
      </Container>
    )
  }
}

const registerMutation = gql`
mutation($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password)
}
`;

export default graphql(registerMutation)(Register);