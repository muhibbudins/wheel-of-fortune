(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WheelOfFortune"] = factory();
	else
		root["WheelOfFortune"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ({

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = __webpack_require__(14);

var _axios2 = _interopRequireDefault(_axios);

var _svg = __webpack_require__(33);

var _svg2 = _interopRequireDefault(_svg);

var _domtastic = __webpack_require__(34);

var _domtastic2 = _interopRequireDefault(_domtastic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WheelOfFortune = function () {
  function WheelOfFortune(config) {
    _classCallCheck(this, WheelOfFortune);

    if (!config.wheel) throw Error('Source of wheel must be defined');
    this.image = config.wheel;

    if (!config.pieces) throw Error('Pieces of wheel must be defined');
    this.pieces = config.pieces;

    this.selector = (0, _domtastic2.default)('#wheel');
    this.draw = (0, _svg2.default)(this.selector[0]);
    this.source = null;
    this.degree = 7200;
    this.clicked = 0;

    this._isPlaying = false;
    this._isAnimating = false;
    this._isEnded = false;

    this.init();
  }

  /**
   * Initialize Wheel
   */

  _createClass(WheelOfFortune, [{
    key: 'placeImage',
    value: function placeImage() {
      this.draw.svg(this.source);
    }
  }, {
    key: 'inject',
    value: function inject(maximumDegree) {
      var styleEl = document.createElement('style'),
          styleSheet;

      // Append style element to head
      document.head.appendChild(styleEl);

      // Grab style sheet
      styleSheet = styleEl.sheet;

      var rule = 'WOFAnimate {\n      100% {\n        -webkit-transform: rotate(' + maximumDegree + 'deg);\n                transform: rotate(' + maximumDegree + 'deg);\n      }\n    }';

      if (CSSRule.KEYFRAMES_RULE) {
        // W3C
        styleSheet.insertRule('@keyframes ' + rule, styleSheet.cssRules.length);
      } else if (CSSRule.WEBKIT_KEYFRAMES_RULE) {
        // WebKit
        styleSheet.insertRule('@-webkit-keyframes ' + rule, styleSheet.cssRules.length);
      }
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      _axios2.default.get(this.image).then(function (_ref) {
        var data = _ref.data;

        _this.source = data;

        _this.placeImage();
      });
    }

    /**
     * Getting gift
     */

  }, {
    key: 'random',
    value: function random() {
      var min = 0;
      var max = this.pieces.length - 1;

      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }, {
    key: 'gift',
    value: function gift() {
      return this.pieces[this.random()];
    }

    /**
     * Running Wheel
     */

  }, {
    key: 'calculate',
    value: function calculate(gift) {
      var angle = gift.angle,
          from = gift.from;

      return 360 - (from + angle) + angle / 2;
    }
  }, {
    key: 'run',
    value: function run() {
      // console.log('Playing!')
      this._isPlaying = !this._isPlaying;
      var gift = this.gift();
      var angle = this.calculate(gift);
      var count = 0;
      var maximumDegree = 7200 + angle;

      this.inject(maximumDegree);

      // console.log(gift)

      this.selector.addClass('wof-animate');
    }
  }]);

  return WheelOfFortune;
}();

exports.default = WheelOfFortune;

/***/ }),

/***/ 14:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/katana/Sites/wheel-of-fortune/node_modules/axios/index.js'");

/***/ }),

/***/ 33:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/katana/Sites/wheel-of-fortune/node_modules/svg.js/dist/svg.js'");

/***/ }),

/***/ 34:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/katana/Sites/wheel-of-fortune/node_modules/domtastic/src/index.js'");

/***/ })

/******/ })["default"];
});