import { Transaction } from './Transaction';
import React, { FormEvent, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { AutoEntryForm } from './AutoEntryForm';
import { ManualEntryForm } from './ManualEntryForm';
import { countyOptions } from '../data/counties';
import { toDecimal } from '../utils/toDecimal';
import { calculateTax, TaxInfo } from '../utils/calculateTax';
import { v4 as uuid } from 'uuid';
import { Select } from 'chakra-react-select';

export interface EntryFormProps {
  addTransaction: (transaction: Transaction) => void;
}

const tabs = Object.freeze({
  auto: 0,
  manual: 0,
} as const);

export const EntryForm: React.FC<EntryFormProps> = (props) => {
  const toast = useToast();

  const [tabIndex, setTabIndex] = useState<number>(tabs.auto);
  const [description, setDescription] = useState('');
  const [countyOption, setCountyOption] = useState(countyOptions[0]);
  const [resetTabFn, setResetTabFn] = useState<(() => void) | undefined>(undefined);
  const tabResetFn = useRef<(() => void) | undefined>();
  const [taxInfo, setTaxInfo] = useState<TaxInfo | undefined>(undefined);

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
    if (tabResetFn.current) tabResetFn.current();
    setTaxInfo(undefined);
  }

  const handleTabChange = (index: number) => {
    setTaxInfo(undefined);
    setTabIndex(index);
  };

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

        <Box p={3} borderRadius="md" bg="gray.100">
          <Tabs
            variant="soft-rounded"
            colorScheme="teal"
            tabIndex={tabIndex}
            onChange={handleTabChange}
            isLazy
            size="sm"
          >
            <TabList alignItems="center">
              <Box flex={1}>
                <Heading as="h5" size="sm" color="gray.500">
                  Tax calculation
                </Heading>
              </Box>
              <Tab>Auto</Tab>
              <Tab>Manual</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AutoEntryForm
                  taxInfo={taxInfo}
                  setTaxInfo={setTaxInfo}
                  county={countyOption?.value}
                  tabResetFn={tabResetFn}
                />
              </TabPanel>
              <TabPanel>
                <ManualEntryForm
                  taxInfo={taxInfo}
                  setTaxInfo={setTaxInfo}
                  county={countyOption?.value}
                  tabResetFn={tabResetFn}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Button colorScheme="teal" type="submit">
          Add
        </Button>
      </VStack>
    </form>
  );
};
