import { civilBuildings } from './civil';
import { militaryBuildings } from './military';
import { industrialBuildings } from './industrial';
import { Building } from './types';

export const allBuildings: Building[] = [
  ...civilBuildings,
  ...militaryBuildings,
  ...industrialBuildings
];

export * from './types';
export { civilBuildings, militaryBuildings, industrialBuildings };