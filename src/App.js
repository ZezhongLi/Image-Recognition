import React, { Component } from 'react';
import './App.css';
import 'tachyons';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ImageRecognition from './components/ImageRecognition/ImageRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const particlesOptions = {
  "particles": {
    "number": {
      "value": 30,
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

const initState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: '',
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initState;
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initState);
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
        return <Signin loadUser={this.loadUser} onRouteChange = { this.onRouteChange } />
      }
      else if (route === 'home'){
        return (
          <div>
            <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm 
              onInputChange = { this.onInputChange } 
              onButtonSubmit = {this.onButtonSubmit}
            />
            <ImageRecognition boxes = { boxes } imageUrl = { imageUrl }/>
          </div>
        )
      }
      else {
        return <Register loadUser={this.loadUser} onRouteChange = { this.onRouteChange } />
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
