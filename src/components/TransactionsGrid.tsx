import React, { useEffect, useState } from 'react';
import { Transaction } from './Transaction';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { TaxInfo } from '../utils/calculateTax';
import { countyMap } from '../data/counties';
import { toCurrency } from '../utils/toCurrency';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { string } from 'yup';

export interface TransactionsGridProps {
  transactions: Transaction[];
  deleteTransaction: (transactionId: string) => void;
}

interface TransactionRow {
  id: string;
  countyName: string;
  countyTaxRate: number;
  description: string;
  taxInfo: TaxInfo;
  subTotal: number;
}

interface TransactionsGridContext {
  deleteTransaction: (transactionId: string) => void;
}

const DescriptionCellRenderer: React.FC<CustomCellRendererProps<TransactionRow, string, TransactionsGridContext>> = ({
  data,
  value,
  context,
}) => {
  return (
    <Box gap={4} flex={1} display={'flex'} alignItems={'center'}>
      {data && (
        <Tooltip label="Remove transaction">
          <IconButton
            onClick={() => context.deleteTransaction(data.id)}
            colorScheme="orange"
            aria-label="Delete transaction"
            icon={<DeleteIcon />}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
      )}
      {value}
    </Box>
  );
};

export const TransactionsGrid: React.FC<TransactionsGridProps> = ({ transactions, deleteTransaction }) => {
  const transactionRows = transactions.map(
    (t): TransactionRow => ({
      id: t.id,
      countyName: countyMap[t.countyId]?.name ?? '',
      countyTaxRate: countyMap[t.countyId]?.taxRate ?? '',
      description: t.description,
      taxInfo: t.taxInfo,
      subTotal: t.taxInfo.nonFoodSubtotal + t.taxInfo.foodSubtotal,
    }),
  );

  const [colDefs, setColDefs] = useState<ColDef<TransactionRow>[]>([
    { field: 'description', headerName: 'Description', pinned: 'left', cellRenderer: DescriptionCellRenderer },
    { field: 'countyName', headerName: 'County' },
    {
      field: 'countyTaxRate',
      headerName: 'County tax rate',
      width: 120,
      cellDataType: 'number',
      valueFormatter: (param) => `${param.value}%`,
    },
    {
      field: 'subTotal',
      headerName: 'Subtotal',
      width: 120,
      cellDataType: 'number',
      valueFormatter: (param) => `${toCurrency(param.value)}`,
    },
    {
      field: 'taxInfo.countyTax',
      headerName: 'County tax',
      width: 120,
      cellDataType: 'number',
      valueFormatter: (param) => `${toCurrency(param.value)}`,
    },
    {
      field: 'taxInfo.foodTax',
      headerName: 'Food tax',
      width: 120,
      cellDataType: 'number',
      valueFormatter: (param) => `${toCurrency(param.value)}`,
    },
    {
      field: 'taxInfo.stateTax',
      headerName: 'State tax',
      width: 120,
      cellDataType: 'number',
      valueFormatter: (param) => `${toCurrency(param.value)}`,
    },
    {
      field: 'taxInfo.total',
      headerName: 'Total',
      pinned: 'right',
      width: 120,
      cellDataType: 'number',
      valueFormatter: (param) => `${toCurrency(param.value)}`,
    },
  ]);

  const context: TransactionsGridContext = {
    deleteTransaction,
  };

  return (
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 'calc(100vh - 140px)' }} // the grid will fill the size of the parent container
    >
      <AgGridReact<TransactionRow> rowData={transactionRows} columnDefs={colDefs} context={context} />
    </div>
  );
};
