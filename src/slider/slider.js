import React, { Component } from 'react';
import Slider from 'react-rangeslider';
// To include the default styles
import 'react-rangeslider/lib/index.css';

// Styles
import './styles.css';

class Slidery extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      horizontal: 10,
      vertical: 50,
    };
  }

  handleChangeHorizontal = (value) => {
    this.setState({
      horizontal: value,
    });
  };

  handleChangeVertical = (value) => {
    this.setState({
      vertical: value,
    });
  };

  render() {
    const { horizontal, vertical } = this.state;
    const horizontalLabels = {
      0: '0',
      12: '12',
      23: '23',
    };

    const formatkg = value => `${value}:00`;
    const formatPc = p => `${p}%`;

    return (
      <div className="slider">
        <Slider
          min={0}
          max={23}
          value={horizontal}
          labels={horizontalLabels}
          format={formatkg}
          handleLabel={horizontal}
          onChange={this.handleChangeHorizontal}
        />
      </div>
    );
  }
}

export default Slidery;
