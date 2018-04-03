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
    var styleEl = document.createElement('style'),
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
   * Getter
   */
  getWinner () {
    /**
     * If winner algorithm using Probability Algorithm
     */
    if (this.probability) {
      console.log('use probability')
      let list = Array.from(this.pieces.map(item => item.angle))
      let weight = Array.from(this.pieces.map(item => item.prob))
      console.log(list, weight)
      
      var generateWeighedList = function(list, weight) {
        var weighed_list = [];
        var lastMultiple = 0
        let temporary = []
        let cycle = 0
          
          // Loop over weights
          for (var i = 0; i < weight.length; i++) {
              var multiples = weight[i] * 100;
              var x = {}
              x['index'] = i
              x['start'] = cycle > 1 ? lastMultiple - cycle : lastMultiple
              x['last'] = cycle > 1 ? lastMultiple + multiples - cycle : lastMultiple + multiples

              temporary.push(x)
              
              lastMultiple = lastMultiple + multiples + 1
              cycle++

              // Loop over the list of items
              for (var j = 0; j < multiples; j++) {
                  weighed_list.push(list[i]);
              }
          }
          
          return {
            weighed_list: weighed_list,
            temporary: temporary
          };
      };
      
      var generate = generateWeighedList(list, weight);
      
      console.log(generate.temporary)
      console.log(generate.weighed_list, generate.weighed_list.length);

      var rand = function(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      
      var random_num = rand(0, generate.weighed_list.length);
      console.log(random_num, generate.weighed_list[random_num]);

      generate.temporary.map(item => {
        if (item.start >= random_num && random_num <= item.last) {
          console.log(item.index, this.pieces[item.index])
        }
      })

      return generate.weighed_list[random_num]
    }

    /**
     * Use default random algorithm
     */
    else {
      let sorted = _.orderBy(this.pieces, 'angle', 'desc')
      let list = Array.from(this.pieces.map(item => item.angle)).sort().reverse()
      let index = Math.floor(Math.random() * list.length)
  
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
