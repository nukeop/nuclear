import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  Text,
  ResponsiveContainer
} from 'recharts';

const colors = [
  '#FF6633', '#FFB399', '#FF33FF', '#00B3E6', '#E6B333', '#3366E6',
  '#999966', '#99FF99', '#B34D4D', '#80B300', '#809900', '#E6B3B3',
  '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A',
  '#33FFCC', '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399', '#E666B3',
  '#33991A', '#CC9999', '#B3B31A', '#00E680', '#4D8066', '#809980',
  '#E6FF80', '#1AFF33', '#999933', '#FF3380', '#CCCC00', '#66E64D',
  '#4D80CC', '#9900B3', '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6',
  '#6666FF'
];

// Function to get the top N items from the data based on a given key
const getTopN = (data: any[], key: string, n: number): any[] => {
  return data?.sort((a, b) => b[key] - a[key]).slice(0, n);
};

export type PieChartTopArtists = {
    data: any[];
}

const timeframes = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 180 days', 'Last 365 days', 'All time'];
const artistCounts = [5, 10, 15, 20];

export const PieChartTopArtists: React.FC<PieChartTopArtists> = ({ data = [] }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[0]);
  const [selectedArtistCount, setSelectedArtistCount] = useState<number>(10);

  const topArtists = getTopN(data, 'count', selectedArtistCount);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Timeframe:
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e?.target?.value)}
          >
            {timeframes.map((tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '20px' }}>
          Number of Artists:
          <select
            value={selectedArtistCount}
            onChange={(e) => setSelectedArtistCount(Number(e?.target?.value))}
          >
            {artistCounts.map((ac) => (
              <option key={ac} value={ac}>
                {ac}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ResponsiveContainer width='100%' height={400}>
        <PieChart>
          <Pie
            data={topArtists}
            dataKey='count'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={150}
            label
          >
            {topArtists.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
