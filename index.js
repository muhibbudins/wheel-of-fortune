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
     * 
     */
    this.selector = $('.wof-wheel')
    this.source = null
    this.degree = 7200
    this.clicked = 0

    this._isPlaying = false
    this._isAnimating = false
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
  setKeyframe (maximumDegree) {
    var styleEl = document.createElement('style'),
        styleSheet;
  
    // Append style element to head
    document.head.appendChild(styleEl)

    // Grab style sheet
    styleSheet = styleEl.sheet

    let rule = `WOFAnimate {
      100% {
        -webkit-transform: rotate(${ maximumDegree }deg);
                transform: rotate(${ maximumDegree }deg);
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
    let sorted = _.orderBy(this.pieces, 'angle', 'desc')
    let list = Array.from(this.pieces.map(item => item.angle)).sort().reverse()
    let index = Math.floor(Math.random() * list.length)

    return sorted[index]
  }

  getAngle (gift) {
    let { angle, from } = gift
    // Full degree - (start of arc + arc by angle) + (angle / 2) - pointer position
    return (360 - (from + angle)) + (angle / 2) - 90
  }

  start () {
    // console.log('Playing!')
    this._isPlaying = !this._isPlaying
    let gift = this.getWinner()
    let angle = this.getAngle(gift)
    let count = 0
    let maximumDegree = (7200 + angle)

    this.setKeyframe(maximumDegree)

    this.selector.addClass('wof-wheel_play')

    setTimeout(() => {
      console.log(gift)
      $('.wof-winner').html(JSON.stringify(gift))
    }, 10000)
  }
}
