import React, { Component } from 'react';

// Styles
import './styles.css';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.activateTab = this.activateTab.bind(this);
    this.state = {
    };
  }

  activateTab(idx, e) {
    const { onTabChange } = this.props;

    if (onTabChange instanceof Function) onTabChange(idx);
    e.preventDefault();
  }

  render() {
    const { activeTabIdx } = this.props;

    const tabs = ['Покрытие', 'Доступность'];
    return (
      <div className="header">
        <div id="about-link">
          <div >О проекте</div>
        </div>
        <div id="modes">
          { tabs.map((name, i) => (
            <div
              key={name}
              className={activeTabIdx === i ? 'mode-selected' : 'mode'}
              onClick={this.activateTab.bind(this, i)}
            >
              { name }
            </div>
            ))
          }
        </div>
        <div id="title">
          <div>Общественный транспорт Екатеринбурга</div>
        </div>
      </div>
    );
  }
}
