import React, {
  Component
} from "react";
import Particles from 'react-particles-js';
import Navigation from "./Component/Navigation/Navigation";
import Logo from "./Component/Logo/Logo";
import ImageLinkForm from "./Component/ImageLinkForm/ImageLinkForm";
import Rank from './Component/Rank/Rank';
import "./App.css";
import Clarifai from "clarifai";
import FaceRecognition from './Component/FaceRecognition/FaceRecognition'
import Register from './Component/Register/Register'
import SignIn from './Component/SignIn/SignIn'

const app = new Clarifai.App({
  apiKey: '64050c7ed54e474cae69bff139f795ca'
})

const particleoptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 600
      }
    }
  },
  // interactivity: {
  //   onhover: {
  //     enable: true,
  //     mode: "repulse"
  //   }
  // }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    //console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    //setState(update, callback);
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then(response => this.calculateFaceLocation(response))
        // do something with response
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn , imageUrl , route , box } = this.state;
    return (
      <div className = "App" >
      <Particles className='particles' params={particleoptions}/>
      <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange}/>
      { route === 'home'
        ? <div>
          <Logo />
          <Rank/>
          <ImageLinkForm onInputChange={this.onInputChange}
                         onButtonSubmit ={this.onButtonSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        : (
            route === 'signin' ?
            <SignIn onRouteChange = {this.onRouteChange}/> :
            <Register onRouteChange = {this.onRouteChange}/>
        )
      }
      </div>
    );
  }
}

export default App;
