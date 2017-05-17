import Axios from 'axios';

const csv = require('csv');

const dailyUrl = 'https://spotifycharts.com/regional/global/daily/latest/download';

function getDailyChart(callback) {
  Axios.get(dailyUrl)
  .then((response) => {
    csv.parse(response.data, (err, data) => {
      callback(data.slice(1));
    });

  })
}

module.exports = {
  getDailyChart: getDailyChart
}
