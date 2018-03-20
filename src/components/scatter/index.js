/* global d3 */

// Utils
import { guid, styleText } from 'utils/chart';
import Tooltip from 'utils/tooltip';
import { getColor } from 'utils/color';
import { getId, getTooltipContent } from './helpers';

export default class ScatterGraph {
  constructor(element, data) {
    this.container = d3.select(element);
    this.defaultWidth = element.clientWidth || 600;
    this.defaultHeight = 300;

    this.svg = this.container.append('svg')
      .style('display', 'block');

    this.tooltip = new Tooltip(d3.select(this.svg.node().parentNode));

    this.margin = {
      left: 10,
      right: 50,
      top: 10,
      bottom: 10,
    };

    this.data = data;
    this.scatterGraph = this.svg.append('g').attr('class', 'scatter-box');
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();

    const firstRender = false;
    this.render(1600, firstRender);

    d3.select(window).on('resize.chart_' + guid(), () => this.render(0));
  }

  render(dur = 800, firstRender = false) {
    const { data, scatterGraph, xScale, yScale, margin } = this;
    if (!data) return;

    this.width = this.svg.node().parentNode.clientWidth || this.defaultWidth;
    this.height = this.defaultHeight;
    this.svg
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
      .attr('fill', 'blue');
  }

  getNode() { return this.svg.node(); }
  getWidth() { return this.width; }
  getHeight() { return this.height; }
}
