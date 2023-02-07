import React, { useEffect, useMemo, useState } from 'react';
import { CountyOption } from '../data/counties';
import { autoCalculateTax, TaxInfo } from '../utils/calculateTax';
import { toDecimal } from '../utils/toDecimal';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  NumberInput,
  NumberInputField,
  Table,
  Tbody,
  Td,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { toCurrency } from '../utils/toCurrency';

interface Props {
  countyOption: CountyOption;
  setTaxInfo: (taxInfo: TaxInfo | undefined) => void;
  onResetRef: React.MutableRefObject<(() => void) | undefined>;
}

export const EntryFormAuto: React.FC<Props> = ({ countyOption, setTaxInfo, onResetRef }) => {
  const [subTotalAmount, setSubTotalAmount] = useState('0.00');
  const [foodSubTotalAmount, setFoodSubTotalAmount] = useState('0.00');

  useEffect(() => {
    onResetRef.current = () => {
      setSubTotalAmount('0.00');
      setFoodSubTotalAmount('0.00');
    };
  }, []);

  const taxInfo = useMemo(() => {
    const subTotalNumber = toDecimal(subTotalAmount);
    const foodSubTotalNumber = toDecimal(foodSubTotalAmount);

    if (subTotalNumber === undefined || foodSubTotalNumber === undefined || countyOption?.value === undefined) {
      return undefined;
    }

    if (subTotalNumber < foodSubTotalNumber) {
      return undefined;
    }

    return autoCalculateTax(countyOption.value, subTotalNumber, foodSubTotalNumber);
  }, [countyOption, subTotalAmount, foodSubTotalAmount]);

  useEffect(() => {
    setTaxInfo(taxInfo);
  }, [taxInfo]);

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
