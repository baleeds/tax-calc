import { Transaction } from './Transaction';
import React, { FormEvent, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { countyOptions } from '../data/counties';
import { TaxInfo } from '../utils/calculateTax';
import { v4 as uuid } from 'uuid';
import { Select } from 'chakra-react-select';
import { EntryFormAuto } from './EntryFormAuto';
import { EntryFormManual } from './EntryFormManual';

export interface EntryFormProps {
  addTransaction: (transaction: Transaction) => void;
}

export const EntryForm: React.FC<EntryFormProps> = (props) => {
  const toast = useToast();

  const resetAuto = useRef<() => void>();
  const resetManual = useRef<() => void>();

  const [description, setDescription] = useState('');
  const [countyOption, setCountyOption] = useState(countyOptions[0]);
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
    resetAuto.current?.();
    resetManual.current?.();
  }

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

        <Tabs>
          <TabList>
            <Tab>Auto</Tab>
            <Tab>Manual</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <EntryFormAuto countyOption={countyOption} setTaxInfo={setTaxInfo} onResetRef={resetAuto} />
            </TabPanel>
            <TabPanel>
              <EntryFormManual countyOption={countyOption} setTaxInfo={setTaxInfo} onResetRef={resetManual} />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Button colorScheme="teal" type="submit">
          Add
        </Button>
      </VStack>
    </form>
  );
};
