import $ from 'jquery';
import datalib from 'datalib';
import d3 from 'd3';
import LineUpJS from 'LineUpJS/dist/LineUpJS';
import 'LineUpJS/css/style.css';
import 'LineUpJS/demo/css/style-demo.css';
import 'font-awesome-webpack';

export default class LineUp {
  static get spec () {
    return {
      options: [
        {
          name: 'data',
          type: 'table',
          format: 'objectlist'
        },
        {
          name: 'stacked',
          type: 'boolean',
          format: 'boolean'
        },
        {
          name: 'histograms',
          type: 'boolean',
          format: 'boolean'
        },
        {
          name: 'animation',
          type: 'boolean',
          format: 'boolean'
        }
      ]
    };
  }

  constructor (el, options) {
    this.el = el;
    this.options = options;
    this.lineUpConfig = {
      interaction: {
        tooltips: false
      },
      renderingOptions: {
        animation: options.animation !== undefined ? options.animation : true,
        histograms: options.histograms !== undefined ? options.histograms : true,
        stacked: options.stacked !== undefined ? options.stacked : false
      },
      svgLayout: {
        mode: 'separate',
        rowPadding: 0
      }
    };
  }

  /* Get the width of a column.  If the user has changed the width, scale based
  * on that activity.
  *
  * @param name: name of the lineup.  Used for user settings.
  * @param col: column specification.
  * @param fixed: minimum width for a column.
  */
  lineupGetColumnWidth (name, col, fixed) {
    var width = col.width || 0;
    // var colname = col.column || col.type;
    // /* Get the column scaling based on the user settings, if available */
    // if (actionState.lineupCol && actionState.lineupCol[name] && actionState.lineupCol[name][colname]) {
    //   width = actionState.lineupCol[name][colname] + fixed;
    // }
    var colWidth = width < fixed ? 0 : (width - fixed);
    col.widthBasis = colWidth;
    col.widthFixed = fixed;
    return col.widthBasis;
  }

  /* Adjust the width of the columns in lineup to (a) use the available space,
  * and (b) use the weights selected by the user.
  *
  * @param elem: the element where the lineup is placed.
  * @param name: the name used for this lineup.  Used for tracking user widths.
  * @param spec: the specification for the lineup.  Modified.
  * @param fixed: fixed width used in each column.
  * @returns: relative scale of lineup to available space.
  */
  createLineupAdjustWidth (elem, name, spec, fixed) {
    let total = 0;
    let count = 0;
    let c1;
    let c2;
    // let width = $(elem)[0].getBoundingClientRect().width - $.scrollbarWidth() - fixed;
    let width = $(elem)[0].getBoundingClientRect().width - 30 - fixed;
    let col = spec.dataspec.layout.primary;

    for (c1 = 0; c1 < col.length; c1 += 1) {
      if (col[c1].children) {
        for (c2 = 0; c2 < col[c1].children.length; c2 += 1) {
          count += 1;
          total += this.lineupGetColumnWidth(name, col[c1].children[c2], fixed);
        }
      } else {
        count += 1;
        total += this.lineupGetColumnWidth(name, col[c1], fixed);
      }
    }

    let avail = width - count * fixed;
    let scale = avail / total;
    for (c1 = 0; c1 < col.length; c1 += 1) {
      if (col[c1].children) {
        for (c2 = 0; c2 < col[c1].children.length; c2 += 1) {
          col[c1].children[c2].width = fixed + col[c1].children[c2].widthBasis * scale;
        }
      } else {
        col[c1].width = fixed + col[c1].widthBasis * scale;
      }
    }
    return scale;
  }

  /* Create or recreate a lineup control.
  *
  * @param elem: selector to the parent div wrapper for the control.
  * @param name: name of the control.
  * @param desc: column description.
  * @param dataset: dataset to load.
  * @lineupObj: old lineup object to replace.
  * @sort: if specified, sort by this column.
  * @returns: a lineup control object.
  */
  createLineup (elem, name, desc, dataset, lineupObj, sort) {
    let spec = {};
    spec.name = name;
    spec.dataspec = desc;
    delete spec.dataspec.file;
    delete spec.dataspec.separator;
    spec.dataspec.data = dataset;
    spec.storage = LineUpJS.createLocalStorage(dataset, desc.columns, desc.layout, desc.primaryKey);
    var config = ((lineupObj ? lineupObj.config : $.extend({}, this.lineUpConfig)) || {});
    if (!config.renderingOptions) {
      config.renderingOptions = {};
    }
    var oldAnimation = config.renderingOptions.animation;
    // config.renderingOptions.animation = false;
    var columnFixed = 5;
    var scale = this.createLineupAdjustWidth(elem, name, spec, columnFixed);
    /* Never take the first branch if we always want to regenerate the lineup
    * container.  There is a bug where the columns are not clipped properly,
    * and regeneration works around it.  Both cases bleed memory, I think, and
    * regeneration is worse than update. */
    if (lineupObj && 0) {
      lineupObj.changeDataStorage(spec);
    } else {
      $(elem).empty();
      /* Lineup takes a d3 element */
      lineupObj = LineUpJS.create(spec, d3.select(elem), this.lineUpConfig);
      config = lineupObj.config;
      // lineupObj.dragWeight.on('dragend.docrank', function (evt) {
      //   lineupDragColumnEnd(name, evt);
      // });
    }
    lineupObj['column-scale'] = scale;
    lineupObj['column-fixed'] = columnFixed;
    lineupObj['lineup-key'] = name;
    $(elem).attr('lineup-key', name);
    if (sort) {
      lineupObj.sortBy(sort);
    }
    config.renderingOptions.animation = oldAnimation;
    var fixTooltips = function () {
      for (var i = 0; i < desc.columns.length; i += 1) {
        if (desc.columns[i].description) {
          var label = (desc.columns[i].label || desc.columns[i].column);
          $('title', $(elem + ' .lu-header text.headerLabel:contains("' + label + '")').parent()).text(label + ': ' + desc.columns[i].description);
        }
      }
    };
    /* Try twice to work around some issues */
    window.setTimeout(fixTooltips, 1);
    window.setTimeout(fixTooltips, 1000);
    return lineupObj;
  }

  render () {
    let data = $.extend(true, [], this.options.data);
    if (!data || data.length === 0) {
      return;
    }
    let desc = {
      primaryKey: '__index',
      columns: [],
      layout: {
        primary: []
      }
    };
    let stacked = {
      type: 'stacked',
      label: 'Combined',
      children: []
    };
    let attributes = datalib.type.all(data);
    for (let attr of Object.keys(attributes)) {
      let type = attributes[attr];
      if (type === 'integer' || type === 'boolean' || type === 'date') {
        type = 'number';
      }
      let col = {
        column: attr,
        type: type
      };
      if (type === 'number') {
        col.domain = datalib.extent(data, d => d[attr]);
      }
      desc.columns.push(col);

      let layout = {
        column: attr,
        width: 200
      };
      if (type === 'number') {
        stacked.children.push(layout);
      } else {
        desc.layout.primary.push(layout);
      }
    }
    desc.layout.primary.push(stacked);
    data.forEach((d, i) => {
      d.__index = i;
    });
    this.main = this.createLineup(this.el, 'main', desc, data, this.main, 'Combined');
  }
}
