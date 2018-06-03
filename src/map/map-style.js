import { fromJS } from 'immutable';
import MAP_STYLE from '../map/style.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
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


export const dataLayer1 = fromJS({
  id: 'data',
  source: 'isochrones',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'scale',
      stops: [
        [0, '#98fb98'],
        [1, '#a6fb8f'],
        [2, '#b3f987'],
        [3, '#bef77f'],
        [4, '#c9f477'],
        [5, '#d2f06f'],
        [6, '#daeb67'],
        [7, '#e2e560'],
        [8, '#e9de59'],
        [9, '#efd653'],
        [10, '#f4cd4d'],
        [11, '#f9c347'],
        [12, '#fcb843'],
        [13, '#ffab3e'],
        [14, '#ff9e3b'],
        [15, '#ff8e38'],
        [16, '#ff7d35'],
        [17, '#ff6a33'],
        [18, '#ff5232'],
        [19, '#ff3131'],
      ],
    },
    'fill-opacity': 0.5,
  },
});

export const defaultMapStyle = fromJS(MAP_STYLE);
