export interface County {
  id: number;
  name: string;
  taxRate: number;
}

export const counties: County[] = [
  {
    id: 1,
    name: 'Buncombe',
    taxRate: 2.25,
  },
  {
    id: 2,
    name: 'Avery',
    taxRate: 2,
  },
];

export const countyOptions = counties.map((county) => ({ label: county.name, value: county }));
