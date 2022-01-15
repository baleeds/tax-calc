import React, { FormEvent, useMemo, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
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
import { County, countyOptions } from '../data/counties';
import { textPlaceholder } from '../utils/placeholder';
import { calculateTax } from '../utils/calculateTax';
import { Transaction } from './Transaction';
import { Summary } from './Summary';

export const TaxCalc: React.FC = () => {
  const toast = useToast();

  const [records, setRecords] = useState<Transaction[]>([]);

  const [description, setDescription] = useState('');
  const [subTotalAmount, setSubTotalAmount] = useState('0.00');
  const [foodSubTotalAmount, setFoodSubTotalAmount] = useState('0.00');
  const [countyOption, setCountyOption] = useState(countyOptions[0]);

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

    const newRecord: Transaction = {
      id: uuid(),
      county: countyOption.value,
      description,
      subTotal: toDecimal(subTotalAmount) ?? 0,
      foodSubTotal: toDecimal(foodSubTotalAmount) ?? 0,
    };

    setRecords((r) => [...r, newRecord]);
    setDescription('');
    setSubTotalAmount('0.00');
    setFoodSubTotalAmount('0.00');

    toast({
      title: 'Transaction added.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    descriptionFieldRef.current?.focus();
  }

  return (
    <div className="main">
      <div className="entry">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel htmlFor="state">State</FormLabel>
              <Select
                options={countyOptions}
                value={countyOption}
                onChange={(options) => setCountyOption(options ?? countyOptions[0])}
              ></Select>
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
              <FormHelperText>The food subtotal before taxes</FormHelperText>
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
                {records.map((transaction) => (
                  <Transaction transaction={transaction} />
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
