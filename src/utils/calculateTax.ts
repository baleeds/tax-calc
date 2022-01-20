import { County } from '../data/counties';
import { roundToTwo } from './roundToTwo';
import BigNumber from 'bignumber.js';

export interface TaxInfo {
  total: number;
  stateTax: number;
  countyTax: number;
  foodTax: number;
}

const STATE_TAX_RATE = new BigNumber(4.75);
const FOOD_TAX_RATE = new BigNumber(2.0);

export function calculateTax(county: County, subtotal: number, foodOnlySubtotal: number): TaxInfo {
  const nonFoodSubtotal = subtotal - foodOnlySubtotal;

  const countyTax = roundToTwo((nonFoodSubtotal / 100) * county.taxRate);
  const stateTax = roundToTwo((nonFoodSubtotal / 100) * STATE_TAX_RATE.toNumber());
  const foodTax = roundToTwo((foodOnlySubtotal / 100) * FOOD_TAX_RATE.toNumber());
  const total = roundToTwo(subtotal + stateTax + foodTax + countyTax);

  return {
    total,
    stateTax,
    countyTax,
    foodTax,
  };
}

export function splitCountyAndStateTax(taxAmount: number, county: County): { countyTax: number; stateTax: number } {
  const countyTaxRate = new BigNumber(county.taxRate);
  const totalTaxRate = STATE_TAX_RATE.plus(countyTaxRate);

  const countyTax = new BigNumber(taxAmount)
    .dividedBy(totalTaxRate)
    .multipliedBy(countyTaxRate)
    .decimalPlaces(2)
    .toNumber();

  const stateTax = new BigNumber(taxAmount)
    .dividedBy(totalTaxRate)
    .multipliedBy(STATE_TAX_RATE)
    .decimalPlaces(2)
    .toNumber();

  return { countyTax, stateTax };
}

export function getTotalForTaxAmounts(nonFoodTax: number, foodTax: number, county: County): number {
  const countyTaxRate = new BigNumber(county.taxRate);
  const nonFoodTaxNumber = new BigNumber(nonFoodTax);
  const foodTaxNumber = new BigNumber(foodTax);

  const nonFoodTaxRate = STATE_TAX_RATE.plus(countyTaxRate);
  const nonFoodSubTotal = nonFoodTaxNumber.dividedBy(nonFoodTaxRate.dividedBy(100));
  const foodSubTotal = foodTaxNumber.dividedBy(FOOD_TAX_RATE.dividedBy(100));

  return nonFoodSubTotal.plus(nonFoodTaxNumber).plus(foodSubTotal).plus(foodTaxNumber).decimalPlaces(2).toNumber();
}
