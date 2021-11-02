//NPM components to install
import React, { Component } from 'react';
import Navigation           from './components/navigation/Navigation.js';
import Logo                 from './components/Logo/Logo.js';
import ImgLink              from './components/ImgLink/ImgLink.js';
import FaceR                from './components/FaceRecognition/FaceRecognition.js';
import Rank                 from './components/Rank/Rank.js';
import SignIn               from './components/SignIn/SignIn';
import RegisterIn           from './components/Register/Register';
import Particles            from 'react-particles-js';
import                           './App.css';


// particles for background
const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

//Set State for image information reset after login/logoff
const initialState = {
    input:        '',
    imageUrl:     '',
    box:          { },
    route:        'signin',
    isSignnedIn:  false,
    user: {
     id: '',
     name: '',
     email: '',
     entries: 0,
     joined: ''
    }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

//loading user information as an object
loadUser = (data) => {  
  this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
  }})
}

//Face cordinates calcualtion for face recognition
faceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image =  document.getElementById('inputimage');
  const width =  Number(image.width);
  const height = Number(image.height);

  return {
    leftCol:   clarifaiFace.left_col * width,
    topRow:    clarifaiFace.top_row * height,
    rightCol:  width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

//Box for face recognition area
displayFaceBox = (box) => {
  this.setState({box: box});
}

//Event change for the sign in/out and register
onInputChange = (event) => {
    this.setState({input: event.target.value})
}

//Button event for the face recognition request
onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  fetch('https://warm-woodland-88091.herokuapp.com/imageurl', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
          input: this.state.input
    })
  })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://warm-woodland-88091.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                  id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
      }
      this.displayFaceBox (this.faceLocation(response))
    })
    .catch(err => console.log(err));
  }


//Event change for the buttons for 1 page change between sign in/out and register 
onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignnedIn: true})
  }
  this.setState({route: route});
}

//App Sections to implement as 1 page
render() {
  const { isSignnedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      <Particles className='particles' params={particleOptions}/>
      <Navigation isSignnedIn={isSignnedIn} onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home' 
      ? <div>
          <Logo />
          <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
          />
          <ImgLink 
              onInputChange= {this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
          />
          <FaceR 
              box=      {box} 
              imageUrl= {imageUrl}
          />
      </div>
      : (
        route === 'signin'
        ? <SignIn  
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange}
          />
        : <RegisterIn 
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange}
          /> 
      ) 
      }
    </div>
    );
  }
}

export default App;

