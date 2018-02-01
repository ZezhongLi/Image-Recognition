import React, { Component } from 'react';
import './App.css';
import 'tachyons';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ImageRecognition from './components/ImageRecognition/ImageRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';



const app = new Clarifai.App({
  apiKey: 'c98ad7517bf24621a7ac257892fd5687'
 });

const particlesOptions = {
  "particles": {
    "number": {
      "value": 50,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "retina_detect": true
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }


  calculateFaceLocation = (data) => {
    let boxes = [];
    data.outputs[0].data.regions.forEach(region => {
      const clarifaiFace = region.region_info.bounding_box;
      const image = document.querySelector('#input-image');
      const width = Number(image.width);
      const height = Number(image.height);
      const oneBox =  {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
      boxes.push(oneBox);
    });
    return boxes;
  }


  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(error => console.log(error));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false });
    }
    else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, boxes, route } = this.state;
    const toDisplay = () => {
      if (route === 'signin') {
        return <Signin onRouteChange = { this.onRouteChange } />
      }
      else if (route === 'home'){
        return (
          <div>
            <Rank />
            <ImageLinkForm 
              onInputChange = { this.onInputChange } 
              onButtonSubmit = {this.onButtonSubmit}
            />
            <ImageRecognition boxes = { boxes } imageUrl = { imageUrl }/>
          </div>
        )
      }
      else {
        return <Register />
      }
    }
    return (
      <div className="App">
        <Particles className = 'particles' params = { particlesOptions }/>
        <Navigation isSignedIn = {isSignedIn} onRouteChange = { this.onRouteChange }/>
        <Logo />
        { toDisplay() }
      </div>
    );
  }
}

export default App;
