import './uploadStyle.scss';
let girder = window.girder;

const SUPPORTED_FORMATS = {
  'csv': 'csv',
  'tsv': 'csv',
  'json': 'json',
  'text/csv': 'csv',
  'text/tsv': 'csv',
  'application/json': 'json'
};

let UploadView = girder.views.UploadWidget.extend({
  initialize: function (options) {
    options.folder = window.mainPage.currentUser.privateFolder;
    options.modal = false;
    options.title = null;
    girder.views.UploadWidget.prototype.initialize.apply(this, [options]);
    this.datasetLibrary = options.datasetLibrary;

    this.listenTo(this, 'g:filesChanged', () => {
      this.validateFiles();
    });
    this.listenTo(this, 'g:uploadFinished', () => {
      this.finishUpload();
    });
  },
  render: function () {
    girder.views.UploadWidget.prototype.render.apply(this, arguments);

    // For now, only support uploading one file at a time
    this.$el.find('#g-files').prop('multiple', false);
  },
  setUploadEnabled: function (state) {
    // Override girder's function so that we actually set the button as really
    // disabled, not just attaching a 'disabled' class
    this.$el.find('.g-start-upload').prop('disabled', !state);
  },
  validateFiles: function () {
    let fileType = null;
    if (this.files.length > 0) {
      let ext = this.files[0].type;
      if (!ext && this.files[0].name.indexOf('.') !== -1) {
        ext = this.files[0].name.split('.').slice(-1).toLowerCase();
      }
      if (ext && ext in SUPPORTED_FORMATS) {
        fileType = SUPPORTED_FORMATS[fileType];
      }
    }
    if (fileType) {
      this.datasetLibrary.hideFileTypeWarning();
      this.setUploadEnabled(true);
    } else {
      this.datasetLibrary.showFileTypeWarning();
      this.setUploadEnabled(false);
    }
  },
  finishUpload: function () {
    let itemId = this.currentFile.get('itemId');
    this.datasetLibrary.createGirderLink(itemId);
  }
});

export default UploadView;
