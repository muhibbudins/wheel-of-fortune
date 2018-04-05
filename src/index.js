import axios from 'axios';
import svg from 'svg.js';
import _ from 'lodash';
import './index.scss';

/**
 * Private property for pieces
 */
let Pieces = {};

/**
 * Wheel Of Fortune
 * Simple wheel of fortune with specific angle, build with ES6, Webpack and SASS
 * @version 1.0
 * @author Muhibbudin Suretno <muhibbudinsuretno1@gmail.com>
 * @license MIT
 * https://github.com/muhibbudins/wheel-of-fortune
 */
export default class WheelOfFortune {
  /**
   * Create base configuration
   * @param {Object} config
   */
  constructor(config) {
    /**
     * Set configuration of pieces
     */
    if (!config.pieces) throw Error('Pieces of wheel must be defined');
    Pieces = config.pieces;

    /**
     * Set wheel image
     */
    if (!config.wheel) throw Error('Source of wheel must be defined');
    this.image = config.wheel;

    /**
     * Set configuration of pointer
     */
    if (!config.caretPosition) throw Error('Caret position must be defined');
    this.caret = config.caretPosition;

    /**
     * Set probability config
     */
    if (config.probability) {
      this.probability = true;
    }

    /**
     * Set maximum spinning config
     */
    if (config.maximumSpin) {
      this.maximumSpin = config.maximumSpin;
    }

    /**
     * Set default configuration
     */
    this.wheel = document.querySelector('.wof-wheel');
    this.degrees = 7200;
    this.spinning = 0;
    this.playing = false;
    this.ended = true;

    /**
     * If onFinish event defined
     */
    if (config.onFinish) {
      this.onFinish = config.onFinish;
    }

    /**
     * If startButton defined
     */
    if (config.startButton) {
      this.startButton = config.startButton;
      this.startButton.addEventListener('click', () => this.loopStart(), false);
    }

    /**
     * If resetButton defined
     */
    if (config.resetButton) {
      this.resetButton = config.resetButton;
      this.resetButton.addEventListener('click', () => {
        if (!this.playing) {
          this.destroy();
        }
      }, false);
    }

    /**
     * Initialize wheel
     */
    this.initialize();
    this.setPointer();

    /**
     * Bind trigger to start wheel
     */
    let disableTrigger = config.disableTrigger ? config.disableTrigger : false;

    if (!disableTrigger) {
      let wofTrigger = document.querySelector('.wof-trigger');

      wofTrigger.addEventListener('click', () => this.loopStart(), false);
    }
  }

  /**
   * Initialize Wheel
   */
  initialize() {
    if (this.image.indexOf('svg') > -1) {
      axios.get(this.image).then(({ data }) => {
        this.drawSVG(svg(this.wheel), data);
      });
    } else {
      this.drawImage(this.image);
    }
  }

  /**
   * Draw SVG image
   * @param {XML} image
   */
  drawSVG(selector, image) {
    selector.svg(image);
  }

  /**
   * Draw binary image
   * @param {Link} source
   */
  drawImage(source) {
    let image = document.createElement('img');

    image.src = source;

    this.wheel.append(image);
  }

