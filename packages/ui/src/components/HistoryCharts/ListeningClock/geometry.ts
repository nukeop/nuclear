import { arc } from 'd3-shape';

export type Wedge = {
  hour: number;
  radius: number;
};

export const hourToRadians = (hour: number) => (hour / 24) * 2 * Math.PI;

export const wedgePath = arc<Wedge>()
  .innerRadius(36)
  .outerRadius((wedge) => wedge.radius)
  .startAngle((wedge) => hourToRadians(wedge.hour))
  .endAngle((wedge) => hourToRadians(wedge.hour + 1))
  .padAngle(0.035)
  .padRadius(102);
