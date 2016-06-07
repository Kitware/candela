import $ from 'jquery';
import datalib from 'datalib';
import d3 from 'd3';
import LineUpJS from 'LineUpJS/src/main.js';
import 'LineUpJS/dist/style.css';
import './index.styl';
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
          name: 'fields',
          type: 'string_list',
          format: 'string_list',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'stacked',
          type: 'boolean',
          format: 'boolean',
          optional: true
        },
        {
          name: 'histograms',
          type: 'boolean',
          format: 'boolean',
          optional: true
        },
        {
          name: 'animation',
          type: 'boolean',
          format: 'boolean',
          optional: true
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
      body: {
        mode: 'separate',
        rowPadding: 0
      },
      /* false to prevent removing columns and other actions */
      manipulative: true
    };
    this.lineupInstances = {};
    this.lineupColumns = {};
    this.lineupRankWidth = 50;  /* from the LineUpJS code */
  }

  /* Get the width of a column.  If the user has changed the width, scale based
  * on that activity.
  *
  * @param name: name of the lineup.  Used for user settings.
  * @param col: column specification.
  * @param fixed: minimum width for a column.
  */
  lineupGetColumnWidth (name, col, fixed) {
    let width = col.width || 0;
    let colname = col.column || col.type;
    /* Get the column scaling based on the user settings, if available */
    if (this.lineupColumns && this.lineupColumns[name] && this.lineupColumns[name][colname]) {
      width = this.lineupColumns[name][colname] + fixed;
    }
    let colWidth = width < fixed ? 0 : (width - fixed);
    if (col === 'rank') {  /* defined in LineUp */
      colWidth = this.lineupRankWidth;
    }
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
    let rankWidth = 0;
    let total = 0;
    let count = 0;
    let c1, c2;
    /* The final width value of 30 is to leave room for a scroll bar. */
    let width = $(elem)[0].getBoundingClientRect().width - fixed * 2 - 30;
    let col = spec.dataspec.layout.primary;
    for (c1 = 0; c1 < col.length; c1 += 1) {
      if (col[c1].children) {
        for (c2 = 0; c2 < col[c1].children.length; c2 += 1) {
          count += 1;
          total += this.lineupGetColumnWidth(name, col[c1].children[c2], fixed);
        }
      } else {
        if (col[c1].type === 'rank') { /* LineUp wants this to be 50 */
          rankWidth = this.lineupRankWidth + fixed;
          continue;
        }
        count += 1;
        total += this.lineupGetColumnWidth(name, col[c1], fixed);
      }
    }
    let avail = width - count * fixed - rankWidth;
    avail -= count + (rankWidth ? 1 : 0); // I'm not sure why this is necessary
    let scale = avail / total;
    for (c1 = 0; c1 < col.length; c1 += 1) {
      if (col[c1].children) {
        for (c2 = 0; c2 < col[c1].children.length; c2 += 1) {
          col[c1].children[c2].width = fixed + col[c1].children[c2].widthBasis * scale;
        }
      } else {
        col[c1].width = fixed + col[c1].widthBasis * scale;
        if (col[c1].type === 'rank') { /* LineUp wants this to be fixed */
          col[c1].width = this.lineupRankWidth + fixed;
        }
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
  * @param lineupObj: old lineup object to replace.
  * @param sort: if specified, sort by this column.
  * @param selectCallback: if present, bind 'selected' to this function.
  * @returns: a lineup control object.
  */
  createLineup (elem, name, desc, dataset, lineupObj, sort, selectCallback) {
    let spec = {};
    spec.name = name;
    spec.dataspec = desc;
    delete spec.dataspec.file;
    delete spec.dataspec.separator;
    spec.dataspec.data = dataset;
    spec.storage = LineUpJS.createLocalStorage(dataset, LineUpJS.deriveColors(desc.columns));
    let config = ((lineupObj ? lineupObj.config : $.extend({}, this.lineUpConfig)) || {});
    if (!config.renderingOptions) {
      config.renderingOptions = {};
    }
    let oldAnimation = config.renderingOptions.animation;
    config.renderingOptions.animation = false;
    let columnFixed = 5;
    let scale = this.createLineupAdjustWidth(elem, name, spec, columnFixed);
    /* Always recreate the control */
    $(elem).empty();
    /* Lineup takes a d3 element */
    lineupObj = LineUpJS.create(spec.storage, d3.select(elem), this.lineUpConfig);
    lineupObj.restore(desc);
    config = lineupObj.config;
    lineupObj.header.dragHandler.on('dragend.lineupWidget', (evt) => {
      this.lineupDragColumnEnd(name, evt);
    });
    lineupObj['column-scale'] = scale;
    lineupObj['column-fixed'] = columnFixed;
    lineupObj['lineup-key'] = name;
    $(elem).attr('lineup-key', name);
    if (sort) {
      let sortColumn;
      $.each(lineupObj.data.getRankings(), function (ridx, ranking) {
        $.each(ranking.flatColumns, function (cidx, column) {
          if (column.label === sort) {
            sortColumn = column.id;
          }
        });
      });
      lineupObj.sortBy(sortColumn !== undefined ? sortColumn : sort);
    }
    lineupObj.changeRenderingOption('animation', oldAnimation);
    let fixTooltips = function () {
      for (var i = 0; i < desc.columns.length; i += 1) {
        if (desc.columns[i].description) {
          let label = (desc.columns[i].label || desc.columns[i].column);
          $('title', $(elem + ' .lu-header text.headerLabel:contains("' + label + '")').parent()).text(label + ': ' + desc.columns[i].description);
        }
      }
    };
    if (selectCallback) {
      lineupObj.on('selectionChanged.lineupWidget', null);
      lineupObj.on('selectionChanged.lineupWidget', function (row) {
        selectCallback(dataset[row]);
      });
    }
    /* Try twice to work around some issues */
    window.setTimeout(fixTooltips, 1);
    window.setTimeout(fixTooltips, 1000);
    this.lineupInstances[name] = lineupObj;
    return lineupObj;
  }

  /* After a column is resized in lineup, record the size it became relative to
   * the scaling we are using.
   *
   * @param name: name of the lineup record we have adjusted.
   */
  lineupDragColumnEnd (name) {
    let c1, c2;
    if (!this.lineupColumns[name]) {
      this.lineupColumns[name] = {};
    }
    let record = this.lineupColumns[name];
    let col = this.lineupInstances[name].dump().rankings[0].columns;
    let scale = this.lineupInstances[name]['column-scale'];
    let fixed = this.lineupInstances[name]['column-fixed'];
    for (c1 = 0; c1 < col.length; c1 += 1) {
      if (col[c1].children) {
        for (c2 = 0; c2 < col[c1].children.length; c2 += 1) {
          record[col[c1].children[c2].desc.split('@')[1]] = (col[c1].children[c2].width - fixed) / scale;
        }
      } else {
        record[col[c1].desc.label ? 'rank' : col[c1].desc.split('@')[1]] = (col[c1].width - fixed) / scale;
      }
    }
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
        primary: [{type: 'rank', width: this.lineupRankWidth}]
      }
    };
    let stacked = {
      type: 'stacked',
      label: 'Combined',
      children: []
    };
    let attributes = datalib.type.all(data);
    /* If fields was specified, use them in order (if they exist as data
     * attributes).  If fields was not specified, use the data attributes. */
    let fields = this.options.fields ? this.options.fields : Object.keys(attributes);
    for (let attr of fields) {
      if (!(attr in attributes)) {
        continue;
      }
      let type = attributes[attr];
      if (type === 'integer' || type === 'date') {
        type = 'number';
      }
      let col = {
        column: attr,
        type: type
      };
      if (type === 'number') {
        col.domain = datalib.extent(data, (d) => d[attr]);
      }
      desc.columns.push(col);

      let layout = {
        column: attr,
        width: 200
      };
      if (type === 'number' || type === 'boolean') {
        stacked.children.push(layout);
      } else {
        desc.layout.primary.push(layout);
      }
    }
    if (stacked.children.length) {
      desc.layout.primary.push(stacked);
    }
    data.forEach((d, i) => {
      d.__index = i;
    });
    let name = 'main';
    this.createLineup(this.el, 'main', desc, data, this.lineupInstances[name], 'Combined');
  }
}
