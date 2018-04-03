import axios from 'axios'
import svg from 'svg.js'
import $ from 'domtastic'
import _ from 'lodash'
import './index.scss'

/**
 * Wheel Of Fortune
 * Simple wheel of fortune with specific angle, build with ES6, Webpack and SASS 
 * 
 * @version 1.0
 * @author Muhibbudin Suretno <muhibbudinsuretno1@gmail.com>
 * @license MIT
 * 
 * https://github.com/muhibbudins/wheel-of-fortune 
 */
export default class WheelOfFortune {
  /**
   * Create base configuration
   * @param {Object} config 
   */
  constructor (config) {
    /**
     * Set wheel image
     */
    if (!config.wheel) throw Error('Source of wheel must be defined')
    this.image = config.wheel

    /**
     * Set configuration of pieces
     */
    if (!config.pieces) throw Error('Pieces of wheel must be defined')
    this.pieces = config.pieces

    /**
     * Set configuration of pointer
     */
    if (!config.caretPosition) throw Error('Caret position must be defined')

    /**
     * 
     */
    this.selector = $('.wof-wheel')
    this.source = null
    this.degrees = 7200
    this.clicked = 0
    this.caretPosition = {
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
    }
    
    this.caretPosition = this.caretPosition[config.caretPosition]
    $('.wof-pointer').addClass(this.caretPosition.className)

    if (config.probability) {
      this.probability = true
    }

    this.isPlaying = false
    this._isEnded = false

    this.initialize()

    $('.wof-trigger').on('click', () => this.start())
  }

  /**
   * Initialize Wheel
   */
  initialize () {
    if (this.image.indexOf('svg') > -1) {
      axios.get(this.image).then(({ data }) => {
        this.source = data
        this.svg = svg(this.selector[0])

        this.drawSVG()
      })
    } else {
      this.drawImage(this.image)
    }
  }

  drawSVG () {
    this.svg.svg(this.source)
  }

  drawImage (source) {
    let image = document.createElement('img')
    image.src = source

    this.selector.append(image)
  }

  /**
   * Setter
   */
  setKeyframe (maximumDegrees) {
    let styleEl = document.createElement('style'),
        styleSheet;
  
    // Append style element to head
    document.head.appendChild(styleEl)

    // Grab style sheet
    styleSheet = styleEl.sheet

    let rule = `WOFAnimate {
      100% {
        -webkit-transform: rotate(${ maximumDegrees }deg);
                transform: rotate(${ maximumDegrees }deg);
      }
    }`

    if (CSSRule.KEYFRAMES_RULE) { // W3C
        styleSheet.insertRule(`@keyframes ${rule}`, styleSheet.cssRules.length)
    } else if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
        styleSheet.insertRule(`@-webkit-keyframes ${rule}`, styleSheet.cssRules.length)
    }
  }

  /**
   * Function to get a winner piece
   */
  getWinner () {
    /**
     * If winner algorithm using Probability Algorithm
     */
    if (this.probability) {
      let list = Array.from(this.pieces.map(item => item.angle)),
          weight = Array.from(this.pieces.map(item => item.prob)),
          piece = [],
          generate, random_num;
      
      /**
       * Convert object of weight probability to weighed array
       * @param {Array} list 
       * @param {Array} weight 
       */
      let convertToWeight = (list, weight) => {
        let weighed_list = [],
            lastMultiple = 0,
            temporary = [],
            cycle = 0, multiples;
        
        /**
         * Loop all defining probability
         */
        for (let i = 0; i < weight.length; i++) {
            multiples = weight[i] * 100

            /**
             * Create temporary data
             */
            let tempObject = {}
            tempObject['index'] = i
            tempObject['start'] = cycle < 1 ? lastMultiple : lastMultiple + 1
            tempObject['last'] = lastMultiple + multiples
            tempObject['piece'] = this.pieces[i]

            temporary.push(tempObject)
            
            /**
             * Update piece position by multiplication
             */
            lastMultiple = lastMultiple + multiples
            cycle++

            /**
             * Loop every probability by multiplication weight
             */
            for (let j = 0; j < multiples; j++) {
                weighed_list.push(list[i])
            }
        }
        
        /**
         * Return weight and temporary data
         */
        return {
          weight: weighed_list,
          temporary: temporary
        }
      }

      /**
       * Get random number
       * @param {Number} min 
       * @param {Number} max 
       */
      let random = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
      }
      
      /**
       * Get conversion of object weight probability
       */
      generate = convertToWeight(list, weight)

      /**
       * Get random number by weight generated weight
       */
      random_num = random(0, generate.weight.length)

      /**
       * Loop all temporary data
       */
      generate.temporary.map(item => {
        /**
         * Get pieces by probability position
         */
        if (random_num >= item.start && random_num <= item.last) {
          piece = item.piece
        }
      })

      /**
       * Return piece
       */
      return piece
    }

    /**
     * Use default random algorithm
     */
    else {
      /**
       * Create sorted array
       */
      let sorted = _.orderBy(this.pieces, 'angle', 'desc')
      let list = Array.from(this.pieces.map(item => item.angle)).sort().reverse()

      /**
       * Get random number
       */
      let index = Math.floor(Math.random() * list.length)
  
      /**
       * Return piece
       */
      return sorted[index]
    }
  }

  /**
   * Calculate last rotation angle by pieces position
   * @param {Object} gift 
   */
  getAngle (gift) {
    let { angle, from } = gift
    // Full degrees - (start of arc + arc by angle) + (angle / 2) - pointer position
    return (360 - (from + angle)) + (angle / 2) - this.caretPosition.angle
  }

  destroy () {
    this.isPlaying = !this.isPlaying
    this.selector.removeClass('wof-wheel_play')
  }

  start () {
    this.destroy()
    
    this.isPlaying = !this.isPlaying

    let gift = this.getWinner()
    let angle = this.getAngle(gift)
    let count = 0
    let maximumDegrees = (7200 + angle)

    this.setKeyframe(maximumDegrees)

    this.selector.addClass('wof-wheel_play')

    setTimeout(() => {
      $('.wof-winner').html(JSON.stringify(gift))
    }, 10000)
  }
}
