import './uploadStyle.scss';
let girder = window.girder;

let UploadView = girder.views.UploadWidget.extend({
  initialize: function () {
    girder.views.UploadWidget.prototype.initialize.apply(this, [{
      folder: window.mainPage.currentUser.privateFolder,
      modal: false,
      title: null
    }]);
  },
  render: function () {
    girder.views.UploadWidget.prototype.render.apply(this, arguments);
  }
});

export default UploadView;
