﻿import React, { useEffect, useState } from 'react';
import { Heading, Tab, TabList, TabPanel, TabPanels, Tabs, useToast, VStack } from '@chakra-ui/react';
import { Transaction } from './Transaction';
import { Summary } from './Summary';
import { storage } from '../data/localStorage';
import { Header } from './Header';
import { EntryForm } from './EntryForm';
import { exportJson } from '../data/exportJson';
import { importJson } from '../data/importJson';
import { TransactionsGrid } from './TransactionsGrid';

export const TaxCalc: React.FC = () => {
  const toast = useToast();

  const [records, setRecords] = useState<Transaction[]>(storage.transactions.get());

  useEffect(() => {
    storage.transactions.set(records);
  }, [records]);

  const addTransaction = (transaction: Transaction) => {
    setRecords((r) => [...r, transaction]);

    toast({
      title: 'Transaction added.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

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

  const exportTransactions = () => {
    const transactions = storage.transactions.get();
    const dateForName = new Date().toLocaleDateString();
    exportJson(transactions, `tax_calc_transactions_${dateForName}`);
  };

  const importTransactions = async () => {
    const transactions = await importJson();
    setRecords(transactions);
  };

  return (
    <div className="main">
      <div className="entry">
        <VStack spacing={5} align="stretch">
          <Header
            resetTransactions={resetTransactions}
            exportTransactions={exportTransactions}
            importTransactions={importTransactions}
          />
          <EntryForm addTransaction={addTransaction} />
        </VStack>
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
                {records && <TransactionsGrid transactions={records} deleteTransaction={deleteTransaction} />}
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
