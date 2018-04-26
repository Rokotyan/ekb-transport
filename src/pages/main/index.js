import React, { Component } from 'react';

// Components
import ScatterGraph from 'components/scatter';

// Data
import sampleCSVData from 'data/sample.csv';
import sampleJSONData from 'data/scatter.json';

// Styles
import s from './styles.scss';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    console.log(sampleCSVData, sampleJSONData);
  }

  // const chart = new ScatterGraph(this.container.node(), sampleJSONData);
  render() {
    return (
      <div className={s.root}>
        Hello world!
        <ScatterGraph data={sampleJSONData} />
      </div>
    );
  }
}
