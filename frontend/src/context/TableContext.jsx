import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const TableContext =
  createContext();

export const TableProvider = ({
  children,
}) => {

  // LOAD TABLES
  const [tables, setTables] =
    useState(() => {

      const savedTables =
        localStorage.getItem(
          "restaurant_tables"
        );

      return savedTables
        ? JSON.parse(savedTables)
        : [
            {
              id: 1,
              status:
                "Available",
            },

            {
              id: 2,
              status:
                "Occupied",
            },

            {
              id: 3,
              status:
                "Reserved",
            },
          ];
    });

  // SAVE TABLES
  useEffect(() => {

    localStorage.setItem(
      "restaurant_tables",
      JSON.stringify(tables)
    );

  }, [tables]);

  // ADD TABLE
  const addTable = () => {

    const newTable = {
      id:
        tables.length + 1,

      status:
        "Available",
    };

    setTables((prev) => [
      ...prev,
      newTable,
    ]);
  };

  // REMOVE TABLE
  const removeTable = (
    id
  ) => {

    setTables((prev) =>
      prev.filter(
        (table) =>
          table.id !== id
      )
    );
  };

  return (
    <TableContext.Provider
      value={{
        tables,
        addTable,
        removeTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTables = () =>
  useContext(TableContext);