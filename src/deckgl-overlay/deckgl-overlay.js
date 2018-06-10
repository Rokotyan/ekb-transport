import React, { Component } from 'react';
import DeckGL, { PolygonLayer } from 'deck.gl';
import TripsLayer from '../trips-layer';

const LIGHT_SETTINGS = {
  lightsPosition: [-74.05, 40.7, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.0, 0.0, 0.0, 0.0],
  numberOfLights: 2,
};

export default class DeckGLOverlay extends Component {
  render() {
    const {
      viewport, trips, trailLength, time,
    } = this.props;
    if (!trips) {
      return null;
    }
    const layers = [
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.segments,
        getColor: d => (d.vendor === 0 ? [255, 49, 27] : d.vendor === 1 ? [92, 43, 213] : d.vendor === 2 ? [23, 222, 67] : [255, 221, 27]),
        opacity: 1,
        strokeWidth: 5,
        trailLength,
        currentTime: time,
      }),
    ];
    return <DeckGL {...viewport} layers={layers} />;
  }
}
