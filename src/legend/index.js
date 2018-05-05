/* global window,document */
import React, {Component} from 'react';

// Styles
import './styles.css';

export default class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className='vis-legend'>
        <div className='w240 round shadow-darken10 px12 py12 bg-gray-faint txt-s'>
          <strong className='block mb6'>Trails</strong>
          <div className='grid mb6'>
            <div className='col bg-red-light h12'></div>
            <div className='col bg-yellow-faint h12'></div>
            <div className='col bg-green-light h12'></div>
            <div className='col bg-blue-light h12'></div>
          </div>
          <div className='grid txt-xs'>
            <div className='col align-center'>avtb</div>
            <div className='col align-center'>trol</div>
            <div className='col align-center'>tram</div>
            <div className='col align-center'>avtm</div>
          </div>
        </div>
      </div>
    );
  }
}
