export const PLANETS = [
  { id: 1, name: 'Mercury', distanceAU: 0.39, icon: '⚫' },
  { id: 2, name: 'Venus',   distanceAU: 0.72, icon: '🟡' },
  { id: 3, name: 'Mars',    distanceAU: 1.52, icon: '🔴' },
  { id: 4, name: 'Jupiter', distanceAU: 5.20, icon: '🟠' },
  { id: 5, name: 'Saturn',  distanceAU: 9.58, icon: '🪐' },
];

export const BORTLE_SCALE = [
  { level: 1, label: 'Excellent dark sky' },
  { level: 2, label: 'Truly dark sky' },
  { level: 3, label: 'Rural sky' },
  { level: 4, label: 'Rural/suburban transition' },
  { level: 5, label: 'Suburban sky' },
  { level: 9, label: 'Inner-city sky' },
];

export const MOON_PHASES = [
  'New Moon', 'Waxing Crescent', 'First Quarter',
  'Waxing Gibbous', 'Full Moon', 'Waning Gibbous',
  'Last Quarter', 'Waning Crescent',
];