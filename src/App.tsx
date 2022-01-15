import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { TaxCalc } from './components/TaxCalc';

function App() {
  return (
    <ChakraProvider>
      <TaxCalc></TaxCalc>
    </ChakraProvider>
  );
}

export default App;
