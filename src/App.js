
import React, {Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '7c13ebb595e044c9af88fa2813ea8ae8'
});
const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component{
  constructor(){
    super(); 
    this.state = {
      input: '',
      imageUrl: '',
      box: {}, 
      route: 'signin'

    }
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info_bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row *height)

    }
  }
  displayFaceBox = (box) => {
    
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      'c0c0ac362b03416da06ab3fa36fb58e3',
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
      
    
  }
  onRouteChange = (route) => {
    this.setState({route: route})
  }
  render() {
  return (
    <div className="App">
      <Particles className='particles'
          params={particleOptions}
      />
      <Navigation onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home' 
      ?  <div>
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
  : (
    this.state.route === 'signin' 
    ? <Signin onRouteChange={this.onRouteChange}/>
    : <Register onRouteChange={this.onRouteChange} />
  )
  }
  </div>
  );
}
}
  

    
  


export default App;
