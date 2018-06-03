import React, { Component } from 'react';

// Styles
import './styles.css';

export default class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="storymode">
        <div id="storymode-header">Транспортная сеть</div>
        <div id="storymode-content">{'Можно увидеть, какие кварталы хорошо обеспечиваются наземным муниципальным транспортом, а какие нет; а также, в каких районах есть разнообразие транспорта, а какие обслуживаются только одним-двумя типами. Например, Химмаш обслуживается только троллейбусами, это значит, что если случается ДТП на троллейбусной линии, то жители Химмаша не смогут воспользоваться общественным транспортом, пока движение на линии парализовано.'}
        </div>
        <div className="storymode-legend">
          <div className="grid mb6">
            <div className="col bg-red-light h12" />
            <div className="col bg-yellow-faint h12" />
            <div className="col bg-green-light h12" />
            <div className="col bg-blue-light h12" />
          </div>
          <div className="grid txt-xs">
            <div className="col align-center">автобус</div>
            <div className="col align-center">троллейбус</div>
            <div className="col align-center">трамвай</div>
            <div className="col align-center">маршрутка</div>
          </div>
        </div>
      </div>
    );
  }
}
