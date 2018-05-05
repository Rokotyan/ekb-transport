import React, { Component } from 'react';
import Map from './map/map.js'
import Legend from './legend'

// Styles
import './App.css'
class App extends Component {
  render() {
    return (
      <div className="vis-map">
        <Map/>
        <Legend />
      </div>
    );
  }
}

export default App;
