import React from 'react';
import { Transaction } from './Transaction';
import { County, countyMap } from '../data/counties';
import { TaxInfo } from '../utils/calculateTax';
import { Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { Table } from '@chakra-ui/react';
import { roundToTwo } from '../utils/roundToTwo';

interface Props {
  records: Transaction[];
}

export const Summary: React.FC<Props> = ({ records }) => {
  const recordsByCounty = records.reduce((acc, record) => {
    const recordCounty = countyMap[record.countyId];
    if (!recordCounty) return acc;

    if (!acc[recordCounty.id]) {
      acc[recordCounty.id] = {
        county: recordCounty,
        transactions: [],
        totals: {
          countyTax: 0,
          total: 0,
          stateTax: 0,
          foodTax: 0,
        },
      };
    }

    acc[recordCounty.id].transactions.push(record);

    acc[recordCounty.id].totals.countyTax += record.taxInfo.countyTax;
    acc[recordCounty.id].totals.total += record.taxInfo.total;
    acc[recordCounty.id].totals.foodTax += record.taxInfo.foodTax;
    acc[recordCounty.id].totals.stateTax += record.taxInfo.stateTax;

    return acc;
  }, {} as Record<string, { county: County; transactions: Transaction[]; totals: TaxInfo }>);

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
              <Td isNumeric>{roundToTwo(transactions.length)}</Td>
              <Td isNumeric>{roundToTwo(totals.countyTax)}</Td>
              <Td isNumeric>{roundToTwo(totals.foodTax)}</Td>
              <Td isNumeric>{roundToTwo(totals.stateTax)}</Td>
              <Td isNumeric>{roundToTwo(totals.total)}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Total</Th>
            <Th isNumeric>{roundToTwo(fullTotals.transactionCount)}</Th>
            <Th isNumeric>{roundToTwo(fullTotals.countyTax)}</Th>
            <Th isNumeric>{roundToTwo(fullTotals.foodTax)}</Th>
            <Th isNumeric>{roundToTwo(fullTotals.stateTax)}</Th>
            <Th isNumeric>{roundToTwo(fullTotals.total)}</Th>
          </Tr>
        </Tfoot>
      </Table>
    </div>
  );
};
