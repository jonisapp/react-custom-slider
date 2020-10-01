import React, { useRef, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';


const Slider = (props) => {
  const { defaultValue, value, showValue, valueLabelColor, valueLabelActiveColor, valueLabelPadding, valueLabelStyle,
          min, max, stepSize, disabled, disabledColor,
          onChange, onRelease, valueRenderer,
          trackLength, trackColor, trackThickness, trackShape, trackStyle, fillTrack, fillColor,
          handlerSize, handlerWidth, handlerHeight, handlerShape, handlerColor, handlerBorderColor, handlerActiveColor, handlerStyle,
          markers, markersSize, showMarkers,
          fontSize, fontColor, grabCursor, vertical, invertMarkers, style } = props;

  const handler_ref = useRef(null);

  const handler_width = handlerWidth ? handlerWidth : handlerSize;
  const handler_height = handlerHeight ? handlerHeight : handlerSize;
  const handlerWidth_radius = handler_width / 2;
  const handlerHeight_radius = handler_height / 2;
  const defaultStep = defaultValue - min;

  const [ _value, set_Value ] = useState(defaultValue);
  const [ isActive, setIsActive ] = useState(false);
  const [ pointerStart_positionX, setPointerStart_positionX ] = useState(0);
  const [ startValue, setStartValue ] = useState((defaultStep && !value) ? defaultStep : step);
  const [ handler_position, setHandler_position ] = useState(null);

  const step = (value !== null ? value : _value) - min;
  const steps = max - min;

  const track_radius = trackThickness / 2;
  const stepWidth = trackLength / steps;

  const markers_PositionsX = useMemo(() => {
    if(trackLength === 0) return [];
    const markers_PositionsX = [];
    for(let i = 0; i < markers; ++i) {
      const relPosition = i * (trackLength / (markers - 1));
      markers_PositionsX.push({
        position: relPosition + (!vertical ? handlerWidth_radius : handlerHeight_radius),
        value: Math.round(relPosition / stepWidth)
      });
    }
    return markers_PositionsX;
  }, [ trackLength, markers, handlerWidth_radius, stepWidth ]);

  const sliderChangeHandler = (position) => {
    const updatedValue = Math.round(min + (position / stepWidth));
    if(updatedValue !== value && updatedValue % stepSize === 0) {
      setHandler_position(position);
      onChange(updatedValue)
      set_Value(updatedValue);
    }
  }

  const pointerDownHandler = (e) => {
    if(disabled === false) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsActive(true);
      setPointerStart_positionX(!vertical ? e.clientX : e.clientY);
      setHandler_position(step * stepWidth);
      setStartValue(step);
    }
  }

  const trackPointerDownHandler = (e) => {
    if(disabled === false && !vertical) {  // to implement : vertical
      const pointer_position = (!vertical ? e.clientX - e.currentTarget.getBoundingClientRect().x : e.clientY - e.currentTarget.getBoundingClientRect().y);
      sliderChangeHandler(pointer_position);
      handler_ref.current.setPointerCapture(e.pointerId);
      setIsActive(true);
      setPointerStart_positionX(!vertical ? e.clientX : e.clientY);
      setStartValue(Math.round((pointer_position / trackLength) * steps));
    }
  }

  const pointerMoveHandler = useCallback((e) => {
    if(isActive) {
      const updatedhandler_position = (startValue * stepWidth) + (vertical ? 1 : -1) * (pointerStart_positionX - (!vertical ? e.clientX : e.clientY));
      if(updatedhandler_position !== handler_position) {
        sliderChangeHandler(
          updatedhandler_position >= 0 && updatedhandler_position <= trackLength
          ? updatedhandler_position
          : (updatedhandler_position > trackLength
            ? trackLength
            : 0
          )
        )
      }
    }
  }, [ trackLength, isActive, handler_position, pointerStart_positionX ]);

  const pointerUpHandler = (e) => {
    if(disabled === false) {
      setIsActive(false);
      setPointerStart_positionX(0);
      setHandler_position(null);
      onRelease(Math.round(min + (handler_position / stepWidth)));
    }
  }

  const renderSlider = () => {
    return(
      <div style={{...styles.slider,
          ...!vertical ? { height: handler_height } : { width: handler_width },
          visibility: trackLength !== 0 ? 'visible' : 'hidden',
        }}
      >
        <div style={{...styles.track, ...trackStyle,
            borderRadius: trackShape === 'rounded' ? track_radius : 0,
            ...!vertical ? 
              { left: handlerWidth_radius, right: handlerWidth_radius, top: '50%', height: trackThickness, transform: 'translateY(-50%)' }
            : { top: handlerHeight_radius, bottom: handlerHeight_radius, left: '50%', width: trackThickness, transform: 'translateX(-50%)' },
            backgroundColor: disabled ? disabledColor : trackColor,
            cursor: !disabled ? 'pointer' : 'default'
          }}
          onPointerDown={trackPointerDownHandler}
        />
        { fillTrack &&
          <div
            style={{...styles.trackFill,
              borderRadius: trackShape === 'rounded' ? track_radius : 0,
              left: handlerWidth_radius,
              ...!vertical ?
                {
                  top: handlerHeight_radius,
                  width: (handler_position !== null ? handler_position : step * stepWidth),
                  height: trackThickness,
                  transform: 'translateY(-50%)'
                }
              : {
                  bottom: handlerHeight_radius,
                  height: (handler_position !== null ? handler_position : step * stepWidth),
                  width: trackThickness,
                  transform: 'translateX(-50%)'
                },
              backgroundColor: fillColor,
              cursor: !disabled ? 'pointer' : 'default'
            }}
            onPointerDown={trackPointerDownHandler}
          />
        }
        <div
          ref={ handler_ref }
          onPointerDown={pointerDownHandler}
          onPointerMove={pointerMoveHandler}
          onPointerUp={pointerUpHandler}
          style={{...styles.handler, ...handlerStyle,
            ...!vertical ?
              { left: handler_position !== null ? handler_position : step * stepWidth }
            : { bottom: handler_position !== null ? handler_position : step * stepWidth },
            height: handler_height, width: handler_width,
            backgroundColor: isActive ? handlerActiveColor : (disabled ? disabledColor : handlerColor),
            border: `1px solid ${ handlerBorderColor }`,
            borderRadius: handlerShape === 'rounded' ? handlerHeight_radius : 4,
            cursor: (grabCursor && !disabled) ? (isActive ? 'grabbing' : 'grab') : 'default'
          }}
        />
        { (((isActive && showValue === 'active') || showMarkers === 'hidden' && showValue === 'active' && isActive) || (showValue === true)) && showMarkers &&
          <div style={{...styles.marker, zIndex: 10, height: fontSize,
              padding: valueLabelPadding,
              border: `1px solid ${ handlerColor }`, ...valueLabelStyle,
              ...!vertical ?
                {
                  left: handlerWidth_radius + (handler_position !== null ? handler_position : step * stepWidth),
                  top: !invertMarkers ? handler_height + markersSize + valueLabelPadding - 2 : - markersSize - valueLabelPadding - 1,
                  transform: `translate(-50%,${ !invertMarkers ? -100 : 0 }%)`
                }
              :
                {
                  bottom: handlerHeight_radius + (handler_position !== null ? handler_position : step * stepWidth),
                  ...!invertMarkers ? { left: handler_width + markersSize + valueLabelPadding } : { right: handler_width + markersSize + valueLabelPadding },
                  transform: `translate(${ !invertMarkers ? -100 : 100 }%, 50%)`
                },
              backgroundColor: isActive ? valueLabelActiveColor : valueLabelColor,
            }}
          >
            { valueRenderer(value !== null ? value : _value) }
          </div>
        }
      </div>
    );
  };

  const renderMarkers = () => {
    return(
      <React.Fragment>
        { (trackLength !== 0 && markers >= 2) &&
          <div style={{ position: 'relative',
              visibility: (showMarkers === true || (showMarkers === 'active' && isActive) || (showMarkers === 'inactive' && !isActive)) ? 'visible' : 'hidden',
              ...!vertical ? { height: markersSize } : { width: markersSize }
            }}
          >
            {
              markers_PositionsX.map(({ position, value }) => {
                return(
                  <div
                    key={ position }
                    style={{ ...styles.marker,
                      ...!vertical ? { left: position, ...!invertMarkers ? { bottom: 0 } : { top: 0 }, transform: 'translateX(-50%)'  }
                      : { bottom: position, ...!invertMarkers ? { right: 0 } : { left: 0 }, transform: `translateY(50%)` }
                    }}
                  >
                    { value }
                  </div>
                )
              })
            }
          </div>
        }
      </React.Fragment>
    )
  };

  return(
    <div style={{ ...style, ...styles.container,
        flexDirection: !vertical ? 'column' : 'row',
        fontSize, color: fontColor,
        ...!vertical ? { width: trackLength + handler_width }
        : { height: trackLength + handler_height, width: handler_width + markersSize },
      }}
    >
      { invertMarkers ?
        <React.Fragment>{ showMarkers && renderMarkers() }{ renderSlider() }</React.Fragment>
      :
        <React.Fragment>{ renderSlider() }{ showMarkers && renderMarkers() }</React.Fragment>
      }
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  },
  slider: {
    position: 'relative'
  },
  track: {
    position: 'absolute'
  },
  trackFill: {
    position: 'absolute'
  },
  handler: {
    position: 'absolute',
    boxSizing: 'border-box',
    borderRadius: 4
  },
  marker: {
    position: 'absolute',
    textAlign: 'center'
  }
};

