export interface TuningProfile {
  id: string;
  name: string;
  throttleCurve: [number, number, number, number, number]; // 5 power values
  regenBraking: number; // 0-1
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PROFILES: TuningProfile[] = [
  {
    id: 'eco',
    name: 'Eco Mode',
    throttleCurve: [0, 0.3, 0.5, 0.7, 0.8],
    regenBraking: 0.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'street',
    name: 'Street Mode',
    throttleCurve: [0, 0.4, 0.6, 0.8, 1.0],
    regenBraking: 0.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sport',
    name: 'Sport Mode',
    throttleCurve: [0, 0.6, 0.8, 0.9, 1.0],
    regenBraking: 0.3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];