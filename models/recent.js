// Generated by CoffeeScript 1.4.0
(function() {
  var $, Api, BaseModel, Recent, Subject, SubjectForRecent, User, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.zooniverse) == null) {
    window.zooniverse = {};
  }

  if ((_ref1 = (_base = window.zooniverse).models) == null) {
    _base.models = {};
  }

  BaseModel = window.zooniverse.models.BaseModel || require('./base-model');

  Api = window.zooniverse.Api || require('../lib/api');

  User = window.zooniverse.models.User || require('./user');

  Subject = window.zooniverse.models.Subject || require('./subject');

  $ = window.jQuery;

  SubjectForRecent = (function(_super) {

    __extends(SubjectForRecent, _super);

    function SubjectForRecent() {
      return SubjectForRecent.__super__.constructor.apply(this, arguments);
    }

    return SubjectForRecent;

  })(Subject);

  Recent = (function(_super) {

    __extends(Recent, _super);

    Recent.type = 'recent';

    Recent.path = function() {
      var _ref2;
      return "/projects/" + Api.current.project + "/users/" + ((_ref2 = User.current) != null ? _ref2.id : void 0) + "/" + this.type + "s";
    };

    Recent.fetch = function(params, done, fail) {
      var fetcher, request, _ref2,
        _this = this;
      this.trigger('fetching');
      if (typeof params === 'function') {
        _ref2 = [params, done, {}], done = _ref2[0], fail = _ref2[1], params = _ref2[2];
      }
      params = $.extend({
        page: 1,
        per_page: 10
      }, params);
      fetcher = new $.Deferred;
      fetcher.then(done, fail);
      request = Api.current.get(this.path(), params);
      request.done(function(rawRecents) {
        var newRecents, rawRecent;
        newRecents = (function() {
          var _i, _len, _ref3, _results;
          _ref3 = rawRecents.reverse();
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            rawRecent = _ref3[_i];
            _results.push(new this(rawRecent));
          }
          return _results;
        }).call(_this);
        _this.trigger('fetch', [newRecents]);
        return fetcher.resolve(newRecents);
      });
      request.fail(function() {
        _this.trigger('fetch-fail');
        return fetcher.reject.apply(fetcher, arguments);
      });
      return fetcher.promise();
    };

    Recent.clearOnUserChange = function() {
      var self;
      self = this;
      return User.on('change', function() {
        var _results;
        _results = [];
        while (self.count() !== 0) {
          _results.push(self.first().destroy());
        }
        return _results;
      });
    };

    Recent.clearOnUserChange();

    Recent.prototype.subjects = null;

    Recent.prototype.project_id = '';

    Recent.prototype.workflow_id = '';

    Recent.prototype.created_at = '';

    function Recent() {
      var i, subject, _i, _len, _ref2, _ref3;
      Recent.__super__.constructor.apply(this, arguments);
      if ((_ref2 = this.subjects) == null) {
        this.subjects = [];
      }
      this.project_id || (this.project_id = this.subjects[0].project_id);
      this.workflow_id || (this.workflow_id = this.subjects[0].workflow_ids[0]);
      this.created_at || (this.created_at = (new Date).toUTCString());
      _ref3 = this.subjects;
      for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
        subject = _ref3[i];
        this.subjects[i] = new SubjectForRecent(subject);
      }
    }

    return Recent;

  })(BaseModel);

  window.zooniverse.models.Recent = Recent;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Recent;
  }

}).call(this);
