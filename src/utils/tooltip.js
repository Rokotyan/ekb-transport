import * as d3 from 'd3';

export default class Tooltip {
  constructor(sel) {
    this.tooltip = null;

    if (!sel.select('.tooltip').node()) {
      this.tooltip = sel.append('div').attr('class', 'tooltip')
        .styles({
          color: '#000',
          padding: '15px',
          background: 'RGBA(246, 246, 246, 1)',
          position: 'absolute',
          opacity: '0',
          visibility: 'visible',
          'line-height': '1.4',
          'font-family': 'Source Sans Pro, sans-serif',
          'font-weight': 300,
          'font-size': '16px',
          'box-shadow': '0px 0px 3px grey',
          'max-width': '300px',
          'text-align': 'center',
          'border-radius': '4px',
          'pointer-events': 'none',
        });
    } else {
      this.tooltip = sel.select('.tooltip');
    }
  }

  show(svg, content, direction, borderColor) {
    const { tooltip } = this;
    tooltip.html(content);
    const w = tooltip.node().offsetWidth;
    const h = tooltip.node().offsetHeight;
    const pos = d3.mouse(svg.node().parentElement);
    let x = pos[0];
    let y = pos[1];
    if (direction === 'right') x += w;
    else if (direction === 'left') x -= w;
    else x -= w * 0.5;
    if (direction === 'bottom') y += h * 0.5;
    else y -= (h + 10);
    tooltip.styles({
      opacity: 1,
      left: `${x}px`,
      top: `${y}px`,
      border: borderColor ? `${borderColor} solid 0.5px` : 'none',
    });
  }

  hide() {
    const { tooltip } = this;
    tooltip.styles({ opacity: 0 });
  }
}
