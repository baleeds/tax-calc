import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  NumberInput,
  NumberInputField,
  VStack,
} from '@chakra-ui/react';
import { County } from '../data/counties';
import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useState } from 'react';
import { calculateTax, getTotalForTaxAmounts, splitCountyAndStateTax, TaxInfo } from '../utils/calculateTax';
import { toDecimal } from '../utils/toDecimal';
import { roundToTwo } from '../utils/roundToTwo';

interface Props {
  taxInfo: TaxInfo | undefined;
  setTaxInfo: Dispatch<SetStateAction<TaxInfo | undefined>>;
  county: County | undefined;
  tabResetFn: MutableRefObject<(() => void) | undefined>;
}

export const ManualEntryForm: React.FC<Props> = ({ taxInfo, setTaxInfo, county, tabResetFn }) => {
  const [normalTax, setNormalTax] = useState('0.00');
  const [foodTax, setFoodTax] = useState('0.00');

  useEffect(() => {
    tabResetFn.current = () => {
      setNormalTax('0.00');
      setFoodTax('0.00');
    };
  }, []);

  useEffect(() => {
    const normalTaxNumber = toDecimal(normalTax);
    const foodTaxNumber = toDecimal(foodTax);

    if (normalTaxNumber === undefined || foodTaxNumber === undefined || county === undefined) {
      if (!taxInfo) setTaxInfo(undefined);
      return;
    }

    const { countyTax, stateTax } = splitCountyAndStateTax(normalTaxNumber, county);
    const total = getTotalForTaxAmounts(normalTaxNumber, foodTaxNumber, county);

    const newTaxInfo: TaxInfo = {
      foodTax: foodTaxNumber,
      stateTax,
      countyTax,
      total,
    };

    setTaxInfo(newTaxInfo);
  }, [county, normalTax, foodTax]);

  return (
    <VStack spacing={5} align="stretch">
      <FormControl>
        <FormLabel htmlFor="normalTax">Normal tax</FormLabel>
        <NumberInput
          name="normalTax"
          defaultValue={0}
          precision={2}
          step={1}
          value={normalTax}
          onChange={(value) => setNormalTax(value)}
        >
          <NumberInputField />
        </NumberInput>
        <FormHelperText>Non-food tax amount</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="foodTax">Food tax</FormLabel>
        <NumberInput
          name="foodTax"
          defaultValue={0}
          precision={2}
          step={1}
          value={foodTax}
          onChange={(value) => setFoodTax(value)}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="total">Verify total</FormLabel>
        <NumberInput defaultValue={0} precision={2} value={taxInfo?.total ?? 0} disabled={true}>
          <NumberInputField />
        </NumberInput>
      </FormControl>
    </VStack>
  );
};
