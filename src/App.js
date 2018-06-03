import React, { Component } from 'react';
import Map from './map/map';
import Legend from './legend/legend';
import Header from './header/header';
// import NavBar from './header/navbar';
import Slidery from './slider/slider';

// Styles
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="vis-map">
        <Map />
        <Header />
        <Legend />
        <Slidery />
      </div>
    );
  }
}

export default App;
