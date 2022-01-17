import { County } from '../data/counties';
import { roundToTwo } from './roundToTwo';

export interface TaxInfo {
  total: number;
  stateTax: number;
  countyTax: number;
  foodTax: number;
}

const STATE_TAX_RATE = 4.75;
const FOOD_TAX_RATE = 2.0;

export function calculateTax(county: County, subtotal: number, foodOnlySubtotal: number): TaxInfo {
  const nonFoodSubtotal = subtotal - foodOnlySubtotal;
  const countyTax = roundToTwo((nonFoodSubtotal / 100) * county.taxRate);
  const stateTax = roundToTwo((nonFoodSubtotal / 100) * STATE_TAX_RATE);
  const foodTax = roundToTwo((foodOnlySubtotal / 100) * FOOD_TAX_RATE);
  const total = roundToTwo(subtotal + stateTax + foodTax + countyTax);

  return {
    total,
    stateTax,
    countyTax,
    foodTax,
  };
}

export function splitCountyAndStateTax(taxAmount: number, county: County): { countyTax: number; stateTax: number } {
  const totalTaxRate = STATE_TAX_RATE + county.taxRate;

  const countyTax = roundToTwo((taxAmount / totalTaxRate) * county.taxRate);
  const stateTax = roundToTwo((taxAmount / totalTaxRate) * STATE_TAX_RATE);

  return { countyTax, stateTax };
}

export function getTotalForTaxAmounts(nonFoodTax: number, foodTax: number, county: County): number {
  const nonFoodTaxRate = STATE_TAX_RATE + county.taxRate;
  const nonFoodSubTotal = nonFoodTax / (nonFoodTaxRate / 100);
  const foodSubTotal = foodTax / (FOOD_TAX_RATE / 100);

  return roundToTwo(nonFoodSubTotal + nonFoodTax + foodSubTotal + foodTax);
}
