/* eslint no-empty: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import { drag } from 'd3-drag';
import * as d3 from 'd3-selection';
import _ from 'lodash';

import { getChartOptions, formatLabels} from './chart';

import styles from './styles.scss';

export const filterFrequencies = [50, 160, 500, 1500, 2500, 4000, 6500, 8500, 12000, 16000];

class Equalizer extends React.Component {
  canvas;
  context;
  chartInstance;

  par = {
    chart: undefined,
    element: undefined,
    scale: undefined,
    datasetIndex: undefined,
    index: undefined,
    value: undefined,
    grabOffsetY: undefined
  };

  constructor(props) {
    super(props);

    this.attachCanvas = this.attachCanvas.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  attachCanvas(element) {
    this.canvas = element;
  }

  getEventPoints(event) {
    const retval = {
      point: [],
      type: event.type
    };
    if (event.type.startsWith('mouse')) {
      retval.point.push({
        x: event.layerX,
        y: event.layerY
      });
    }
    return retval;
  }

  onDragStart() {
    try {
      const e = d3.event.sourceEvent;
    
      this.par.scale = undefined;
    
      this.par.element = this.chartInstance.getElementAtEvent(e)[0];
      this.par.chart = this.par.element._chart;
      this.par.scale = this.par.element._yScale;
    
      this.par.datasetIndex = this.par.element._datasetIndex;
      this.par.index = this.par.element._index;
    
      this.par.grabOffsetY = this.par.scale.getPixelForValue(
        this.par.chart.config.data.datasets[this.par.datasetIndex].data[this.par.index],
        this.par.index,
        this.par.datasetIndex,
        false
      ) - this.getEventPoints(e).point[0].y;
    } catch (err) {}
  }

  updateChart() {
    try {
      const e = d3.event.sourceEvent;
    
      if (this.par.datasetIndex === 1) {
        return;
      }
    
      this.par.value = Math.floor(
        this.par.scale.getValueForPixel(
          this.par.grabOffsetY + this.getEventPoints(e).point[0].y
        ) + 0.5
      );
      this.par.value = Math.max(0, Math.min(20, this.par.value));
      this.par.chart.config.data.datasets[this.par.datasetIndex].data[this.par.index] = this.par.value;
      this.chartInstance.update(0);
  
      this.props.onChange(this.par.chart.config.data.datasets[0].data.map(value => value - 10));
    } catch (err) {}
  }

  componentDidMount() {
    this.context = this.canvas.getContext('2d');
    
    const gradient = this.context.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgb(30, 203, 92, 0.3)');   
    gradient.addColorStop(1, 'rgba(40, 42, 54, 0)');

    this.chartInstance = new Chart(this.context, getChartOptions({
      labels: formatLabels(filterFrequencies),
      datasets: [{
        pointBorderColor: 'white',
        pointBackgroundColor: 'white',
        borderColor: 'rgb(30, 203, 92)',
        backgroundColor: gradient,
        data: this.props.values.map(val => val + 10),
        pointHitRadius: 50,
        pointHoverRadius: 10,
        borderWidth: 2
      }]
    }));

    d3.select(this.chartInstance.chart.canvas).call(
      drag().container(this.chartInstance.chart.canvas)
        .on('start', this.onDragStart)
        .on('drag', this.updateChart)
    );
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.values, this.props.values)) {
      this.chartInstance.data.datasets[0].data = this.props.values.map(val => val + 10);
    }
  }

  render() {
    return (
      <div className={styles.equalizer_wrapper}>
        <h1>Equalizer</h1>
        <canvas ref={this.attachCanvas} />
      </div>
    );
  }
}

Equalizer.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func
};

export default Equalizer;
