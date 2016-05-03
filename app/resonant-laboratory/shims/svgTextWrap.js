/*
  Quick shim to take an SVG text element, and rewrap its text
  into tspans (any previous tspans are removed)
*/

import d3 from 'd3';

export default function rewrap (textElement, pxWidth, emLeading) {
  emLeading = emLeading || 1.1;

  let textAnchor = textElement.getAttribute('text-anchor') || 'start';

  let text = textElement.textContent;
  let words = text.split(/\s+/);
  if (words.length === 0) {
    return;
  }
  let container = d3.select(textElement).text('');

  let lineLengths = [0];

  // First pass: figure out which words go on which lines

  // Start with the first word
  let currentTspan = container.append('tspan')
    .text(words[0]);

  words.forEach((word, index) => {
    // Add the word to the tspan
    let currentText = currentTspan.text();
    if (index === 0) {
      currentTspan.text(word);
    } else {
      currentTspan.text(currentText + ' ' + word);
    }

    // How wide is the line now?
    let length = currentTspan.node().getComputedTextLength();

    // Has it exceeded the space that we allow?
    if (length > pxWidth) {
      // Revert to the text we had before, and start it on a new line
      currentTspan.text(currentText);
      currentTspan = container.append('tspan').text(word);
      // Store the single word's length
      lineLengths.push(currentTspan.node().getComputedTextLength());
    } else {
      // Update the length of this line
      lineLengths[lineLengths.length - 1] = length;
    }
  });

  // Second pass: line up each row appropriately
  container.selectAll('tspan')
    // Apply the leading
    .attr('dy', emLeading + 'em')
    // Align horizontally
    .attr('dx', function (d, index) {
      if (index === 0) {
        // Don't move the first line anywhere
        return '0px';
      } else if (textAnchor === 'start') {
        // scoot the line back the
        // length of the previous line
        return -lineLengths[index - 1];
      } else if (textAnchor === 'middle') {
        // scoot the line back half the
        // length of the previous line,
        // as well as half the length of
        // the current line
        return -(lineLengths[index - 1] +
                 lineLengths[index]) / 2;
      } else { // textAnchor === 'end'
        // scoot the line back the length
        // of the current line
        return -lineLengths[index];
      }
    });
}
