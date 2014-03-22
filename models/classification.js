// Generated by CoffeeScript 1.6.3
(function() {
  var $, Api, BaseModel, Classification, Favorite, LanguageManager, RESOLVED_STATE, Recent, _base, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  BaseModel = ((_ref = window.zooniverse) != null ? (_ref1 = _ref.models) != null ? _ref1.BaseModel : void 0 : void 0) || require('./base-model');

  Api = ((_ref2 = window.zooniverse) != null ? _ref2.Api : void 0) || require('../lib/api');

  Recent = ((_ref3 = window.zooniverse) != null ? (_ref4 = _ref3.models) != null ? _ref4.Recent : void 0 : void 0) || require('../models/recent');

  Favorite = ((_ref5 = window.zooniverse) != null ? (_ref6 = _ref5.models) != null ? _ref6.Favorite : void 0 : void 0) || require('../models/favorite');

  LanguageManager = ((_ref7 = window.zooniverse) != null ? _ref7.LanguageManager : void 0) || require('../lib/language-manager');

  $ = window.jQuery;

  RESOLVED_STATE = (new $.Deferred).resolve().state();

  Classification = (function(_super) {
    __extends(Classification, _super);

    Classification.pending = JSON.parse(localStorage.getItem('pending-classifications')) || [];

    Classification.sentThisSession = 0;

    Classification.sendPending = function() {
      var classification, pendingPosts, _i, _len, _ref8, _results,
        _this = this;
      if (this.pending.length === 0) {
        return;
      }
      this.trigger('sending-pending', [classification]);
      pendingPosts = [];
      _ref8 = this.pending;
      _results = [];
      for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
        classification = _ref8[_i];
        _results.push((function(classification) {
          var latePost;
          latePost = Api.current.post(classification.url, classification);
          pendingPosts.push(latePost);
          latePost.done(function(response) {
            var favorite, id;
            _this.trigger('send-pending', [classification]);
            if (classification.favorite) {
              favorite = new Favorite({
                subjects: (function() {
                  var _j, _len1, _ref9, _results1;
                  _ref9 = classification.subject_ids;
                  _results1 = [];
                  for (_j = 0, _len1 = _ref9.length; _j < _len1; _j++) {
                    id = _ref9[_j];
                    _results1.push({
                      id: id
                    });
                  }
                  return _results1;
                })()
              });
              return favorite.send();
            }
          });
          latePost.fail(function() {
            return _this.trigger('send-pending-fail', [classification]);
          });
          return $.when.apply($, pendingPosts).always(function() {
            var i, _j, _ref9;
            for (i = _j = _ref9 = pendingPosts.length - 1; _ref9 <= 0 ? _j <= 0 : _j >= 0; i = _ref9 <= 0 ? ++_j : --_j) {
              if (pendingPosts[i].state() === RESOLVED_STATE) {
                _this.pending.splice(i, 1);
              }
            }
            return localStorage.setItem('pending-classifications', JSON.stringify(_this.pending));
          });
        })(classification));
      }
      return _results;
    };

    Classification.prototype.subjects = [];

    Classification.prototype.subject = null;

    Classification.prototype.annotations = null;

    Classification.prototype.favorite = false;

    Classification.prototype.generic = null;

    Classification.prototype.started_at = null;

    Classification.prototype.finished_at = null;

    Classification.prototype.user_agent = null;

    function Classification() {
      Classification.__super__.constructor.apply(this, arguments);
      if (this.annotations == null) {
        this.annotations = [];
      }
      this.generic = {};
      this.started_at = (new Date).toUTCString();
      this.user_agent = window.navigator.userAgent;
    }

    Classification.prototype.normalizeSubjects = function() {
      if (this.subjects.length > 0) {
        return this.subject || (this.subject = this.subjects[0]);
      } else {
        return this.subjects = [this.subject];
      }
    };

    Classification.prototype.annotate = function(annotation) {
      this.annotations.push(annotation);
      return annotation;
    };

    Classification.prototype.removeAnnotation = function(annotation) {
      var a, i, _i, _len, _ref8;
      _ref8 = this.annotations;
      for (i = _i = 0, _len = _ref8.length; _i < _len; i = ++_i) {
        a = _ref8[i];
        if (a === annotation) {
          return this.annotations.splice(i, 1);
        }
      }
    };

    Classification.prototype.isTutorial = function() {
      var subject;
      this.normalizeSubjects();
      return __indexOf.call((function() {
        var _i, _len, _ref8, _ref9, _results;
        _ref8 = this.subjects;
        _results = [];
        for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
          subject = _ref8[_i];
          _results.push((_ref9 = subject.metadata) != null ? _ref9.tutorial : void 0);
        }
        return _results;
      }).call(this), true) >= 0;
    };

    Classification.prototype.set = function(key, value) {
      this.generic[key] = value;
      return this.trigger('change', [key, value]);
    };

    Classification.prototype.get = function(key) {
      return this.generic[key];
    };

    Classification.prototype.toJSON = function() {
      var annotation, key, output, subject, subject_ids, value, _ref8;
      if (LanguageManager.current != null) {
        this.set('lang', LanguageManager.current.code);
      }
      this.normalizeSubjects();
      subject_ids = (function() {
        var _i, _len, _ref8, _results;
        _ref8 = this.subjects;
        _results = [];
        for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
          subject = _ref8[_i];
          _results.push(subject.id);
        }
        return _results;
      }).call(this);
      output = {
        classification: {
          subject_ids: subject_ids,
          annotations: this.annotations.concat([
            {
              started_at: this.started_at,
              finished_at: this.finished_at
            }, {
              user_agent: this.user_agent
            }
          ])
        }
      };
      _ref8 = this.generic;
      for (key in _ref8) {
        value = _ref8[key];
        annotation = {};
        annotation[key] = value;
        output.classification.annotations.push(annotation);
      }
      if (this.favorite) {
        output.classification.favorite = true;
      }
      return output;
    };

    Classification.prototype.url = function() {
      this.normalizeSubjects();
      return "/projects/" + Api.current.project + "/workflows/" + this.subjects[0].workflow_ids[0] + "/classifications";
    };

    Classification.prototype.send = function(done, fail) {
      var post, _ref8,
        _this = this;
      if (!this.isTutorial()) {
        this.constructor.sentThisSession += 1;
      }
      this.finished_at = (new Date).toUTCString();
      post = (_ref8 = Api.current).post.apply(_ref8, [this.url(), this.toJSON()].concat(__slice.call(arguments)));
      post.done(function() {
        _this.makeRecent();
        return _this.constructor.sendPending();
      });
      post.fail(function() {
        return _this.makePending();
      });
      return this.trigger('send');
    };

    Classification.prototype.makePending = function() {
      var asJSON;
      asJSON = this.toJSON();
      asJSON.url = this.url();
      this.constructor.pending.push(asJSON);
      localStorage.setItem('pending-classifications', JSON.stringify(this.constructor.pending));
      return this.trigger('pending');
    };

    Classification.prototype.makeRecent = function() {
      var favorite, recent, subject, _i, _len, _ref8, _results;
      this.normalizeSubjects();
      _ref8 = this.subjects;
      _results = [];
      for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
        subject = _ref8[_i];
        recent = new Recent({
          subjects: [subject]
        });
        recent.trigger('from-classification');
        if (this.favorite) {
          favorite = new Favorite({
            subjects: [subject]
          });
          _results.push(favorite.trigger('from-classification'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Classification;

  })(BaseModel);

  if (window.zooniverse == null) {
    window.zooniverse = {};
  }

  if ((_base = window.zooniverse).models == null) {
    _base.models = {};
  }

  window.zooniverse.models.Classification = Classification;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Classification;
  }

}).call(this);
