/* global d3 */
import React, { Component } from 'react';

// Utils
import { guid, styleText } from 'utils/chart';
import { getColor } from 'utils/color';
import { getId, getTooltipContent } from './helpers';

// Styles
import s from './styles.scss';

export default class ScatterGraph extends Component {
  constructor(props) {
    super(props);
    this.makeRef = (c) => { this.svg = c; };

    this.state = {};
  }

  componentDidMount() {
    this.defaultWidth = this.svg.parentNode.clientWidth || 600;
    this.defaultHeight = 300;

    this.margin = {
      left: 10,
      right: 50,
      top: 10,
      bottom: 10,
    };

    this.scatterGraph = d3.select(this.svg).append('g').attr('class', 'scatter-box');
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();

    const firstRender = false;
    this.draw(1600, firstRender);

    d3.select(window).on(`resize.chart_${guid()}`, () => this.draw(0));
  }

  draw(dur = 800, firstRender = false) {
    const { scatterGraph, xScale, yScale, margin } = this;
    const { data } = this.props;
    if (!data) return;

    this.width = this.svg.parentNode.clientWidth || this.defaultWidth;
    this.height = this.defaultHeight;
    d3.select(this.svg)
      .attr('width', this.width)
      .attr('height', this.height);

    const scatterWidth = this.width - margin.left - margin.right;
    const scatterHeigth = this.height - margin.top - margin.bottom;

    scatterGraph.attr('transform', `translate(${margin.left}, ${margin.top})`);

    xScale.domain(d3.extent(data.values, d => d[0])).range([0, scatterWidth]);
    yScale.domain(d3.extent(data.values, d => d[1])).range([0, scatterHeigth]);

    const elements = scatterGraph.selectAll('circle').data(data.values);
    const elementEnter = elements.enter().append('circle')
      .attr('cx', () => (Math.random() - 0.5) * 1000 )
      .attr('cy', () => (Math.random() - 0.5) * 1000 )
      .attr('fill', 'white')
      .attr('r', 0);

    elementEnter.merge(elements)
      .transition().duration(dur)
      .attr('cx', d => xScale(d[0]) )
      .attr('cy', d => xScale(d[1]) )
      .attr('r', (d, i) => i)
      .attr('fill', '#91d2e2');
  }

  render() {
    return (
      <div className={s.root}>
        <svg ref={this.makeRef} className={s.svg} />
      </div>
    );
  }
}
