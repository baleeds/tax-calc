import { Badge, Box, IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { County, countyMap } from '../data/counties';
import { TaxInfo } from '../utils/calculateTax';
import { textPlaceholder } from '../utils/placeholder';
import { DeleteIcon } from '@chakra-ui/icons';

export interface Transaction {
  id: string;
  description: string;
  countyId: string;
  taxInfo: TaxInfo;
}

interface Props {
  transaction: Transaction;
  deleteTransaction: (transactionId: string) => void;
}

export const Transaction: React.FC<Props> = ({ transaction, deleteTransaction }) => {
  const county: County | undefined = countyMap[transaction.countyId];

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" className="transaction">
      <Box p="6" display="flex" flexDirection="row" alignItems="center">
        <Box flex="1">
          <Box display="flex" alignItems="baseline">
            <Badge borderRadius="full" px="2" colorScheme="blue">
              {county?.name ?? textPlaceholder}
            </Badge>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {county?.taxRate ?? textPlaceholder}%
            </Box>
          </Box>

          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
            {transaction.description}
          </Box>

          <Box>
            <Box as="span" color="gray.600" fontSize="sm" mr={2}>
              Non-food tax:
            </Box>
            ${transaction.taxInfo.nonFoodSubtotal.toFixed(2)}
          </Box>
          <Box>
            <Box as="span" color="gray.600" fontSize="sm" mr={2}>
              Food tax:
            </Box>
            ${transaction.taxInfo.foodTax.toFixed(2)}
          </Box>
          <Box fontWeight={'semibold'}>
            <Box as="span" color="gray.600" fontSize="sm" mr={2}>
              Total:
            </Box>
            ${transaction.taxInfo.total.toFixed(2)}
          </Box>
        </Box>
        <Box flexShrink="0" className="transaction__icon-container">
          <Tooltip label="Remove transaction">
            <IconButton
              onClick={() => deleteTransaction(transaction.id)}
              colorScheme="orange"
              aria-label="Delete transaction"
              icon={<DeleteIcon />}
              variant="ghost"
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
