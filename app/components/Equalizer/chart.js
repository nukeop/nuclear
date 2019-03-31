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

function formatLabels(frequencies) {
  return frequencies.map(freq => {
    return freq > 999
      ? `${Math.round(freq / 1000)}KHz`
      : `${freq}Hz`;
  });
}

export { getChartOptions, formatLabels };

