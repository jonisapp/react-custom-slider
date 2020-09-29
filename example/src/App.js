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
