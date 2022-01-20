import { Transaction } from './Transaction';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { countyOptions } from '../data/counties';
import { toDecimal } from '../utils/toDecimal';
import { calculateTax } from '../utils/calculateTax';
import { v4 as uuid } from 'uuid';
import { Select } from 'chakra-react-select';
import { roundToTwo } from '../utils/roundToTwo';

export interface EntryFormProps {
  addTransaction: (transaction: Transaction) => void;
}

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const toCurrency = (num: number) => {
  return formatter.format(num);
};

export const EntryForm: React.FC<EntryFormProps> = (props) => {
  const toast = useToast();

  const [description, setDescription] = useState('');
  const [countyOption, setCountyOption] = useState(countyOptions[0]);
  const [subTotalAmount, setSubTotalAmount] = useState('0.00');
  const [foodSubTotalAmount, setFoodSubTotalAmount] = useState('0.00');

  const taxInfo = useMemo(() => {
    const subTotalNumber = toDecimal(subTotalAmount);
    const foodSubTotalNumber = toDecimal(foodSubTotalAmount);

    if (subTotalNumber === undefined || foodSubTotalNumber === undefined || countyOption?.value === undefined) {
      return undefined;
    }

    if (subTotalNumber < foodSubTotalNumber) {
      return undefined;
    }

    return calculateTax(countyOption.value, subTotalNumber, foodSubTotalNumber);
  }, [countyOption, subTotalAmount, foodSubTotalAmount]);

  const descriptionFieldRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (taxInfo === undefined) {
      toast({
        title: 'Cannot add transaction',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    const newRecord: Transaction = {
      id: uuid(),
      countyId: countyOption.value.id,
      description,
      taxInfo,
    };

    props.addTransaction(newRecord);

    descriptionFieldRef.current?.focus();

    setDescription('');
    setSubTotalAmount('0.00');
    setFoodSubTotalAmount('0.00');
  }

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

  useEffect(() => {});

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel htmlFor="county">County</FormLabel>
          <Select
            options={countyOptions}
            value={countyOption}
            onChange={(options) => setCountyOption(options ?? countyOptions[0])}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionFieldRef}
          />
          <FormHelperText>Optional</FormHelperText>
        </FormControl>

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

        {/*<StatGroup>*/}
        {/*  <Stat>*/}
        {/*    <StatLabel>Total</StatLabel>*/}
        {/*    <StatNumber>${ taxInfo?.total ?? '0.00' }</StatNumber>*/}
        {/*    <StatHelpText>Tax: ${taxInfo?.totalTax ?? '0.00' }</StatHelpText>*/}
        {/*  </Stat>*/}

        {/*  <Stat>*/}
        {/*    <StatLabel>Non-Food Tax</StatLabel>*/}
        {/*    <StatNumber>${ taxInfo?. ?? '0.00' }</StatNumber>*/}
        {/*    /!*<StatHelpText>Tax: ${taxInfo?.totalTax ?? '0.00' }</StatHelpText>*!/*/}
        {/*  </Stat>*/}
        {/*  */}
        {/*  <Stat>*/}
        {/*      <StatLabel>Total</StatLabel>*/}
        {/*      <StatNumber>${ taxInfo?.total ?? '0.00' }</StatNumber>*/}
        {/*      <StatHelpText>Tax: ${taxInfo?.totalTax ?? '0.00' }</StatHelpText>*/}
        {/*    </Stat>*/}
        {/*</StatGroup>*/}

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
              <Td>Full total</Td>
              <Td isNumeric>{toCurrency(taxInfo?.total ?? 0)}</Td>
            </Tr>
          </Tbody>
        </Table>

        <Button colorScheme="teal" type="submit">
          Add
        </Button>
      </VStack>
    </form>
  );
};
