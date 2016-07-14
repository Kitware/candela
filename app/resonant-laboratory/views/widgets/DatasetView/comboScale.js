class ComboScale {
  constructor (view, attrName, datasetDetails, idealWidth) {
    this.emSize = view.layout.emSize;
    this.leftAxisPadding = 3 * this.emSize;
    this.height = 6 * this.emSize;

    // The x scale is a funky one - we may (or may not) have an ordinal chunk
    // and a categorical chunk on the same scale. We want to try to use the
    // available horizontal space, but don't let bars get smaller than 1em
    // wide. Ordinal bars will be mashed together, with 0.25 * barSize of padding
    // on either side of the whole set, whereas categorical bars are spaced out
    // with 0.25 padding on both sides for each individual bar. In addition to
    // drawing, we also need to translate interactions to their nearest bar
    // (TODO: support sub-bin dragging in the ordinal section).
    // Consequently, we write our own scale functions instead of using d3.scale
    // (we need to be able to invert ordinal scales, and decide which range we're
    // actually dealing with)

    // The y scale needs to be independently adjustable; we need to keep track
    // of a custom max y, as well as the actual max value of the data
    this.customYmax = null;

    this.update(attrName, datasetDetails, idealWidth);
  }
  update (attrName, datasetDetails, idealWidth) {
    this.coerceToType = datasetDetails.datasetObj.getAttributeType(
      datasetDetails.schema, attrName);
    this.overviewHistogram = datasetDetails.overviewHistogram[attrName];
    this.filteredHistogram = datasetDetails.filteredHistogram[attrName];
    this.pageHistogram = datasetDetails.pageHistogram[attrName];

    this.dividerIndex = undefined;
    this.dividerPosition = undefined;
    this.realYmax = 0;

    this.ordinalBinCount = 0;
    this.categoricalBinCount = 0;
    this.lowBound;
    this.highBound;
    this.categoricalLookup = {};
    this.overviewLabelLookup = {};
    this.filteredLabelLookup = {};
    this.pageLabelLookup = {};

    // First, how many bins are ordinal vs categorical, and what's the
    // overall ordinal range (if there is one)? Where do we encounter
    // the first categorical value? While we're at it, determine the
    // real max vertical count, and construct bin lookup tables for
    // each histogram.
    this.overviewHistogram.forEach((bin, index) => {
      if (bin.hasOwnProperty('lowBound') && bin.hasOwnProperty('highBound')) {
        this.ordinalBinCount += 1;
        if (this.lowBound === undefined || bin.lowBound < this.lowBound) {
          this.lowBound = bin.lowBound;
        }
        if (this.highBound === undefined || bin.highBound > this.highBound) {
          this.highBound = bin.highBound;
        }
      } else {
        if (this.dividerIndex === undefined) {
          // The server will return all ordinal bins first
          this.dividerIndex = this.ordinalBinCount;
        }
        this.categoricalBinCount += 1;
        this.categoricalLookup[bin.label] = index;
      }
      this.overviewLabelLookup[bin.label] = index;
      this.realYmax = Math.max(this.realYmax, bin.count);
    });
    datasetDetails.filteredHistogram[attrName].forEach((bin, index) => {
      this.filteredLabelLookup[bin.label] = index;
    });
    datasetDetails.pageHistogram[attrName].forEach((bin, index) => {
      this.pageLabelLookup[bin.label] = index;
    });

    // If the new data is shorter than the previous custom
    // customYmax, just clear the custom customYmax
    if (this.customYmax !== null && this.customYmax > this.realYmax) {
      this.customYmax = null;
    }

    // Okay, now for the x scale...
    this.width = idealWidth - this.leftAxisPadding;
    this.barSize = Math.max(this.emSize,
      this.width / (0.5 + this.ordinalBinCount + 1.5 * this.categoricalBinCount));
    this.barSize = Math.min(3 * this.emSize, this.barSize);
    this.width = this.leftAxisPadding +
      this.barSize * (0.5 + this.ordinalBinCount + 1.5 * this.categoricalBinCount);

    if (this.categoricalBinCount === 0) {
      this.dividerIndex = this.ordinalBinCount;
    }
    this.dividerPosition = this.leftAxisPadding + this.barSize * (0.5 + this.ordinalBinCount);
  }
  binForward (binNo) {
    // Given a bin number, calculate the center of its bar
    if (binNo < this.dividerIndex) {
      // Ordinal bin
      return this.leftAxisPadding + this.barSize * (0.75 + binNo);
    } else {
      // Categorical bin
      return this.dividerPosition + this.barSize * (1.5 * (binNo - this.dividerIndex) + 0.75);
    }
  }
  binInverse (position) {
    // Given a screen position, calculate the closest bin number
    if (position < this.dividerPosition) {
      // Ordinal bin
      position -= this.leftAxisPadding + 0.75 * this.barSize;
      return Math.round(position / this.ordinalBinCount);
    } else {
      // Categorical bin
      position -= this.dividerPosition + 0.75 * this.barSize;
      return Math.round(position / (1.5 * this.categoricalBinCount));
    }
  }
  valueToBin (value) {
    // Given a value, calculate the bin number
    // WARNING: similar logic exists in server/foreignCode/histogram_map.js
    // changes here should also be adapted there.
    if (value in this.categoricalLookup) {
      return this.categoricalLookup[value];
    } else {
      if (this.coerceToType === 'integer' || this.coerceToType === 'number') {
        return Math.floor(this.ordinalBinCount *
          (value - this.lowBound) / (this.highBound - this.lowBound));
      } else if (this.coerceToType === 'string') {
        // TODO: ordinal binning of strings (lexographic)
        return 0;
      } else if (this.coerceToType === 'date') {
        // TODO: ordinal binning of dates
        return 0;
      }
    }
  }
  labelToBin (value, histogram) {
    // Given a bin label and histogram name, get the bin number
    let lookup;
    if (histogram === 'page') {
      lookup = this.pageLabelLookup;
    } else if (histogram === 'filtered') {
      lookup = this.filteredLabelLookup;
    } else {  // default: return the overview label index
      lookup = this.overviewLabelLookup;
    }
    if (!(value in lookup)) {
      return undefined;
    } else {
      return lookup[value];
    }
  }
  labelToCount (value, histogram) {
    // Given a bin label and histogram name, get the bin number
    let lookup;
    if (histogram === 'page') {
      lookup = this.pageLabelLookup;
      histogram = this.pageHistogram;
    } else if (histogram === 'filtered') {
      lookup = this.filteredLabelLookup;
      histogram = this.filteredHistogram;
    } else {  // default: return the overview count
      lookup = this.overviewLabelLookup;
      histogram = this.overviewHistogram;
    }
    if (!(value in lookup)) {
      return 0;
    } else {
      return histogram[lookup[value]].count;
    }
  }
  getBinRect (binLabel, histogram) {
    let barHeight = this.y(this.labelToCount(binLabel, histogram));
    return {
      x: -this.barSize / 2,
      y: this.height - barHeight,
      width: this.barSize,
      height: barHeight
    };
  }
  y (value) {
    return this.height * value / this.yMax;
  }
  get yMax () {
    return this.customYmax === null ? this.realYmax : this.customYmax;
  }
  set yMax (value) {
    this.customYmax = value;
  }
}
export default ComboScale;
