import {
  Widget
} from '@phosphor/widgets'

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces'

import candela from '@candela/all';

const MIME_TYPE = 'application/vnd.candela+json';

class CandelaWidget extends Widget implements IRenderMime.IRenderer {
  constructor(options: IRenderMime.IRendererOptions) {
    super();
  }

  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    let params = model.data[MIME_TYPE] as any;
    setTimeout(() => {
      console.log(candela);
      this.node.innerHTML = '';
      let vis = new candela.components[params.name](this.node, params.options);
      vis.render();
    }, 1);
    return Promise.resolve();
  }
}

export
const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new CandelaWidget(options)
};

const extension: IRenderMime.IExtension = {
  id: '@candela/jupyterlab',
  rendererFactory,
  rank: 50,
  dataType: 'json',
  documentWidgetFactoryOptions: [{
    name: 'Candela',
    primaryFileType: 'candela',
    fileTypes: ['candela'],
    defaultFor: ['candela'],
  }],
  fileTypes: [{
    mimeTypes: [MIME_TYPE],
    name: 'candela',
    extensions: ['.cd'],
    iconClass: 'jp-MaterialIcon jp-VegaIcon',
  }]
};

export default extension;
