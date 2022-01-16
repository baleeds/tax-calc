import {
  Box,
  Button,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import React from 'react';

interface Props {
  resetTransactions: () => void;
}

export const Header: React.FC<Props> = ({ resetTransactions }) => {
  const resetTransactionsModal = useDisclosure();

  const confirmResetTransactions = () => {
    resetTransactionsModal.onClose();
    resetTransactions();
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Heading as="h3" size="lg">
          NC Tax Calculator
        </Heading>
        <Menu>
          <MenuButton as={IconButton} aria-label="Options" icon={<SettingsIcon />} variant="outline" />
          <MenuList>
            <MenuItem onClick={resetTransactionsModal.onOpen}>Reset all transactions</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Modal isOpen={resetTransactionsModal.isOpen} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove all transactions from this session?</ModalHeader>
          <ModalBody>
            Would you like to remove all transactions from your list? These transactions cannot be recovered once they
            are cleared.
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={resetTransactionsModal.onClose} variant="ghost">
              No, cancel
            </Button>
            <Button colorScheme="orange" onClick={confirmResetTransactions}>
              Yes, remove all transactions
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
