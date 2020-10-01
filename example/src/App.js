import React from 'react'

import Slider from 'react-custom-slider';

const App = () => {
  const [ value, setValue ] = React.useState(0);

  return(
    <div>
      <Slider
        value={value}
        markersSize={25}
        trackLength={250}
        markers={11}
        onChange={(value) => setValue(value)}
        valueRenderer={(value) => `${value}%`}
      />
    </div>
  )
};

export default App;
