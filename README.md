# Wheel Of Fortune

This project will help you to create Wheel Of Fortune with specific angle and custom design, you can focus on creating wheel design and set a gift defining **Angle Size** and **From Angle**.

### Note of Rotation

![Rotation](example/assets/rotation.png)

By default rotation origin of element on browser is like image above, so you can define a piece of wheel like example below.

### Piece example

![Example](example/assets/example.png)

If you create piece of wheel like image above, you can set the angle with **60** and from **0** because the piece location start on *0 degrees*.

### Set Winner Position

To set position of winner on center of pointer so i use this formula :

> (360 - (Piece From + Piece Angle)) + (Piece Angle / 2) - 90

### Image Support

You can use JPG / PNG / SVG image to show a wheel, i use [svg.js](http://svgjs.com/) to load SVG image to wrapper.

### Documentation

```js
  const WOF = new WheelOfFortune({
    wheel: './assets/basic.svg',
    caretPosition: 'top',
    probability: true,
    maximumSpin: 4,
    pieces: [
      { angle: 60, from: 300, gift: 'Gift 1', prob: .2 },
      { angle: 40, from: 0, gift: 'Gift 2', prob: .05 },
      { angle: 50, from: 40, gift: 'Gift 3', prob: .1 },
      { angle: 45, from: 90, gift: 'Gift 4', prob: .15 },
      { angle: 45, from: 135, gift: 'Gift 5', prob: .15 },
      { angle: 90, from: 180, gift: 'Gift 6', prob: .3 },
      { angle: 30, from: 270, gift: 'Gift 7', prob: .05 },
    ],
    onFinish: function(result) {
      console.log(result)
      document.querySelector('#result-winner').innerHTML = JSON.stringify(result)
    },
    startButton: document.getElementById('start-button'),
    resetButton: document.getElementById('reset-button'),
  });
```