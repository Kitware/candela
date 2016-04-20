/*
  Quick shim to take an SVG text element, and rewrap its text
  into tspans (any previous tspans are removed)
*/

import d3 from 'd3';

export default function rewrap(textElement, pxWidth, emLeading) {
  let text = textElement.textContent;
  text = text.split(/\s+/);
  let container = d3.select(textElement).text('');
  
  let currentTspan = container.append('tspan')
    .attr('x', 0)
    .attr('y', 0);
  let currentY = 0;
  
  text.forEach(word => {
    let currentText = currentTspan.text();
    currentTspan.text(currentTspan + ' ' + word);
    if (currentTspan.node().getComputedTextLength() > pxWidth) {
      currentTspan.text(currentText);
      currentY += emLeading;
      currentTspan = container.append('text')
        .attr('x', 0)
        .attr('y', currentY + 'em');
      currentTspan.text(word);
    }
  });
}
