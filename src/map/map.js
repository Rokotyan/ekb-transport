/* global window,document */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGLOverlay from '../deckgl-overlay/deckgl-overlay.js';
import data from '../data/all.json';

// Styles
import './styles.css';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; 

export default class Map extends Component {
  constructor(props) {
    super(props);

    // We need to make a reference for our container (div element) to set the viewport to its size
    this.makeRef = c => { this.el = c; };
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 0,
        height: 0
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
    // Set the viewport to the whole size of the container
    this._onViewportChange({
      width: this.el.clientWidth,
      height: this.el.clientHeight,
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
      <div className='map' ref={this.makeRef}>
        <MapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={'pk.eyJ1IjoiaGxsc25kcyIsImEiOiJjamYzbzNtN3ExajBpMnlwazdxZWUzcXNwIn0.aLwlUoj_gtjBpEXoKOkvNg'}
          >
          <DeckGLOverlay
            viewport={viewport}
            //buildings={buildings}
            trips={trips}
            trailLength={180}
            time={time}
          />
        </MapGL>
      </div>
    );
  }
}
