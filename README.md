# react-custom-slider

> a very easy to use customizable slider for React
- easy to use
- no dependencies
- flexible (few required parameters but highly customizable)

[![NPM](https://img.shields.io/npm/v/react-custom-slider.svg)](https://www.npmjs.com/package/react-custom-slider) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-custom-slider
```

## Usage

```jsx
import React from 'react'

import Slider from 'react-custom-slider';

const App = () => {
  const [ value, setValue ] = React.useState(0);

  return(
      <div style={styles.container}>
        <Slider
          value={value}
          defaultValue={value}
          onChange={(value) => setValue(value)}
        />
      </div>
  )
};

const styles = {
  container: {
    backgroundColor: 'transparent',
    margin: 100
  }
}

export default App
```

## Props
| Prop | Type | Description |
|------|------|-------------|
| `value` | number (required) | controlled value |
| `defaultValue` | number (required) | uncontrolled value |
| `showValue` | true, false, 'active' | displays current value on a label |
| `valueLabelColor` | string | |
| `valueLabelStyle` | object | user custom style for value label |
| `min` | number | min slider value |
| `max` | number | max slider value |
| `stepSize` | number | interval between 2 steps |
| `disabled` | boolean | |
| `disabledColor` | string | color used when the slider is disabled |
| `onChange` | function (callback) | called every time value changes ( value as argument) |
| `onRelease` | function (callback) | called once slider is released ( value as argument) |
| `valueRenderer` | function (callback) | used by value label (to display a unit such as %) |
| `trackLength` | number | |
| `trackColor` | string | |
| `trackThickness` | number | |
| `trackShape` | 'squared', 'rounded' | |
| `trackStyle` | object | user custom styling for track |
| `handlerSize` | number | sets handler diameter (both width and height) |
| `handlerWidth` | number | |
| `handlerHeight` | number | |
| `handlerShape` | 'squared', 'rounded' | |
| `handlerColor` | string | |
| `handlerActiveColor` | string | handler color when slider is being used |
| `handlerStyle` | object | user custom styling for handler |
| `fontSize` | number | used by markers |
| `fontColor` | string | used by markers |
| `markers` | number | numbers of markers to display |
| `markersMargin` | number | space between slider and markers |
| `showMarkers` | true, false, 'hidden', 'active', 'inactive' | 'active' displays the markers only when slider is beeing used, 'inactive' the opposite |
| `grabCursor` | boolean | when true shows a grabbing cursor as slider is beeing used |
| `vertical` | boolean | slider's layout horizontal or vertical |
| `invertMarkers` | boolean | switch slider and markers positions |
| `style` | object | user custom style for slider's root container |


## License

MIT © [jonisapp](https://github.com/jonisapp)
