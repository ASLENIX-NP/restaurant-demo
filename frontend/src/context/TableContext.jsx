import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";

const TableContext = createContext();

export const useTables = () => useContext(TableContext);

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([]);

  const fetchTables = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5001/api/tables", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTables(data.map((t) => ({ ...t, id: t._id || t.id })));
      }
    } catch (err) {
      console.error("Error fetching tables", err);
    }
  }, []);

  useEffect(() => {
    fetchTables();

    const socket = io("http://localhost:5001");

    // Listen for the event from the backend and re-fetch
    socket.on("tablesUpdated", fetchTables);

    return () => socket.disconnect();
  }, [fetchTables]);

  const updateTableStatus = async (
    id,
    newStatus,
    customerName = "No Customer"
  ) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/tables/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          currentCustomer: customerName,
        }),
      });
      if (res.ok) {
        fetchTables();
      }
    } catch (err) {
      console.error("Error updating table status", err);
    }
  };

  const addTable = async (newTable) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTable),
      });
      if (res.ok) {
        fetchTables();
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add table");
      }
    } catch (err) {
      console.error("Error adding table", err);
      throw err;
    }
  };

  const deleteTable = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/tables/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchTables();
      }
    } catch (err) {
      console.error("Error deleting table", err);
    }
  };

  const editTable = async (id, updatedTableData) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/tables/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTableData),
      });
      if (res.ok) {
        fetchTables();
      }
    } catch (err) {
      console.error("Error editing table", err);
    }
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
        fetchTables,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
