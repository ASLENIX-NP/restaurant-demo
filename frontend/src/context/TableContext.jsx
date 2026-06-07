import React, { createContext, useContext, useState, useEffect } from "react";

const TableContext = createContext();

export const useTables = () => useContext(TableContext);

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState(() => {
    const savedTables = localStorage.getItem("restaurant_tables");
    if (savedTables) {
      return JSON.parse(savedTables);
    }
    return [
      {
        id: 1,
        name: "Table 1",
        seats: 4,
        status: "Available",
        currentCustomer: "No Customer",
      },
      {
        id: 2,
        name: "Table 2",
        seats: 2,
        status: "Available",
        currentCustomer: "No Customer",
      },
      {
        id: 3,
        name: "Table 3",
        seats: 6,
        status: "Available",
        currentCustomer: "No Customer",
      },
      {
        id: 4,
        name: "Table 4",
        seats: 4,
        status: "Available",
        currentCustomer: "No Customer",
      },
      {
        id: 5,
        name: "Table 5",
        seats: 8,
        status: "Available",
        currentCustomer: "No Customer",
      },
      {
        id: 6,
        name: "Table 6",
        seats: 2,
        status: "Available",
        currentCustomer: "No Customer",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("restaurant_tables", JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "restaurant_tables") {
        setTables(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateTableStatus = (id, newStatus, customerName = "No Customer") => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id
          ? { ...table, status: newStatus, currentCustomer: customerName }
          : table
      )
    );
  };

  const addTable = (newTable) => {
    setTables((prev) => [...prev, { ...newTable, id: Date.now() }]);
  };

  const deleteTable = (id) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
  };

  const editTable = (id, updatedTableData) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id ? { ...table, ...updatedTableData } : table
      )
    );
  };

  return (
    <TableContext.Provider
      value={{
        tables,
        setTables,
        updateTableStatus,
        addTable,
        deleteTable,
        editTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
