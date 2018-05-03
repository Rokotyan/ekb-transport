/* global window,document */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGLOverlay from '../deckgl-overlay/deckgl-overlay.js';
import data from '../data/all.json';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; 

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      buildings: null,
      trips: data,
      time: 12  
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const timestamp = Date.now();
    const loopLength = 1300; // 1700
    const loopTime = 150000;// 60000 speed (100k)
    this.setState({
      time: (timestamp % loopTime) / loopTime * loopLength
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: 640,
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {
    const {viewport, buildings, trips, time} = this.state;
    return (
        <MapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={'pk.eyJ1IjoiaGxsc25kcyIsImEiOiJjamYzbzNtN3ExajBpMnlwazdxZWUzcXNwIn0.aLwlUoj_gtjBpEXoKOkvNg'}
          >
          <div class='w240 round shadow-darken10 px12 py12 bg-gray-faint txt-s'>
            <strong class='block mb6'>Trails</strong>
            <div class='grid mb6'>
              <div class='col bg-red-light h12'></div>
              <div class='col bg-yellow-faint h12'></div>
              <div class='col bg-green-light h12'></div>
              <div class='col bg-blue-light h12'></div>
            </div>
            <div class='grid txt-xs'>
              <div class='col align-center'>avtb</div>
              <div class='col align-center'>trol</div>
              <div class='col align-center'>tram</div>
              <div class='col align-center'>avtm</div>
            </div>
          </div>
          <DeckGLOverlay
            viewport={viewport}
            //buildings={buildings}
            trips={trips}
            trailLength={180}
            time={time}
          />
        </MapGL>
    );
  }
}
