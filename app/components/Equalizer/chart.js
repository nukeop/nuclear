
import Chart from 'chart.js';
import _ from 'lodash';

const mapBands = func => _.range(0, 11).map(func);
export const filterFrequencies = [30, 60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
export const frequenciesLength = filterFrequencies.length;
function getChartOptions(data) {
  return {
    type: 'line',
    data,
    options: {
      events: ['mousemove', 'mousedown'],
      onHover: (event, chartElement) => {
        switch (event.type) {
        case 'mousedown':
          event.target.style.cursor = chartElement[0] ? 'grabbing' : 'default';
          break;
        default:
          event.target.style.cursor = chartElement[0] ? 'grab' : 'default';
        }
      },
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      animation: {
        duration: 1000
      },
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            display: false
          },
          scaleLabel: {
            display: true
          }
        }],
        yAxes: [{
          ticks: {
            display: false,
            min: 0,
            max: 20
          },
          gridLines: {
            display: false
          },
          scaleLabel: {
            display: false
          }
        }]
      }
    }
  };
}

const formatLabels = (frequencies) => 
  frequencies.map(freq => 
    freq > 999
      ? `${Math.round(freq / 1000)}KHz`
      : `${freq}Hz`
  );


const createChart = (canvas) => {
  const context = canvas.getContext('2d');
  
  const lineGradient = context.createLinearGradient(0, 0, 0, 400);
  lineGradient.addColorStop(0, 'rgb(80, 250, 123, 0.3)');   
  lineGradient.addColorStop(1, 'rgba(40, 42, 54, 0)');

  const barGradient = context.createLinearGradient(0, 0, 0, 400);
  barGradient.addColorStop(0, 'rgb(80, 250, 123, 0.1)');   
  barGradient.addColorStop(1, 'rgba(40, 42, 54, 0)');
  return new Chart(context, getChartOptions({
    labels: formatLabels(filterFrequencies),
    datasets: [{
      data: mapBands(() => 10),
      pointBorderColor: 'white',
      pointBackgroundColor: 'white',
      borderColor: 'rgb(80, 250, 123)',
      backgroundColor: lineGradient,
      pointHoverRadius: 5,
      pointHitRadius: 10,
      borderWidth: 2
    }, {
      data: mapBands(() => 0),
      borderColor: 'rgb(255, 255, 255, 0.7)',
      fill: false,
      borderWidth: 0.5,
      pointBorderWidth: 0,
      pointHitRadius: 0,
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent'
    }, {
      data: mapBands(() => 0),
      backgroundColor: barGradient,
      borderColor: 'transparent',
      pointBorderWidth: 0,
      pointHitRadius: 0,
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      steppedLine: 'middle'
    }]
  }));
};


export { createChart };
