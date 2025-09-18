
import { parseCrests } from './crests';
import { parseTools } from './tools';
import { parseHornet } from './hornet';
import { parseAncestralArts } from './ancestralArts';

export const parsers = {
  Crests: parseCrests,
  Tools: parseTools,
  Hornet: parseHornet,
  AncestralArts: parseAncestralArts,
  // Add more tab parsers here as needed
};
