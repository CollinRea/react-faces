import React from 'react';

class Register extends React.Component {
  state = {
    signInName: '',
    signInEmail: '',
    signInPassword: ''
  };
  onNamechange = (event) => {
    this.setState({signInName: event.target.value});
  }

  onEmailchange = (event) => {
    this.setState({signInEmail: event.target.value});
  }

  onPasswordchange = (event) => {
    this.setState({signInPassword: event.target.value});
  }

  onSubmitRegister = () => {
    fetch('http://localhost:3001/register', {
      method: 'post',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.signInName,
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(user => {
        this.props.loadUser(user);
        this.props.onRouteChange('home');
      })
      .catch(err => {
        console.log(err);
        this.props.onRouteChange('register');
      })
  }
  render() {
    return (
      <article 
        style={{backgroundColor: 'white'}}
        className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input 
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  onChange={this.onNamechange}
                  type="text" 
                  name="name"  
                  id="name" />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input 
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  onChange={this.onEmailchange}
                  type="email" 
                  name="email-address"  
                  id="email-address" />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input 
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  onChange={this.onPasswordchange}
                  type="password" 
                  name="password"  
                  id="password" />
              </div>
            </fieldset>
            <div className="">
              <input 
                onClick={this.onSubmitRegister}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                type="submit"
                value="Register" />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;