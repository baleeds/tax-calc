export interface County {
  id: string;
  name: string;
  taxRate: number;
}

export const counties: County[] = [
  {
    id: 'buncombe',
    name: 'Buncombe',
    taxRate: 2.25,
  },
  {
    id: 'avery',
    name: 'Avery',
    taxRate: 2,
  },
];

export const countyOptions = counties.map((county) => ({ label: county.name, value: county }));

export const countyMap = counties.reduce((acc, county) => {
  acc[county.id] = county;
  return acc;
}, {} as Record<string, County>);
