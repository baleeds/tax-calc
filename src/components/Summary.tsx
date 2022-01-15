import React from 'react';
import { Transaction } from './Transaction';
import { County } from '../data/counties';
import { calculateTax, TaxInfo } from '../utils/calculateTax';
import { Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { Table } from '@chakra-ui/react';

interface Props {
  records: Transaction[];
}

export const Summary: React.FC<Props> = ({ records }) => {
  const recordsByCounty = records.reduce((acc, record) => {
    if (!acc[record.county.id]) {
      acc[record.county.id] = {
        county: record.county,
        transactions: [],
        totals: {
          countyTax: 0,
          total: 0,
          stateTax: 0,
          foodTax: 0,
        },
      };
    }

    const taxInfo = calculateTax(record.county, record.subTotal, record.foodSubTotal);

    acc[record.county.id].transactions.push({
      ...record,
      taxInfo,
    });

    acc[record.county.id].totals.countyTax += taxInfo.countyTax;
    acc[record.county.id].totals.total += taxInfo.total;
    acc[record.county.id].totals.foodTax += taxInfo.foodTax;
    acc[record.county.id].totals.stateTax += taxInfo.stateTax;

    return acc;
  }, {} as Record<number, { county: County; transactions: Array<Transaction & { taxInfo: TaxInfo }>; totals: TaxInfo }>);

  const fullTotals = Object.values(recordsByCounty).reduce(
    (acc, group) => {
      acc.total += group.totals.total;
      acc.countyTax += group.totals.countyTax;
      acc.stateTax += group.totals.stateTax;
      acc.foodTax += group.totals.foodTax;
      acc.transactionCount += group.transactions.length;

      return acc;
    },
    {
      foodTax: 0,
      total: 0,
      countyTax: 0,
      stateTax: 0,
      transactionCount: 0,
    } as TaxInfo & { transactionCount: number },
  );

  return (
    <div className="summary">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>County</Th>
            <Th isNumeric># of Transactions</Th>
            <Th isNumeric>County tax</Th>
            <Th isNumeric>Food tax</Th>
            <Th isNumeric>State tax</Th>
            <Th isNumeric>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.values(recordsByCounty).map(({ county, transactions, totals }) => (
            <Tr>
              <Td>{county.name}</Td>
              <Td isNumeric>{transactions.length}</Td>
              <Td isNumeric>{totals.countyTax}</Td>
              <Td isNumeric>{totals.foodTax}</Td>
              <Td isNumeric>{totals.stateTax}</Td>
              <Td isNumeric>{totals.total}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Total</Th>
            <Th isNumeric>{fullTotals.transactionCount}</Th>
            <Th isNumeric>{fullTotals.countyTax}</Th>
            <Th isNumeric>{fullTotals.foodTax}</Th>
            <Th isNumeric>{fullTotals.stateTax}</Th>
            <Th isNumeric>{fullTotals.total}</Th>
          </Tr>
        </Tfoot>
      </Table>
    </div>
  );
};
