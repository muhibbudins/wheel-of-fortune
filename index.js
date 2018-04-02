import axios from 'axios'
import svg from 'svg.js'
import $ from 'domtastic'

export default class WheelOfFortune {
  constructor (config) {
    if (!config.wheel) throw Error('Source of wheel must be defined')
    this.image = config.wheel

    if (!config.pieces) throw Error('Pieces of wheel must be defined')
    this.pieces = config.pieces

    this.selector = $('#wheel')
    this.draw = svg(this.selector[0])
    this.source = null
    this.degree = 7200
    this.clicked = 0

    this._isPlaying = false
    this._isAnimating = false
    this._isEnded = false

    this.init()
  }

  /**
   * Initialize Wheel
   */

  placeImage () {
    this.draw.svg(this.source)
  }

  inject (maximumDegree) {
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

  init () {
    axios.get(this.image).then(({ data }) => {
      this.source = data
      
      this.placeImage()
    })
  }

  /**
   * Getting gift
   */

  random () {
    let min = 0
    let max = this.pieces.length - 1

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  gift () {
    return this.pieces[this.random()]
  }

  /**
   * Running Wheel
   */

  calculate (gift) {
    let { angle, from } = gift
    return (360 - (from + angle)) + (angle / 2)
  }

  run () {
    // console.log('Playing!')
    this._isPlaying = !this._isPlaying
    let gift = this.gift()
    let angle = this.calculate(gift)
    let count = 0
    let maximumDegree = (7200 + angle)

    this.inject(maximumDegree)

    // console.log(gift)
    
    this.selector.addClass('wof-animate')
  }
}
