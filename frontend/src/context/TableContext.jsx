import React, { createContext, useContext, useState } from 'react';

const TableContext = createContext();

export const useTables = () => useContext(TableContext);

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([
    { id: 1, name: 'Table 1', seats: 4, status: 'Available', currentCustomer: 'No Customer' },
    { id: 2, name: 'Table 2', seats: 2, status: 'Occupied', currentCustomer: 'John Doe' },
    { id: 3, name: 'Table 3', seats: 6, status: 'Reserved', currentCustomer: 'Smith Family' },
    { id: 4, name: 'Table 4', seats: 4, status: 'Available', currentCustomer: 'No Customer' },
    { id: 5, name: 'Table 5', seats: 8, status: 'Cleaning', currentCustomer: 'No Customer' },
    { id: 6, name: 'Table 6', seats: 2, status: 'Available', currentCustomer: 'No Customer' },
  ]);

  const updateTableStatus = (id, newStatus, customerName = 'No Customer') => {
    setTables(prevTables => prevTables.map(table => 
      table.id === id ? { ...table, status: newStatus, currentCustomer: customerName } : table
    ));
  };

  const addTable = (newTable) => {
    setTables(prev => [...prev, { ...newTable, id: Date.now() }]);
  };

  const deleteTable = (id) => {
    setTables(prev => prev.filter(table => table.id !== id));
  };

  return (
    <TableContext.Provider value={{ tables, setTables, updateTableStatus, addTable, deleteTable }}>
      {children}
    </TableContext.Provider>
  );
};