/* global d3 */

export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

export const styleText = (d, size, weight, fill = '#000', fontFamily = 'Helvetica', anchor = 'middle') => {
  d.styles({
    fill,
    'font-family': fontFamily || 'sans serif',
    'font-weight': weight,
    'font-size': size,
    'text-anchor': anchor,
  });
};

export const wrapLabel = (selection, opt) => {
  const options = opt ? opt : { styleFn: null, verticalAlign: 'middle', horizontalAlign: 'middle', labelWrapping: 'wrap', maxLabelWidth: 60, separator: ' ' };
  selection.each(function(d) {
    const textElement = d3.select(this);
    const text = textElement.text();
    if ( !text ) return;
    const words = text.split(options.separator);
    // if ( words.length === 1 ) return;
    textElement.text('');


    const xPos = +textElement.attr('x');

    let tspan = textElement.append('tspan').attr('x', xPos);
    if ( options.styleFn ) tspan.call( options.styleFn );
    let tspanText = words[ 0 ] + options.separator;
    tspan.text( tspanText );
    if ( options.labelWrapping === 'wrap' ) {
      let tspanCount = 1;
      words.forEach( (word, i) => {
        if (i === 0) return;
        tspan.text( tspanText + word + ' ' );
        if ( tspan.node().getComputedTextLength() > (options.maxLabelWidth ? options.maxLabelWidth : d.maxLabelWidth) ) {
          tspan.text( tspanText.trim() );
          tspan = textElement.append('tspan')
            .attr('x', xPos)
            .attr('dy', '1em')
            .text( word + options.separator );
          if ( options.styleFn ) tspan.call( options.styleFn );

          tspanCount++;
          tspanText = word + options.separator;
        } else tspanText += (word + options.separator);
      });
      if ( options.verticalAlign === 'middle' ) textElement.attr('dy', (-(tspanCount - 1) / 2 ) + 'em');
      else if ( options.verticalAlign === 'bottom' ) textElement.attr('dy', (-(tspanCount - 1) ) + 'em');
      else if ( options.verticalAlign === 'top' ) textElement.attr('dy', '0em');
    }
    else if ( options.labelWrapping === 'trim' ) {
      for ( let i = 0; i < words.length; i++) {
        const word = words[ i ];
        tspan.text( tspanText + word + options.separator );
        if ( tspan.node().getComputedTextLength() > (options.maxLabelWidth ? options.maxLabelWidth : d.maxLabelWidth) - 10 ) {
          tspan.text( tspanText + '...' );
          break;
        } else tspanText += (word + options.separator);
      }
    } else {
      tspan.text( text );
    }
  });
};

d3.selection.prototype.td = function(duration, delay) {
  if ( duration ) return this.transition().duration( duration ).delay( delay || 0 );
  else return this;
};
