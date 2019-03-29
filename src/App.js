import React, {
  Component
} from "react";
import Particles from 'react-particles-js';
import Navigation from "./Component/Navigation/Navigation";
import Logo from "./Component/Logo/Logo";
import ImageLinkForm from "./Component/ImageLinkForm/ImageLinkForm";
import Rank from './Component/Rank/Rank';
import "./App.css";
import Clarifai from 'clarifai';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition'

const app = new Clarifai.App({
  apiKey: '64050c7ed54e474cae69bff139f795ca'
})

const particleoptions = {
  particles: {
    number: {
      value: 152,
      density: {
        enable: true,
        value_area: 473
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
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // console.log('click');
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(
      function(response) {
        console.log(response);
        // do something with response
      },
      function(err) {
        // there was an error
      }
    );
  }

  render() {
    return ( 
      <div className = "App" >
      <Particles className='particles' params={particleoptions}/>
      <Navigation/> 
      <Logo /> 
      <Rank/> 
      <ImageLinkForm onInputChange={this.onInputChange} 
                     onButtonSubmit ={this.onButtonSubmit}/> 
      <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  } 
}

export default App;