import React, { Component } from 'react';
import Map from './map/map';
import Legend from './legend/legend';
import Header from './header/header';
// import NavBar from './header/navbar';
import Slidery from './slider/slider';

// Styles
import './App.css';

class App extends Component {
  constructor(props){
    super(props);

    this.onTabChange = this.onTabChange.bind(this); // We need to bind the component to the method
    this.state = {
      activeTabIdx: 0,
    };
  }

  onTabChange(idx) {
    this.setState({
      activeTabIdx: idx,
    });
  }

  render() {
    const { activeTabIdx } = this.state;

    return (
      <div className="vis-map">
        <Map mode={activeTabIdx}/>
        <Header onTabChange={this.onTabChange}/>
        <Legend />
        <Slidery />
      </div>
    );
  }
}

export default App;
