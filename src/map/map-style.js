import { fromJS } from 'immutable';
import MAP_STYLE from '../map/mapbox-style.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const populationByPolygon = fromJS({
  id: 'data',
  source: 'populationByPolygon',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'scale',
      stops: [
        [0, '#4a4a4a'],
        [1, '#5c5c5c'],
        [2, '#6f6f6f'],
        [3, '#828282'],
        [4, '#959595'],
        [5, '#aaaaaa'],
        [6, '#bebebe'],
        [7, '#d4d4d4'],
        [8, '#e9e9e9'],
        [9, '#ffffff'],
      ],
    },
    'fill-opacity': 0.5,
  },
});


export const isochrones = fromJS({
  id: 'data',
  source: 'isochrones',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'scale',
      stops: [
        [0, '#98fb98'],
        [1, '#b0f990'],
        [2, '#c4f789'],
        [3, '#d7f481'],
        [4, '#e9f179'],
        [5, '#f4e073'],
        [6, '#f8c06e'],
        [7, '#f99e69'],
        [8, '#f87a64'],
        [9, '#f54e5e'],
      ],
    },
    'fill-opacity': 0.6,
  },
});

export const defaultMapStyle = fromJS(MAP_STYLE);
