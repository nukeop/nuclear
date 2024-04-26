import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PieChartTopArtists } from './PieChartTopArtists';

const mockData = [
  { name: 'Artist A', count: 50 },
  { name: 'Artist B', count: 40 },
  { name: 'Artist C', count: 30 },
  { name: 'Artist D', count: 20 },
  { name: 'Artist E', count: 10 }
];

describe('PieChartTopArtists', () => {
  test('renders without crashing', () => {
    render(<PieChartTopArtists data={mockData} />);
  });

  test('changes the selected timeframe', () => {
    render(<PieChartTopArtists data={mockData} />);

    const timeframeSelect = screen.getByLabelText('Timeframe:');
    fireEvent.change(timeframeSelect, { target: { value: 'Last 90 days' } });

    expect(timeframeSelect.value).toBe('Last 90 days');
  });

  test('changes the selected number of artists', () => {
    render(<PieChartTopArtists data={mockData} />);

    const artistCountSelect = screen.getByLabelText('Number of Artists:');
    fireEvent.change(artistCountSelect, { target: { value: 15 } });

    expect(artistCountSelect.value).toBe('15');
  });

  test('renders the correct number of artists in the pie chart', () => {
    render(<PieChartTopArtists data={mockData} />);
    
    const pieSlices = screen.getAllByRole('graphics-element');
    expect(pieSlices.length).toBe(5);

    const artistCountSelect = screen.getByLabelText('Number of Artists:');
    fireEvent.change(artistCountSelect, { target: { value: 10 } });

    const updatedPieSlices = screen.getAllByRole('graphics-element');
    expect(updatedPieSlices.length).toBe(5);
  });

  test('handles an empty dataset', () => {
    render(<PieChartTopArtists data={[]} />);

    const pieSlices = screen.queryAllByRole('graphics-element');
    expect(pieSlices.length).toBe(0); 
  });
});
