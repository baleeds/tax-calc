import { Trusted } from 'trusted';
import * as Yup from 'yup';
import { Transaction } from '../components/Transaction';

const trusted = new Trusted({
  namespace: 'tax-calc-',
});

const taxInfoSchema = Yup.object().shape({
  total: Yup.number().required(),
  stateTax: Yup.number().required(),
  countyTax: Yup.number().required(),
  foodTax: Yup.number().required(),
  foodSubtotal: Yup.number().required(),
  nonFoodSubtotal: Yup.number().required(),
});

const transactionSchema = Yup.object().shape({
  id: Yup.string().required(),
  description: Yup.string(),
  countyId: Yup.string(),
  taxInfo: taxInfoSchema.required(),
});

export const storage = {
  transactions: trusted.array<Transaction>({
    key: 'transactions',
    defaultValue: [],
    yupSchema: Yup.array(transactionSchema),
  }),
};
