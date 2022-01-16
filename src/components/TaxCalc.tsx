import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { toDecimal } from '../utils/toDecimal';
import { Select } from 'chakra-react-select';
import { countyOptions } from '../data/counties';
import { calculateTax } from '../utils/calculateTax';
import { Transaction } from './Transaction';
import { Summary } from './Summary';
import { storage } from '../data/localStorage';
import { Header } from './Header';

export const TaxCalc: React.FC = () => {
  const toast = useToast();

  const [records, setRecords] = useState<Transaction[]>(storage.transactions.get());

  const [description, setDescription] = useState('');
  const [subTotalAmount, setSubTotalAmount] = useState('0.00');
  const [foodSubTotalAmount, setFoodSubTotalAmount] = useState('0.00');
  const [countyOption, setCountyOption] = useState(countyOptions[0]);

  useEffect(() => {
    storage.transactions.set(records);
  }, [records]);

  const descriptionFieldRef = useRef<HTMLInputElement>(null);

  const fullTotal = useMemo(() => {
    const taxInfo = calculateTax(
      countyOption.value,
      toDecimal(subTotalAmount) ?? 0,
      toDecimal(foodSubTotalAmount) ?? 0,
    );
    return taxInfo.total;
  }, [subTotalAmount, foodSubTotalAmount, countyOption]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const subTotalNumber = toDecimal(subTotalAmount);
    const foodSubTotalNumber = toDecimal(foodSubTotalAmount);

    if (subTotalNumber === undefined || foodSubTotalNumber === undefined || countyOption?.value === undefined) {
      toast({
        title: 'Cannot add transaction',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const taxInfo = calculateTax(countyOption.value, subTotalNumber, foodSubTotalNumber);

    const newRecord: Transaction = {
      id: uuid(),
      countyId: countyOption.value.id,
      description,
      taxInfo,
    };

    setRecords((r) => [...r, newRecord]);

    descriptionFieldRef.current?.focus();

    setDescription('');
    setSubTotalAmount('0.00');
    setFoodSubTotalAmount('0.00');

    toast({
      title: 'Transaction added.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }

  const deleteTransaction = (transactionId: string) => {
    setRecords((p) => p.filter((r) => r.id !== transactionId));

    toast({
      title: 'Transaction removed.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  const resetTransactions = () => {
    setRecords([]);

    toast({
      title: 'All transactions removed.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div className="main">
      <div className="entry">
        <form onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <Header resetTransactions={resetTransactions} />
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

            <FormControl>
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
              <FormHelperText>The food subtotal before taxes</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="total">Verify total</FormLabel>
              <NumberInput defaultValue={0} precision={2} value={fullTotal} disabled={true}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Button colorScheme="teal" type="submit">
              Add
            </Button>
          </VStack>
        </form>
      </div>

      <div className="display">
        <Tabs>
          <TabList>
            <Tab>Transactions</Tab>
            <Tab>Summary</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={3} align="stretch">
                {records.length === 0 && (
                  <Heading as="h4" size="md" color="gray.500">
                    Enter transactions to the left to get started.
                  </Heading>
                )}
                {records.map((transaction) => (
                  <Transaction transaction={transaction} deleteTransaction={deleteTransaction} />
                ))}
              </VStack>
            </TabPanel>
            <TabPanel>
              <Summary records={records} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};
