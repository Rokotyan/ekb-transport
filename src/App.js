import React, { Component } from 'react';
import Map from './map/map';
import Legend from './legend/legend';
import Header from './header/header';

// Styles
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.onTransitTimeChange = this.onTransitTimeChange.bind(this);
    this.onTransitModeChange = this.onTransitModeChange.bind(this);
    this.onLengthChange = this.onLengthChange.bind(this);
    this.onSpeedChange = this.onSpeedChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.state = {
      activeTabIdx: 0,
      isChecked: true,
      speed: 120000,
      length: 150,
      transitmode: 'transit',
      transittime: 1800,
      radius: 0.5,
    };
  }

  onTabChange(idx) {
    this.setState({
      activeTabIdx: idx,
    });
  }

  onLengthChange(len) {
    this.setState({ length: len });
  }

  onSpeedChange(spd) {
    this.setState({ speed: spd });
  }


  onTransitModeChange(tm) {
    let radius = 0.5;
    if (tm == 'driving') radius *= 2;
    if (tm == 'walking') radius /= 2;
    console.log(tm);
    if (this.state.transittime) { this.setState({ transitmode: tm, radius }); }
  }

  onTransitTimeChange(tt) {
    console.log(tt);
    this.setState({ transittime: tt });
  }

  onCheck(idx) {
    this.setState({ isChecked: idx });
  }

  render() {
    const {
      activeTabIdx, isChecked, speed, length, transitmode, transittime, radius,
    } = this.state;

    return (
      <div className="vis-map">
        <Map
          mode={activeTabIdx}
          isChecked={isChecked}
          speed={speed}
          length={length}
          radius={radius}
          transitmode={transitmode}
          transittime={transittime}
        />
        <Header
          activeTabIdx={activeTabIdx}
          onTabChange={this.onTabChange}
        />
        <Legend
          mode={activeTabIdx}
          speed={speed}
          length={length}
          transitmode={transitmode}
          transittime={transitmode}
          onCheck={this.onCheck}
          isChecked={isChecked}
          onLengthChange={this.onLengthChange}
          onSpeedChange={this.onSpeedChange}
          onTransitTimeChange={this.onTransitTimeChange}
          onTransitModeChange={this.onTransitModeChange}
        />
      </div>
    );
  }
}

export default App;
