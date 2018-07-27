/* global window, document */
import React, { Component } from 'react';
import { fromJS } from 'immutable';
import MapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import * as turf from '@turf/turf';
import { json as requestJson } from 'd3-request';
import { defaultMapStyle, populationByPolygon, isochrones } from '../map/map-style';
import DeckGLOverlay from '../deckgl-overlay/deckgl-overlay';
import tripsData from '../data/tryx.json';
import getScale from '../map/utils';
import Pin from '../map/pin';
import isochrone from '../map/myiso';

// Styles
import './styles.css';

const NodeGeocoder = require('node-geocoder');

const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));
const geooptions = {
  provider: 'locationiq',
  apiKey: '99a8f2781e9c90',
};

const geocoder = NodeGeocoder(geooptions);
// Mapbox
const accessToken =
  'pk.eyJ1IjoiaGFsbHNleSIsImEiOiJjamh4Y2hsYWIwYWJ3M3dwYjZlN2cyamZqIn0.XGLq4Gx6F_ZRIusQm7Elcg';
const gmapskey = 'AIzaSyAy4grLuONSG-gN4UuAAi-5lWZPXWO5nbM';
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
        pitch: 50,
        bearing: 4,
      },
      longitude: 60.618296,
      latitude: 56.853880,
      mapStyle: defaultMapStyle,
      trips: tripsData,
      time: 12,
      hoveredFeature: null,
      address: null,
      mode: null,
      isChecked: true,
      speed: null,
      length: null,
      transitmode: null,
      transittime: null,
      loading: false,
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

  onModeChange = (mode) => {
    if (mode !== this.state.mode) {
      this.setState({ mode }, () => {
        this.onLoad();
      });
    }
  }

  onToggle = (isChecked) => {
    if (isChecked !== this.state.isChecked) {
      this.setState({ isChecked }, () => {
        if (isChecked === false) {
          requestJson('../data/density.json', (error, response) => {
            if (!error) {
              this.loadData(response, 10, f => f.properties.density, 'populationByPolygon', populationByPolygon);
            }
          });
          this.goToViewport({
            latitude: 56.835,
            longitude: 60.61,
          });
        } else this.setState({ mapStyle: defaultMapStyle });
      });
    }
  }

  onLoad = () => {
    if (this.state.mode === 0) {
      this.goToViewport({
        latitude: 56.835,
        longitude: 60.61,
      });
      this.setState({ trips: tripsData, mapStyle: defaultMapStyle, isChecked: false });
    } else if (this.state.mode === 1) {
      this.goToViewport({
        latitude: 56.853880,
        longitude: 60.618296,
      });
      this.setState({ trips: null });
      requestJson('../data/test.json', (error, response) => {
        if (!error) {
          this.loadData(response, 10, f => f.properties.time, 'isochrones', isochrones);
        }
      });
    }
  };

  onClick = (event) => {
    const { transitmode, transittime, radius } = this.props;
    const { loading } = this.state;
    this.hoveredFeature = null;
    const { features } = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');
    const coordinates = hoveredFeature ? turf.centroid(hoveredFeature).geometry.coordinates : null;
    if (coordinates) {
      // this.setState({
      //   latitude: coordinates[1],
      //   longitude: coordinates[0],
      // });
      this.setState({
        latitude: coordinates[1],
        longitude: coordinates[0],
        loading: true,
        // mapStyle: defaultMapStyle,
      }, () => {
        isochrone([this.state.longitude, this.state.latitude], radius, transittime, transitmode, 'directions', gmapskey, (err, output) => {
          if (err) throw err;
          // console.log(output);
          this.loadData(output, 10, f => f.properties.time, 'isochrones', isochrones);
          this.setState({ loading: false });

          // fs.writeFileSync('test', JSON.stringify(output, null, 2));
        });
        // console.log([this.state.latitude, this.state.longitude]);
        // this.onLoad();
      });
    }
  }

  onHover = (event) => {
    this.hoveredFeature = null;
    const {
      features,
      srcEvent: { offsetX, offsetY },
      srcEvent: { timeStamp },
    } = event;
    const hoveredFeature =
      features && features.find(f => f.layer.id === 'data');
    if (hoveredFeature) {
      if (event.features[0].properties.value !== temp) {
        if (timeStamp - temptimestamp > 900) {
          // todo get address if hovered but time > 900
          const address = null;
          this.setState({ address });
          this.getAddress(turf.centroid(hoveredFeature).geometry.coordinates);
          temp = event.features[0].properties.value;
          temptimestamp = timeStamp;
        }
      }
    }
    this.setState({ hoveredFeature, x: offsetX, y: offsetY });
  };

  getAddress = (point) => {
    let address = null;
    geocoder.reverse({ lat: point[1], lon: point[0] }, (err, res) => {
      if (!err) {
        // console.log(res.raw.address);
        if (res.raw.address.house_number) {
          if (res.raw.address.road) {
            if (res.raw.address.suburb) {
              address = `${res.raw.address.suburb}, ${res.raw.address.road}, ${
                res.raw.address.house_number
              }`;
            } else if (res.raw.address.city_district) {
              address = `${res.raw.address.city_district}, ${res.raw.address.road}, ${
                res.raw.address.house_number
              }`;
            } else {
              address = ` ${res.raw.address.road}, ${
                res.raw.address.house_number
              }`;
            }
          } else if (res.raw.address.pedestrian) {
            address = `${res.raw.address.suburb}, ${res.raw.address.pedestrian}, ${
              res.raw.address.house_number
            }`;
          }
        } else if (res.raw.address.road) {
          if (res.raw.address.suburb) { address = `${res.raw.address.suburb}, ${res.raw.address.road}`; } else address = `${res.raw.address.city_district}, ${res.raw.address.road}`;
        } else if (res.raw.address.pedestrian) {
          address = `${res.raw.address.suburb}, ${res.raw.address.pedestrian}`;
        } else { address = `${res.raw.address.city_district}, ${res.raw.address.suburb}`; }
      }
      this.setState({ address });
    });
  };

  loadData = (data, scale, accessor, sourcename, dataLayer) => {
    getScale(data, scale, accessor);

    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(
        ['sources', sourcename],
        fromJS({ type: 'geojson', data }),
      )
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').insert(129, dataLayer));
    // console.log(defaultMapStyle.toJS().layers.findIndex(x => x.id === 'place-suburb'));

    this.setState({ mapStyle });
  };

  animate = () => {
    const { speed } = this.props;
    const timestamp = Date.now();
    const loopLength = 86400; // 1700
    const loopTime = speed; // 60000 speed (100k)
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

  goToViewport = ({ longitude, latitude }) => {
    if (this.state.mode === 1) {
      this.onViewportChange({
        longitude,
        latitude,
        zoom: 11.7,
        pitch: 5,
        bearing: -1,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 500,
      });
    }
    if (this.state.mode === 0) {
      this.onViewportChange({
        longitude,
        latitude,
        zoom: 12,
        maxZoom: 16,
        pitch: 45,
        bearing: 4,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 1000,
      });
    }
    if (this.state.isChecked === false && this.state.mode === 0) {
      this.onViewportChange({
        longitude,
        latitude,
        zoom: 11.5,
        pitch: 0,
        bearing: -8,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 500,
      });
    }
  };

renderMarker = () => {
  if (this.state.mode === 1) {
    return (
      <Marker
        latitude={this.state.latitude}
        longitude={this.state.longitude}
        onDragStart={this.onMarkerDragStart}
        onDragEnd={this.onMarkerDragEnd}
        onDrag={this.onMarkerDrag}
        captureDrag
      >
        <Pin />
      </Marker>);
  }
}

renderSpinner= () => {
  if (this.state.loading) {
    return (
      <div className="loading" />);
  }
}

  onMarkerDragStart = (event) => {
    const { latitude, longitude } = event;
    console.log('1');
    // Any functionality for when a drag starts
  }

  onMarkerDragEnd = (event) => {
    const { latitude, longitude } = event;
    console.log('2');
    // Any functionality for when a drag ends
    this.setState({ latitude, longitude });
  }

  onMarkerDrag = (event) => {
    const {
      features,
    } = event;
    console.log('3');
    event.preventDefault();
    // Any functionality when marker moves while being dragged
  }

  renderTooltip = () => {
    if (this.state.mode === 0) {
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
    } else if (this.state.mode === 1) {
      const {
        hoveredFeature, x, y, address,
      } = this.state;
      return hoveredFeature && (
      <div>
        <div className="dot" style={{ left: x, top: y }} />
        <div className="line" style={{ left: x + 2, top: y + 2 }} />
        <div className="tooltip" style={{ left: x + 20, top: y + 20 }}>
          <div>{address}</div>
          <div>около {`${(hoveredFeature.properties.time / 60).toFixed()} минут`}</div>
        </div>
      </div>
      );
    }
  }

  render() {
    const {
      viewport, mapStyle, trips, time, loading,
    } = this.state;
    const { mode, length } = this.props;
    const { isChecked } = this.props;

    // if (loading)
    return (
      <div>
        <div className="map" ref={this.makeRef}>
          {this.renderSpinner()}
          <MapGL
            {...viewport}
            mapStyle={mapStyle}
            onViewportChange={this.onViewportChange.bind(this)}
            mapboxApiAccessToken={accessToken}
            onHover={this.onHover}
            onClick={this.onClick}
            onLoad={this.onLoad}
            onModeChange={this.onModeChange(mode)}
            onToggle={this.onToggle(isChecked)}
          >
            {this.renderMarker()}
            {this.renderTooltip()}
            <DeckGLOverlay
              viewport={viewport}
              trips={trips}
              trailLength={length}
              time={time}
            />
          </MapGL>
        </div>
      </div>
    );
  }
}
