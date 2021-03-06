// Generated by CoffeeScript 1.6.3
(function() {
  var Dialog, LoginForm, User, loginDialog, template, _base;

  if (window.zooniverse == null) {
    window.zooniverse = {};
  }

  if ((_base = window.zooniverse).controllers == null) {
    _base.controllers = {};
  }

  Dialog = zooniverse.controllers.Dialog || require('./dialog');

  LoginForm = zooniverse.controllers.LoginForm || require('./login-form');

  template = zooniverse.views.loginDialog || require('../views/login-dialog');

  User = zooniverse.models.User || require('../models/user');

  loginDialog = new Dialog({
    content: (new LoginForm({
      template: template
    })).el
  });

  User.on('change', function(e, user) {
    if (user != null) {
      return loginDialog.hide();
    }
  });

  window.zooniverse.controllers.loginDialog = loginDialog;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = loginDialog;
  }

}).call(this);
