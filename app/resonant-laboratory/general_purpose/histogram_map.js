/* globals emit, params, findBinLabel */

var dataRow = this;
emit('__passedFilters__', {
  histogram: [{
    count: 1,
    label: 'count'
  }]
});
var attrName;
for (attrName in dataRow) {
  if (dataRow.hasOwnProperty(attrName)) {
    emit(attrName, {
      histogram: [{
        count: 1,
        label: findBinLabel(dataRow[attrName],
          params.binSettings[attrName].coerceToType,
          params.binSettings[attrName].lowBound,
          params.binSettings[attrName].highBound,
          params.binSettings[attrName].specialBins,
          params.binSettings[attrName].ordinalBins)
      }]
    });
  }
}
