/* eslint no-empty: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import { drag } from 'd3-drag';
import * as d3 from 'd3-selection';
import _ from 'lodash';
import { Radio } from 'semantic-ui-react';

import PreAmp from './PreAmp';
import { getChartOptions, formatLabels} from './chart';

import styles from './styles.scss';

export const filterFrequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

class Equalizer extends React.Component {
  canvas;
  context;
  chartInstance;
  state = { viz: false }

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
    this.handlePreampChange = this.handlePreampChange.bind(this);
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
  
      this.props.onChange({
        values: this.par.chart.config.data.datasets[0].data.map(value => value - 10),
        preAmp: this.props.preAmp
      });
    } catch (err) {}
  }

  handlePreampChange(preAmp) {
    this.props.onChange({
      preAmp,
      values: this.props.values
    });
    this.chartInstance.config.data.datasets[1].data = 
      this.chartInstance.config.data.datasets[1].data.map(() => 10 - preAmp);
    this.chartInstance.update(0);
  }

  componentDidMount() {
    this.context = this.canvas.getContext('2d');
    
    const lineGradient = this.context.createLinearGradient(0, 0, 0, 400);
    lineGradient.addColorStop(0, 'rgb(80, 250, 123, 0.3)');   
    lineGradient.addColorStop(1, 'rgba(40, 42, 54, 0)');

    const barGradient = this.context.createLinearGradient(0, 0, 0, 400);
    barGradient.addColorStop(0, 'rgb(80, 250, 123, 0.1)');   
    barGradient.addColorStop(1, 'rgba(40, 42, 54, 0)');

    this.chartInstance = new Chart(this.context, getChartOptions({
      labels: formatLabels(filterFrequencies),
      datasets: [{
        pointBorderColor: 'white',
        pointBackgroundColor: 'white',
        borderColor: 'rgb(80, 250, 123)',
        backgroundColor: lineGradient,
        data: this.props.values.map(val => val + 10),
        pointHoverRadius: 5,
        pointHitRadius: 10,
        borderWidth: 2
      }, {
        data: Array.from(Array(10).keys()).map(() => 10 - this.props.preAmp),
        borderColor: 'rgb(255, 255, 255, 0.7)',
        fill: false,
        borderWidth: 0.5,
        pointBorderWidth: 0,
        pointHitRadius: 0,
        pointBorderColor: 'transparent',
        pointBackgroundColor: 'transparent'
      }, {
        backgroundColor: barGradient,
        borderColor: 'transparent',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pointBorderWidth: 0,
        pointHitRadius: 0,
        pointBorderColor: 'transparent',
        pointBackgroundColor: 'transparent',
        steppedLine: 'middle'
      }]
    }));

    d3.select(this.chartInstance.chart.canvas).call(
      drag().container(this.chartInstance.chart.canvas)
        .on('start', this.onDragStart)
        .on('drag', this.updateChart)
    );
  }

  componentDidUpdate(prevProps) {
    let update = false;

    if (!_.isEqual(prevProps.values, this.props.values)) {
      this.chartInstance.data.datasets[0].data = this.props.values.map(val => val + 10);
      update = true;
    }
    if (prevProps.preAmp !== this.props.preAmp) {
      this.chartInstance.data.datasets[1].data = 
      this.chartInstance.data.datasets[1].data.map(() => 10 - this.props.preAmp);
      update = true;
    }

    if (!_.isEqual(prevProps.dataViz, this.props.dataViz)) {
      this.chartInstance.data.datasets[2].data = this.props.dataViz.map(b => b / 10 + (this.props.preAmp || 0));
      // this.chartInstance.data.datasets[2].data[0] = 0;
      // this.chartInstance.data.datasets[2].data[this.chartInstance.data.datasets[2].data.length - 1] = 0;
      update = true;
    }

    if (prevProps.viz && !this.props.viz) {
      this.chartInstance.data.datasets[2].data = prevProps.dataViz.map(() => 0);
      update = true;
    }

    if (update) {
      this.chartInstance.update();
    }
  }

  render() {
    return (
      <div className={styles.equalizer_wrapper}>
        <h1>Equalizer</h1>
        <div className={styles.flexbox}>
          <div className={styles.vertical_flex}>
            <PreAmp value={this.props.preAmp} onChange={this.handlePreampChange} />
            <Radio
              toggle
              checked={this.props.viz}
              onChange={this.props.onToggleViz}
              className={styles.toggle_viz}
            />
          </div>
          <div className={styles.chart_wrapper}>
            <canvas ref={this.attachCanvas} />
          </div>
        </div>
      </div>
    );
  }
}

Equalizer.propTypes = {
  preAmp: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  viz: PropTypes.bool,
  onToggleViz: PropTypes.func,
  dataViz: PropTypes.arrayOf(PropTypes.number)
};

export default Equalizer;
