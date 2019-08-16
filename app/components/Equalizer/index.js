/* eslint no-empty: 0 */

import React, {useRef, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';

import { drag } from 'd3-drag';
import * as d3 from 'd3-selection';
import { Radio } from 'semantic-ui-react';

import PreAmp from './PreAmp';
import { createChart} from './chart';

import styles from './styles.scss';

const mapGraphValueToData = value => value - 10;
const mapDataValueToGraph = value => value + 10;

const useChart = ({values, onEqualizerChange, preAmp, spectrum}) => {
  const canvasRef = useRef();
  const chartRef = useRef();
  const draggedRef = useRef();
  const onDragStart = useCallback(() => {
    draggedRef.current = chartRef.current.getElementAtEvent(d3.event.sourceEvent)[0];
  }, []);
  
  const onChartDrag = useCallback(() => {
    if (!draggedRef.current) {
      return;
    }
    const event = d3.event.sourceEvent;
    if (event.target !== canvasRef.current) {
      return;
    }
    const value = Math.max(0, Math.min(20, draggedRef.current._yScale.getValueForPixel(event.layerY)));
    onEqualizerChange({index: draggedRef.current._index, value: mapGraphValueToData(value)});
  }, [onEqualizerChange]);
  const onChartDragEnd = useCallback(() => {
    draggedRef.current = null;
  }, []);
  useEffect(() => {
    const chart = createChart(canvasRef.current);
    d3.select(chart.chart.canvas).call(
      drag().container(canvasRef.current)
        .on('start', onDragStart)
        .on('drag', onChartDrag)
        .on('end', onChartDragEnd)
    );
    chartRef.current = chart;
    return () => {
      chart.destroy();
    };
  }, [onChartDrag, onChartDragEnd, onDragStart]);
  useEffect(() => {
    chartRef.current.data.datasets[1].data = chartRef.current.data.datasets[1].data.map(() => 10 - preAmp);
    chartRef.current.update(300);
  }, [preAmp]);
  useEffect(() => {
    chartRef.current.data.datasets[0].data = values.map(mapDataValueToGraph);
    chartRef.current.update(100);
  }, [values]);
  useEffect(() => {
    chartRef.current.data.datasets[2].data = spectrum ? spectrum.map(value => value / 10 + preAmp - 10) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    chartRef.current.update();
  }, [spectrum, preAmp]);
  return canvasRef;
};

const Equalizer = ({values, preAmp, enableSpectrum, spectrum, onEqualizerChange, onToggleSpectrum, onPreampChange}) => {
  const canvasRef = useChart({values, preAmp, spectrum: enableSpectrum ? spectrum : null, onEqualizerChange});
  return (
    <div className={styles.equalizer_container}>
      <div className={styles.preamp_container}>
        <PreAmp
          value={preAmp}
          onChange={onPreampChange}
        />
        <Radio
          toggle
          checked={enableSpectrum}
          onChange={onToggleSpectrum}
          className={styles.toggle_viz}
        />
      </div>
      <div className={styles.chart_wrapper}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};


Equalizer.propTypes = {
  preAmp: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.number),
  onEqualizerChange: PropTypes.func,
  enableSpectrum: PropTypes.bool,
  onToggleSpectrum: PropTypes.func,
  spectrum: PropTypes.arrayOf(PropTypes.number)
};

export default Equalizer;
