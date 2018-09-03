import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Container, Input, Header, Button } from 'semantic-ui-react';

export default observer(class Login extends Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
    });
  }

  onSubmit = () => {
    const { email, password } = this;
    console.log(email);
    console.log(password);
  }

  onChange = e => {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const { email, password } = this;
    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Input fluid placeholder="Email" value={email} onChange={this.onChange} name="email" />
        <Input fluid placeholder="Password" type="password" value={password} onChange={this.onChange} name="password" />
        <Button onClick={this.onSubmit}>Submit</Button>
      </Container>
    )
  }

});