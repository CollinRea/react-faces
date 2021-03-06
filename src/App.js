import React, { Component } from 'react';

import Navigation from './Components/Navigation';
import Logo from './Components/Logo';
import ImageLinkForm from './Components/ImageLinkForm';
import Rank from './Components/Rank';
import FaceRecognition from './Components/FaceRecognition';
import Signin from './Components/Signin';
import Register from './Components/Register';

import './App.css';
import 'tachyons';

const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  state = initialState;

  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    const box_data = data.outputs[0].data.regions.map(region => {
      let face = region.region_info.bounding_box;
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }
    });
    return box_data
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value
    });
  }

  onButtonSubmit = () => {
    this.setState({
      imageUrl: this.state.input
    });
    fetch('https://afternoon-hamlet-83818.herokuapp.com/imageurl', {
      method: 'post',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://afternoon-hamlet-83818.herokuapp.com/image', {
          method: 'put',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.state.user.id
          })
        }).then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
      }
      return this.calculateFaceLocation(response)
    })
    .then(box => this.displayFaceBox(box))
    .catch(err => console.log({err}));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route});
  }

  loadUser = (userData) => {
    this.setState({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        entries: userData.entries,
        joined: userData.joined
      }
    });
  }

  render() {
    const { isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Navigation 
          isSignedIn={isSignedIn} 
          onRouteChange={this.onRouteChange}/>
        {
          route === 'home'
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}/>
              <ImageLinkForm  
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition
                boxData={box}
                imageUrl={imageUrl}/> 
            </div>
          : (
            route === 'signin'
            ? <Signin 
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}/>
            : <Register 
              onRouteChange={this.onRouteChange}
              loadUser={this.loadUser}/>
          ) 
        }  
      </div>
    );
  }
}

export default App;

