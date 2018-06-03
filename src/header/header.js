import React, { Component } from 'react';

// Styles
import './styles.css';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.activateTab = this.activateTab.bind(this);
    this.state = {
      options: 'mode-story',
      activeTabIdx: 0,
    };
  }

  activateTab(idx, e) {
    const { onTabChange } = this.props;

    if (onTabChange instanceof Function) onTabChange(idx);

    this.setState({
      activeTabIdx: idx,
    });
    e.preventDefault();
  }

  render() {
    const {
      options, activeTabIdx,
    } = this.state;

    const tabs = ['Покрытие', 'Доступность', 'Регулярность'];
    return (
      <div className="header">
        <div id="about-link">
          <div >О проекте</div>
        </div>
        <div id="legend-mobile" />
        <div id="modes">
          { tabs.map( (name, i) => (
            <div
              key={name}
              className={activeTabIdx === i ? 'mode-selected' : 'mode'}
              onClick={this.activateTab.bind(this, i)}
            >
              { name }
            </div>
            ))
          }

{/*          <div className="mode-selected" id="mode-story" onClick={this.handleClick}>
            <span className="desktop">Покрытие</span>
          </div>
          <div className="mode" id="mode-viz" onClick={this.handleClick}>
            <div>Доступность</div>
          </div>
          <div className="mode" id="mode-stats" onClick={this.handleClick}>
            <div>Регулярность</div>
          </div>*/}
        </div>
        <div id="title">
          <div>Общественный транспорт Екатеринбурга</div>
        </div>
      </div>
    );
  }
}
