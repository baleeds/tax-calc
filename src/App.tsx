import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { TaxCalc } from './components/TaxCalc';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

function App() {
  return (
    <ChakraProvider>
      <TaxCalc></TaxCalc>
    </ChakraProvider>
  );
}

export default App;