  /**
   * Set rotation animation
   */
  setKeyframe(degrees, time) {
    let styleEl = document.createElement('style'), styleSheet;

    // Append style element to head
    document.head.appendChild(styleEl);

    // Grab style sheet
    styleSheet = styleEl.sheet;

    let rule = `WOFAnimate {
      100% {
        -webkit-transform: rotate(${ degrees }deg);
                transform: rotate(${ degrees }deg);
      }
    }`;

    let rule2 = `.wof-wheel_play {
      -webkit-animation: WOFAnimate ${ time }s cubic-bezier(0.4, 0.2, 0, 1) 0s 1;
              animation: WOFAnimate ${ time }s cubic-bezier(0.4, 0.2, 0, 1) 0s 1;
      -webkit-animation-fill-mode: forwards;
              animation-fill-mode: forwards;
    }`;

    /**
     * Insert keyframe by CSS Rule
     */
    if (CSSRule.KEYFRAMES_RULE) { // W3C
      styleSheet.insertRule(`@keyframes ${rule}`, styleSheet.cssRules.length);
    } else if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
      styleSheet.insertRule(`@-webkit-keyframes ${rule}`, styleSheet.cssRules.length);
    }
    styleSheet.insertRule(`${rule2}`, styleSheet.cssRules.length);
  }

  /**
   * Set pointer position
   */
  setPointer() {
    let caretPosition = {
      'top': {
        className: 'wof-pointer-top',
        angle: 90
      },
      'right': {
        className: 'wof-pointer-right',
        angle: 0
      },
      'left': {
        className: 'wof-pointer-left',
        angle: 180
      },
      'bottom': {
        className: 'wof-pointer-bottom',
        angle: 270
      }
    };

    this.caretPosition = caretPosition[this.caret];
    let pointer = document.querySelector('.wof-pointer');

    pointer.classList.add(this.caretPosition.className);
  }

  /**
   * Function to get a winner piece
   */
  getWinner() {
    /**
     * If winner algorithm using Probability Algorithm
     */
    if (this.probability) {
      let list = Array.from(Pieces.map(item => item.angle));
      let weight = Array.from(Pieces.map(item => item.prob));
      let piece = [];
      let generate;
      let randomNum;

      /**
       * Convert object of weight probability to weighed array
       * @param {Array} list
       * @param {Array} weight
       */
      let convertToWeight = (list, weight) => {
        let weighedList = [];
        let lastMultiple = 0;
        let temporary = [];
        let cycle = 0;
        let multiples;

        /**
          * Loop all defining probability
          */
        for (let i = 0; i < weight.length; i++) {
          multiples = weight[i];

          /**
            * Create temporary data
            */
          let tempObject = {};

          tempObject['index'] = i;
          tempObject['start'] = cycle < 1 ? lastMultiple : lastMultiple + 1;
          tempObject['last'] = lastMultiple + multiples;
          tempObject['piece'] = Pieces[i];

          temporary.push(tempObject);

          /**
            * Update piece position by multiplication
            */
          lastMultiple = lastMultiple + multiples;
          cycle++;

          /**
            * Loop every probability by multiplication weight
            */
          for (let j = 0; j < multiples; j++) {
            weighedList.push(list[i]);
          }
        }

        /**
          * Return weight and temporary data
          */
        return {
          weight: weighedList,
          temporary: temporary
        };
      };

      /**
       * Get conversion of object weight probability
       */
      generate = convertToWeight(list, weight);

      /**
       * Get random number by weight generated weight
       */
      randomNum = this.getRandom(0, generate.weight.length);

      /**
       * Loop all temporary data
       */
      generate.temporary.map(item => {
        /**
         * Get pieces by probability position
         */
        if (randomNum >= item.start && randomNum <= item.last) {
          piece = item.piece;
        }
      });

      /**
       * Return piece
       */
      return piece;
    }

    /**
     * Use default random algorithm
     */

    let sorted = _.orderBy(Pieces, 'angle', 'desc');
    let list = Array.from(Pieces.map(item => item.angle)).sort().reverse();

    /**
     * Get random number
     */
    let index = Math.floor(Math.random() * list.length);

    /**
     * Return piece
     */
    return sorted[index];
  }

  /**
   * Get random number
   * @param {Number} min
   * @param {Number} max
   */
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Calculate last rotation angle by pieces position
   * @param {Object} gift
   */
  getAngle(gift) {
    let angle = gift.angle;
    let from = gift.from;

    // Full degrees - (start of arc + arc by angle) + (angle / 2) - pointer position
    return (360 - (from + angle)) + (angle / 2) - this.caretPosition.angle;
  }

  getAdditional() {
    let degrees = this.getRandom(5, 10) * 360;
    let time = this.getRandom(1, 4) + 8;

    return {
      degrees: degrees,
      time: time
    };
  }

  /**
   * Destroy Wheel
   */
  destroy() {
    this.playing = false;
    this.wheel.classList.remove('wof-wheel_play');
  }

  /**
   * Warning for maximum spinning
   */
  maximumWarning() {
    throw Error(`Maximum spinning is ${this.maximumSpin}x`);
  }

  /**
   * Loop start event
   */
  loopStart() {
    if (this.spinning === 0) {
      return this.start();
    }

    if (this.ended) {
      /**
       * If maximum spin is define
       */
      if (this.maximumSpin && this.spinning === this.maximumSpin) {
        this.maximumWarning();
        return false;
      }

      this.destroy();
      setTimeout(() => this.start(), 200);
    }

    return true;
  }

  /**
   * Start Wheel
   */
  /* eslint-disable */
  start() {
    /**
     * If wheel is playing
     */
    if (this.playing) {
      return false;
    }

    /**
     * If maximum spin is define
     */
    if (this.maximumSpin && this.spinning === this.maximumSpin) {
      this.maximumWarning();
      return false;
    }

    this.spinning++;
    this.playing = true;
    this.ended = false;

    let gift = this.getWinner();
    let additional = this.getAdditional();
    let angle = this.getAngle(gift);
    let degrees = (this.degrees + additional.degrees + angle);

    this.setKeyframe(degrees, additional.time);
    this.wheel.classList.add('wof-wheel_play');

    setTimeout(() => {
      this.onFinish(gift);
      this.playing = false;
      this.ended = true;
    }, (additional.time * 1000));
  }
}
