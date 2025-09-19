
import { parseCrests } from './crests';
import { parseTools } from './tools';
import { parseHornet } from './hornet';
import { parseAncestralArts } from './ancestralArts';
import { parseRelics } from './relics';

export const parsers = {
  Crests: parseCrests,
  Tools: parseTools,
  Hornet: parseHornet,
  AncestralArts: parseAncestralArts,
  Relics : parseRelics
  // Add more tab parsers here as needed
};
