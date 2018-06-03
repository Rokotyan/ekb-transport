/* global window,document */
import React, { Component } from 'react';
import { fromJS } from 'immutable';
import MapGL from 'react-map-gl';
import * as turf from '@turf/turf';
import { json as requestJson } from 'd3-request';
import { defaultMapStyle, dataLayer, dataLayer1 } from '../map/map-style';
import DeckGLOverlay from '../deckgl-overlay/deckgl-overlay';
import tripsData from '../data/trips.json';
import getScale from '../map/utils';

// Styles
import './styles.css';

const NodeGeocoder = require('node-geocoder');

const geooptions = {
  provider: 'locationiq',
  apiKey: '99a8f2781e9c90',
};

const geocoder = NodeGeocoder(geooptions);
// Mapbox
const accessToken =
  'pk.eyJ1IjoiaGFsbHNleSIsImEiOiJjamh4Y2hsYWIwYWJ3M3dwYjZlN2cyamZqIn0.XGLq4Gx6F_ZRIusQm7Elcg';

let temp = null;
let temptimestamp = 0;

export default class Map extends Component {
  constructor(props) {
    super(props);
    // We need to make a reference for our container (div element) to set the viewport to its size
    this.makeRef = (c) => {
      this.el = c;
    };
    this.state = {
      viewport: {
        longitude: 60.61,
        latitude: 56.835,
        zoom: 12,
        maxZoom: 16,
        pitch: 45,
        bearing: 0,
      },
      mapStyle: defaultMapStyle,
      trips: tripsData,
      time: 12,
      hoveredFeature: null,
      address: null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.animate();
  }

  componentWillUnmount() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  }

  onLoad = () => {
    // метод для второй кнопки
    // requestJson('../data/test.json', (error, response) => {
    //   if (!error) {
    //     this._loadData(response);
    //   }
    // });
    requestJson('../data/density.json', (error, response) => {
      if (!error) {
        this.loadData(response);
      }
    });
  };


  onHover = (event) => {
    this.hoveredFeature = null;
    const {
      features,
      srcEvent: { offsetX, offsetY },
      srcEvent: { timeStamp },
    } = event;
    // console.log(this.el.style.cursor = 'pointer');
    const hoveredFeature =
      features && features.find(f => f.layer.id === 'data');
    if (hoveredFeature) {
      if (timeStamp - temptimestamp > 900) {
        const address = null;
        this.setState({ address });
        // console.log(event.srcEvent.timeStamp);
        this.getAddress(turf.centroid(hoveredFeature).geometry.coordinates);
        if (hoveredFeature.properties.population !== temp) {
          temp = hoveredFeature.properties.population;
        }
        temptimestamp = timeStamp;
      }
    }
    this.setState({ hoveredFeature, x: offsetX, y: offsetY });
  };

  getAddress = (point) => {
    let address = null;
    geocoder.reverse({ lat: point[1], lon: point[0] }, (err, res) => {
      if (!err) {
        if (res.raw.address.suburb) {
          if (res.raw.address.house_number) {
            address = `${res.raw.address.suburb}, ${res.raw.address.road}, ${
              res.raw.address.house_number
            }`;
          } else {
            address = `${res.raw.address.suburb}, ${res.raw.address.road}`;
          }
        } else {
          address = `${res.raw.address.city_district}, ${
            res.raw.address.road
          }, ${res.raw.address.house_number}`;
        }
      }
      this.setState({ address });
    });
  };

  loadData = (data) => {
    getScale(data, 10, f => f.properties.density);
    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(
        ['sources', 'populationByPolygon'],
        fromJS({ type: 'geojson', data }),
      )
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').insert(129, dataLayer));
    this.setState({ mapStyle });
  };

  // метод для второй кнопки
  // _loadData = (data) => {
  //   getScale(data, 20, f => f.properties.time);
  //   const mapStyle = defaultMapStyle
  //     // Add geojson source to map
  //     .setIn(['sources', 'isochrones'], fromJS({ type: 'geojson', data }))
  //     // .set('layers', defaultMapStyle.get('layers').push(dataLayer1));
  //     // это индекс места с названиями районов
  //     // console.log(defaultMapStyle.toJS().layers.findIndex(x => x.id === 'place-suburb')); 129
  //     .set('layers', defaultMapStyle.get('layers').insert(129, dataLayer1));
  //   this.setState({ data, mapStyle });
  // }

  animate = () => {
    const timestamp = Date.now();
    const loopLength = 1700; // 1700
    const loopTime = 150000; // 60000 speed (100k)
    // console.log((timestamp % loopTime) / loopTime * loopLength);
    this.setState({ time: ((timestamp % loopTime) / loopTime) * loopLength });
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
  }

  resize = () => {
    // Set the viewport to the whole size of the container
    this.onViewportChange({
      width: this.el.clientWidth,
      height: this.el.clientHeight,
    });
  }

  renderTooltip = () => {
    const {
      hoveredFeature, x, y, address,
    } = this.state;
    return (
      hoveredFeature && (
      <div>
        <div className="dot" style={{ left: x, top: y }} />
        <div className="line" style={{ left: x + 2, top: y + 2 }} />
        <div className="tooltip" style={{ left: x + 20, top: y + 20 }}>
          <div>{address}</div>
          <div><b>~{hoveredFeature.properties.population}</b> жителей ({`${hoveredFeature.properties.density}/км\xB2`})</div>
        </div>
      </div>
      )
    );
  }

  // метод для второй кнопки
  // _renderTooltip() {
  //   const { hoveredFeature, x, y } = this.state;
  //   return hoveredFeature && (
  //     <div className="tooltip" style={{ left: x, top: y }}>
  //       <div>scale: ~{hoveredFeature.properties.scale}</div>
  //       <div>time: {`${(hoveredFeature.properties.time / 60).toFixed()} mins`}</div>
  //     </div>
  //   );
  // }

  render() {
    const {
      viewport, mapStyle, trips, time,
    } = this.state;
    return (
      <div className="map" ref={this.makeRef}>
        <MapGL
          {...viewport}
          mapStyle={mapStyle}
          onViewportChange={this.onViewportChange.bind(this)}
          mapboxApiAccessToken={accessToken}
          onHover={this.onHover}
          onLoad={this.onLoad}
        >
          {this.renderTooltip()}
          <DeckGLOverlay
            viewport={viewport}
            trips={trips}
            trailLength={110}
            time={time}
          />
        </MapGL>
      </div>
    );
  }
}
