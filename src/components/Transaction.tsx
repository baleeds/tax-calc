import { Badge, Box } from '@chakra-ui/react';
import React from 'react';
import { County } from '../data/counties';

export interface Transaction {
  id: string;
  description: string;
  county: County;
  subTotal: number;
  foodSubTotal: number;
}

interface Props {
  transaction: Transaction;
}

export const Transaction: React.FC<Props> = ({ transaction }) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="blue">
            {transaction.county.name}
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {transaction.county.taxRate}%
          </Box>
        </Box>

        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
          {transaction.description}
        </Box>

        <Box>
          <Box as="span" color="gray.600" fontSize="sm" mr={2}>
            Subtotal:
          </Box>
          ${transaction.subTotal.toFixed(2)}
        </Box>
      </Box>
    </Box>
  );
};