Slider.defaultProps = {
  defaultValue: 0,
  value: null,
  showValue: true,
  valueLabelColor: '#3d3b4c',
  valueLabelActiveColor: '#4c61ff',
  valueLabelPadding: 4,
  valueLabelStyle: { color: '#fff' },
  min: 0,
  max: 100,
  stepSize: 1,
  disabled: false,
  disabledColor: 'red',
  onChange: () => {},
  onRelease: () => {},
  valueRenderer: (value) => value.toString(),
  trackLength: 200,
  trackColor: '#e5e5e5',
  trackThickness: 5,
  trackShape: 'rounded',
  trackStyle: {},
  fillTrack: true,
  fillColor: '#4c61ff',
  handlerSize: 20,
  handlerWidth: null,
  handlerHeight: null,
  handlerShape: 'squared',
  handlerColor: '#fff',
  handlerBorderColor: '#999',
  handlerActiveColor: '#e5e5e5',
  handlerStyle: {},
  fontSize: 12,
  fontColor: '#333',
  markers: 2,
  markersSize: 20,
  showMarkers: true,
  grabCursor: true,
  vertical: false,
  invertMarkers: false,
  style: {}
};

Slider.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  showValue: PropTypes.oneOf([true, false, 'active']),
  valueLabelColor: PropTypes.string,
  valueLabelActiveColor: PropTypes.string,
  valueLabelPadding: PropTypes.number,
  valueLabelStyle: PropTypes.object,
  min: PropTypes.number,
  max: PropTypes.number,
  stepSize: PropTypes.number,
  disabled: PropTypes.bool,
  disabledColor: PropTypes.string,
  onChange: PropTypes.func,
  onRelease: PropTypes.func.isRequired,
  valueRenderer: PropTypes.func,
  trackLength: PropTypes.number.isRequired,
  trackColor: PropTypes.string,
  trackThickness: PropTypes.number,
  trackShape: PropTypes.oneOf(['squared', 'rounded']),
  trackStyle: PropTypes.object,
  fillTrack: PropTypes.bool,
  fillColor: PropTypes.string,
  handlerSize: PropTypes.number,
  handlerWidth: PropTypes.number,
  handlerHeight: PropTypes.number,
  handlerShape: PropTypes.oneOf(['squared', 'rounded']),
  handlerColor: PropTypes.string,
  handlerBorderColor: PropTypes.string,
  handlerActiveColor: PropTypes.string,
  handlerStyle: PropTypes.object,
  fontSize: PropTypes.number,
  fontColor: PropTypes.string,
  markers: PropTypes.number,
  markersSize: PropTypes.number,
  showMarkers: PropTypes.oneOf([true, false, 'hidden', 'active', 'inactive']),
  grabCursor: PropTypes.bool,
  vertical: PropTypes.bool,
  invertMarkers: PropTypes.bool,
  style: PropTypes.object
};

export default Slider;