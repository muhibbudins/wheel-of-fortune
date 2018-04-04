# Wheel Of Fortune

This project will help you to create Wheel Of Fortune with specific angle and custom design, so you can focus to create a wheel design.

## Installation

#### Manual Download 

Download from source on this [link](https://github.com/muhibbudins/wheel-of-fortune/tree/master/lib)

#### Use CDN

Insert this following code on your project file

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/wof/1.0.1/wof.min.js"></script>
```

### Documentation

Example configuration

```js
  const WOF = new WheelOfFortune({
    // Image file
    wheel: './assets/basic.svg',
    // Position of caret pointer
    caretPosition: 'top',
    // If you want use probability alogirthm
    probability: true,
    // Configuration of pieces
    pieces: [
      { angle: 60, from: 300, gift: 'Gift 1', prob: .2 },
      { angle: 40, from: 0, gift: 'Gift 2', prob: .05 },
      { angle: 50, from: 40, gift: 'Gift 3', prob: .1 },
      { angle: 45, from: 90, gift: 'Gift 4', prob: .15 },
      { angle: 45, from: 135, gift: 'Gift 5', prob: .15 },
      { angle: 90, from: 180, gift: 'Gift 6', prob: .3 },
      { angle: 30, from: 270, gift: 'Gift 7', prob: .05 },
    ],
    // Maximum spining
    maximumSpin: 4,
    // Set external start button
    startButton: document.getElementById('start-button'),
    // Set external reset button
    resetButton: document.getElementById('reset-button'),
    // Detect finish event
    onFinish: function(result) {
      console.log(result)
    }
  });
```

### Set Pieces Angle

![Example](example/assets/example.png)

If you create piece of wheel like image above, you can set the angle with **60** and from **0** because the piece location start on *0 degrees*.

### Image Support

You can use JPG / PNG / SVG image to show a wheel, i use [svg.js](http://svgjs.com/) to load SVG image to wrapper.

### License

This project under MIT License