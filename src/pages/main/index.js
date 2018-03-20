/* global d3 */
import ScatterGraph from 'components/scatter';

// Data
import sampleCSVData from 'data/sample.csv';
import sampleJSONData from 'data/scatter.json';

export default class MainPage {
  constructor(element) {
    this.container = d3.select(element);
    console.log(sampleCSVData, sampleJSONData);
  }

  render() {
    this.container.append('h1')
      .text('Hello World');

    const chart = new ScatterGraph(this.container.node(), sampleJSONData);
  }
}
