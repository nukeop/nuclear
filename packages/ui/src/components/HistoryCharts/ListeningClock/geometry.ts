import { arc } from 'd3-shape';

export type Wedge = {
  hour: number;
  radius: number;
};

export const INNER_RADIUS = 36;
export const OUTER_RADIUS = 102;

export const hourToRadians = (hour: number) => (hour / 24) * 2 * Math.PI;

export const wedgePath = arc<Wedge>()
  .innerRadius(INNER_RADIUS)
  .outerRadius((wedge) => wedge.radius)
  .startAngle((wedge) => hourToRadians(wedge.hour))
  .endAngle((wedge) => hourToRadians(wedge.hour + 1))
  .padAngle(0.035)
  .padRadius(OUTER_RADIUS);
