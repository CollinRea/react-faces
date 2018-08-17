import React, { Component } from 'react';
import Clarifai from 'clarifai';

import Navigation from './Components/Navigation';
import Logo from './Components/Logo';
import ImageLinkForm from './Components/ImageLinkForm';
import Rank from './Components/Rank';
import FaceRecognition from './Components/FaceRecognition';
import Signin from './Components/Signin';
import Register from './Components/Register';


import './App.css';
import 'tachyons';

const app = new Clarifai.App({
  apiKey: '4b330f174a4949fd8b8ac921be767fe0'
 });

class App extends Component {
  state = {
    input: '',
    imageUrl: '',
    box: [],
    route: 'signin',
    isSignedIn: false
  };

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
    app.models.predict(
      "a403429f2ddf4b49b307e318f00e528b", 
      this.state.input)
    .then(response => this.calculateFaceLocation(response))
    .then(box => this.displayFaceBox(box))
    .catch(err => console.log({err}));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route});
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
              <Rank />
              <ImageLinkForm  
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition
                boxData={box}
                imageUrl={imageUrl}/> 
            </div>
          : (
            route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange} />
          ) 
        }  
      </div>
    );
  }
}

export default App;

