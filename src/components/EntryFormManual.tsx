import React, { useEffect, useMemo, useState } from 'react';
import { CountyOption } from '../data/counties';
import { FOOD_TAX_RATE, manualCalculateTax, STATE_TAX_RATE, TaxInfo } from '../utils/calculateTax';
import { toDecimal } from '../utils/toDecimal';
import { FormControl, FormLabel, NumberInput, NumberInputField, Table, Tbody, Td, Tr, VStack } from '@chakra-ui/react';
import { toCurrency } from '../utils/toCurrency';

interface Props {
  countyOption: CountyOption;
  setTaxInfo: (taxInfo: TaxInfo | undefined) => void;
  onResetRef: React.MutableRefObject<(() => void) | undefined>;
}

export const EntryFormManual: React.FC<Props> = ({ countyOption, setTaxInfo, onResetRef }) => {
  const [nonFoodTaxAmount, setNonFoodTaxAmount] = useState('0.00');
  const [foodTaxAmount, setFoodTaxAmount] = useState('0.00');
  const [totalAmount, setTotalAmount] = useState('0.00');

  useEffect(() => {
    onResetRef.current = () => {
      setNonFoodTaxAmount('0.00');
      setFoodTaxAmount('0.00');
      setTotalAmount('0.00');
    };
  }, []);

  const taxInfo = useMemo(() => {
    const nonFoodTaxNumber = toDecimal(nonFoodTaxAmount);
    const foodTaxNumber = toDecimal(foodTaxAmount);
    const totalNumber = toDecimal(totalAmount);

    if (
      nonFoodTaxNumber === undefined ||
      foodTaxNumber === undefined ||
      totalNumber === undefined ||
      countyOption?.value === undefined
    ) {
      return undefined;
    }

    return manualCalculateTax(countyOption.value, nonFoodTaxNumber, foodTaxNumber, totalNumber);
  }, [countyOption, nonFoodTaxAmount, foodTaxAmount, totalAmount]);

  useEffect(() => {
    setTaxInfo(taxInfo);
  }, [taxInfo]);

  return (
    <VStack spacing={5} align="stretch">
      <FormControl>
        <FormLabel htmlFor="nonFoodTaxAmount">
          Non-food tax amount <em>({STATE_TAX_RATE + countyOption.value.taxRate}%)</em>
        </FormLabel>
        <NumberInput
          defaultValue={0}
          precision={2}
          step={1}
          value={nonFoodTaxAmount}
          onChange={(value) => setNonFoodTaxAmount(value)}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="foodTaxAmount">
          Food tax amount <em>({FOOD_TAX_RATE}%)</em>
        </FormLabel>
        <NumberInput
          defaultValue={0}
          precision={2}
          step={1}
          value={foodTaxAmount}
          onChange={(value) => setFoodTaxAmount(value)}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="totalAmount">Total amount</FormLabel>
        <NumberInput
          defaultValue={0}
          precision={2}
          step={1}
          value={totalAmount}
          onChange={(value) => setTotalAmount(value)}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>County tax</Td>
            <Td isNumeric>{toCurrency(taxInfo?.countyTax ?? 0)}</Td>
          </Tr>
          <Tr>
            <Td>State tax</Td>
            <Td isNumeric>{toCurrency(taxInfo?.stateTax ?? 0)}</Td>
          </Tr>
          <Tr>
            <Td>State + county</Td>
            <Td isNumeric>{toCurrency((taxInfo?.countyTax ?? 0) + (taxInfo?.stateTax ?? 0))}</Td>
          </Tr>
          <Tr>
            <Td>Food tax</Td>
            <Td isNumeric>{toCurrency(taxInfo?.foodTax ?? 0)}</Td>
          </Tr>
          <Tr>
            <Td>Total tax</Td>
            <Td isNumeric>
              {toCurrency((taxInfo?.countyTax ?? 0) + (taxInfo?.stateTax ?? 0) + (taxInfo?.foodTax ?? 0))}
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Full total</strong>
            </Td>
            <Td isNumeric>
              <strong>{toCurrency(taxInfo?.total ?? 0)}</strong>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </VStack>
  );
};
