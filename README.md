# Wheel Of Fortune
Simple wheel of fortune with specific angle, build with ES6, Webpack and SASS

```js
  const WOF = new WheelOfFortune({
    wheel: './wheel.svg',
    pieces: [
      { angle: 60, from: 300, gift: 'Gift 1' },
      { angle: 40, from: 0, gift: 'Gift 2' },
      { angle: 50, from: 40, gift: 'Gift 3' },
      { angle: 45, from: 90, gift: 'Gift 4' },
      { angle: 45, from: 135, gift: 'Gift 5' },
      { angle: 90, from: 180, gift: 'Gift 6' },
      { angle: 30, from: 270, gift: 'Gift 7' },
    ]
  });

  document.getElementById('run').addEventListener('click', function() {
    WOF.run();
  }, false);
```