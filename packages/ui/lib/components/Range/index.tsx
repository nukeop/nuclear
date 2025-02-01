import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './index.scss';

export const toRgbaString = rgbaObject => `rgba(${rgbaObject.r}, ${rgbaObject.g}, ${rgbaObject.b}, ${rgbaObject.a})`;

export const getTrackPosition = ({ thumbSize, height }) => ({
  top: (thumbSize - Math.min(height, thumbSize)) / 2,
  height
});

const Range = ({
  value,
  min,
  max,
  thumbSize,
  width,
  trackColor,
  height,
  fillColor,
  hideThumb,
  thumbColor,
  readOnly,
  onChange
}) => {
  const handleChange = useCallback(
    e => {
      if (!readOnly) {
        const newVal = parseInt(e.nativeEvent ? e.nativeEvent.target.value : e, 10);
        onChange && onChange(newVal);
      }
    },
    [onChange, readOnly]
  );

  const handleWheel: React.WheelEventHandler = useCallback((e) => {
    if (!readOnly) {
      const newVal = e.deltaY > 0
        ? (value - 5)
        : (value + 5);
      onChange && onChange(Math.min(max, Math.max(min, newVal)));
    }
  }, [max, min, onChange, readOnly, value]);

  const val = Math.min(max, _.defaultTo(value, 0));
  const percentProgress = val / (max - min);
  const componentHeight = Math.max(height, thumbSize);
  const trackPosition = getTrackPosition({ thumbSize, height });

  return (
    <div className={styles.range} style={{ width }}>
      <div
        className={styles.baseDiv}
        style={{
          height: componentHeight
        }}
      >
        <div
          className={styles.track}
          style={{
            borderRadius: height,
            background: toRgbaString(trackColor),
            ...trackPosition
          }}
        />
        <div
          className={styles.fill}
          style={{
            borderRadius: height,
            background: toRgbaString(fillColor),
            width: `calc(100% * ${percentProgress} + ${(1 - percentProgress) * componentHeight}px)`,
            ...trackPosition
          }}
        />
        {hideThumb ? null : (
          <div
            className={styles.thumb}
            style={{
              width: componentHeight,
              height: componentHeight,
              borderRadius: componentHeight,
              background: toRgbaString(thumbColor),
              left: `calc((100% - ${componentHeight}px) * ${percentProgress})`
            }}
          />
        )}
        <input
          className={styles.range_input}
          style={{
            ...trackPosition,
            width: 'calc(100% - ' + componentHeight + 'px)',
            marginLeft: componentHeight / 2,
            marginRight: componentHeight / 2,
            height: componentHeight
          }}
          type='range'
          onChange={handleChange}
          onWheel={handleWheel}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

Range.defaultProps = {
  fillColor: { r: 255, g: 255, b: 255, a: 1 },
  trackColor: { r: 255, g: 255, b: 255, a: 0.5 },
  thumbColor: { r: 255, g: 255, b: 255, a: 1 },
  thumbSize: 12,
  height: 6,
  min: 0,
  max: 100,
  width: 300,
  value: 0,
  onChange: () => { }
};

const colorWithAlpha = {
  r: PropTypes.number.isRequired,
  g: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired,
  a: PropTypes.number.isRequired
};

Range.propTypes = {
  fillColor: PropTypes.shape(colorWithAlpha),
  trackColor: PropTypes.shape(colorWithAlpha),
  thumbColor: PropTypes.shape(colorWithAlpha),
  hideThumb: PropTypes.bool,
  height: PropTypes.number,
  thumbSize: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool
};

export default Range;
