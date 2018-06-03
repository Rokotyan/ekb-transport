/* eslint-disable */
import { range } from 'd3-array';
import { scaleQuantile } from 'd3-scale';

export default function getScale(featureCollection, grades, accessor) {
  const { features } = featureCollection;
  const scale = scaleQuantile().domain(features.map(accessor)).range(range(grades));
  features.forEach((f) => {
    const value = accessor(f);
    f.properties.value = value;
    f.properties.scale = scale(value);
  });
}
