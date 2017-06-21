(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3-selection"));
	else if(typeof define === 'function' && define.amd)
		define(["d3-selection"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("d3-selection"));
	else
		root["candela"] = factory(root["d3-selection"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _VisComponent = __webpack_require__(1);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var components = {};

	var register = function register(component, name) {
	  if (name === undefined) {
	    name = component.name;
	  }

	  if (components.hasOwnProperty(name)) {
	    throw new Error('fatal: component "' + name + '" already exists');
	  }

	  components[name] = component;
	};

	var unregister = function unregister(name) {
	  if (components.hasOwnProperty(name)) {
	    delete components[name];
	  }
	};

	var unregisterAll = function unregisterAll() {
	  Object.keys(components).forEach(unregister);
	};

	var mixins = {};

	var registerMixin = function registerMixin(mixin, name) {
	  if (name === undefined) {
	    name = mixin.name;
	  }

	  if (mixins.hasOwnProperty(name)) {
	    throw new Error('fatal: mixin "' + name + '" already exists');
	  }

	  mixins[name] = mixin;
	};

	var unregisterMixin = function unregisterMixin(name) {
	  if (mixins.hasOwnProperty(name)) {
	    delete mixins[name];
	  }
	};

	var unregisterMixinAll = function unregisterMixinAll() {
	  Object.keys(mixins).forEach(unregisterMixin);
	};

	module.exports = {
	  components: components,
	  register: register,
	  unregister: unregister,
	  unregisterAll: unregisterAll,
	  mixins: mixins,
	  registerMixin: registerMixin,
	  unregisterMixin: unregisterMixin,
	  unregisterMixinAll: unregisterMixinAll,
	  VisComponent: _VisComponent2.default
	};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _d3Selection = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var VisComponent = function () {
	  function VisComponent(el) {
	    _classCallCheck(this, VisComponent);

	    if (!el) {
	      throw new Error('"el" is a required argument');
	    }

	    this.el = el;
	  }

	  _createClass(VisComponent, [{
	    key: 'render',
	    value: function render() {
	      throw new Error('"render() is pure abstract"');
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      return Promise.resolve(this);
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.empty();
	    }
	  }, {
	    key: 'empty',
	    value: function empty() {
	      (0, _d3Selection.select)(this.el).selectAll('*').remove();
	    }
	  }, {
	    key: 'serializationFormats',
	    get: function get() {
	      return [];
	    }
	  }]);

	  return VisComponent;
	}();

	exports.default = VisComponent;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ])
});
;