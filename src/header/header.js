import React, { Component } from 'react';

// Styles
import './styles.css';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: 'mode-story',
    };
  }

  handleClick(e) {
    e.preventDefault();
    console.log(e);
  }

  render() {
    const {
      options,
    } = this.state;
    return (
      <div className="header">
        <div id="about-link">
          <div >О проекте</div>
        </div>
        <div id="legend-mobile" />
        <div id="modes">
          <div className="mode-selected" id="mode-story" onClick={this.handleClick}>
            <span className="desktop">Покрытие</span>
          </div>
          <div className="mode" id="mode-viz" onClick={this.handleClick}>
            <div>Доступность</div>
          </div>
          <div className="mode" id="mode-stats" onClick={this.handleClick}>
            <div>Регулярность</div>
          </div>
        </div>
        <div id="title">
          <div>Общественный транспорт Екатеринбурга</div>
        </div>
      </div>
    );
  }
}
