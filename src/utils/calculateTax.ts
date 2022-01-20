import { County } from '../data/counties';
import { roundToTwo } from './roundToTwo';

export interface TaxInfo {
  total: number;
  foodSubtotal: number;
  nonFoodSubtotal: number;
  stateTax: number;
  countyTax: number;
  foodTax: number;
}

const STATE_TAX_RATE = 4.75;
const FOOD_TAX_RATE = 2.0;

export function calculateTax(county: County, subtotal: number, foodSubtotal: number): TaxInfo {
  const nonFoodSubtotal = subtotal - foodSubtotal;

  const countyTax = roundToTwo((nonFoodSubtotal / 100) * county.taxRate);
  const stateTax = roundToTwo((nonFoodSubtotal / 100) * STATE_TAX_RATE);
  const foodTax = roundToTwo((foodSubtotal / 100) * FOOD_TAX_RATE);
  const total = roundToTwo(subtotal + stateTax + foodTax + countyTax);

  return {
    total,
    stateTax,
    countyTax,
    foodTax,
    foodSubtotal,
    nonFoodSubtotal,
  };
}
