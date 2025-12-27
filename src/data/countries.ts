// Countries with Both Private Copying Levy and Public Lending Right
export const COUNTRIES = [
  'Austria',
  'Belgium',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Italy',
  'Latvia',
  'Lithuania',
  'Malta',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Australia',
  'Canada',
  'Israel',
  'New Zealand',
] as const;

// TypeScript type for country strings
export type Country = typeof COUNTRIES[number];

export default COUNTRIES;