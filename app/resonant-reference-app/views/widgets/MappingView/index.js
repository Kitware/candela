import Backbone from 'backbone';
import myTemplate from './index.jade';
import candela from '../../../../../src';

let MappingView = Backbone.View.extend({
  initialize: function () {
  },
  render: function () {
    const spec = candela.components.Scatter.options;
    const fields = spec.filter((opt) => opt.selector && opt.selector[0] === 'field');

    this.$el.html(myTemplate({
      fieldOpts: fields
    }));

    this.$('.mapping-update').on('click', () => {
      const names = this.$('.field').map((i, e) => ({
        name: $(e).attr('name'),
        val: $(e).val()
      })).get();

      console.log(names);
    });
  }
});

export default MappingView;
