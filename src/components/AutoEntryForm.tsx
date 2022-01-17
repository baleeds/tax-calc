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
import { calculateTax, TaxInfo } from '../utils/calculateTax';
import { toDecimal } from '../utils/toDecimal';

interface Props {
  taxInfo: TaxInfo | undefined;
  setTaxInfo: Dispatch<SetStateAction<TaxInfo | undefined>>;
  county: County | undefined;
  tabResetFn: MutableRefObject<(() => void) | undefined>;
}

export const AutoEntryForm: React.FC<Props> = ({ taxInfo, setTaxInfo, county, tabResetFn }) => {
  const [subTotalAmount, setSubTotalAmount] = useState('0.00');
  const [foodSubTotalAmount, setFoodSubTotalAmount] = useState('0.00');

  useEffect(() => {
    tabResetFn.current = () => {
      setSubTotalAmount('0.00');
      setFoodSubTotalAmount('0.00');
    };
  }, []);

  useEffect(() => {
    const subTotalNumber = toDecimal(subTotalAmount);
    const foodSubTotalNumber = toDecimal(foodSubTotalAmount);

    if (subTotalNumber === undefined || foodSubTotalNumber === undefined || county === undefined) {
      if (!taxInfo) setTaxInfo(undefined);
      return;
    }

    if (subTotalNumber < foodSubTotalNumber) {
      if (!taxInfo) setTaxInfo(undefined);
      return;
    }

    const newTaxInfo = calculateTax(county, subTotalNumber, foodSubTotalNumber);
    setTaxInfo(newTaxInfo);
  }, [county, subTotalAmount, foodSubTotalAmount]);

  const foodSubtotalError: string | undefined = useMemo(() => {
    const subTotalNumber = toDecimal(subTotalAmount);
    const foodSubTotalNumber = toDecimal(foodSubTotalAmount);

    if (subTotalNumber === undefined || foodSubTotalNumber === undefined) {
      return undefined;
    }

    if (foodSubTotalNumber > subTotalNumber) {
      return 'Food subtotal cannot be greater than full subtotal';
    }

    return undefined;
  }, [subTotalAmount, foodSubTotalAmount]);

  return (
    <VStack spacing={5} align="stretch">
      <FormControl>
        <FormLabel htmlFor="subTotal">Subtotal</FormLabel>
        <NumberInput
          defaultValue={0}
          precision={2}
          step={1}
          value={subTotalAmount}
          onChange={(value) => setSubTotalAmount(value)}
        >
          <NumberInputField />
        </NumberInput>
        <FormHelperText>The subtotal before taxes</FormHelperText>
      </FormControl>

      <FormControl isInvalid={!!foodSubtotalError}>
        <FormLabel htmlFor="subTotal">Food subtotal</FormLabel>
        <NumberInput
          defaultValue={0}
          precision={2}
          step={1}
          value={foodSubTotalAmount}
          onChange={(value) => setFoodSubTotalAmount(value)}
        >
          <NumberInputField />
        </NumberInput>
        {foodSubtotalError ? (
          <FormErrorMessage>{foodSubtotalError}</FormErrorMessage>
        ) : (
          <FormHelperText>The food subtotal before taxes</FormHelperText>
        )}
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
