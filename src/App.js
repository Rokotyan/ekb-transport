import React, { Component } from 'react';
import Map from './map/map';
import Legend from './legend/legend';
import Header from './header/header';

// Styles
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.onTabChange = this.onTabChange.bind(this); // We need to bind the component to the method
    this.onCheck = this.onCheck.bind(this); // We need to bind the component to the method
    this.state = {
      activeTabIdx: 0,
      isChecked: true,
    };
  }

  onTabChange(idx) {
    this.setState({
      activeTabIdx: idx,
    });
  }

  onCheck(idx) {
    this.setState({ isChecked: idx });
  }

  render() {
    const { activeTabIdx } = this.state;
    const { isChecked } = this.state;

    return (
      <div className="vis-map">
        <Map mode={activeTabIdx} isChecked={isChecked} />
        <Header activeTabIdx={activeTabIdx} onTabChange={this.onTabChange} />
        <Legend mode={activeTabIdx} onCheck={this.onCheck} isChecked={isChecked} />
      </div>
    );
  }
}

export default App;
