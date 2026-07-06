import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import apiClient from "../api/apiClient";

const TableContext = createContext();

export const useTables = () => useContext(TableContext);

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  const fetchTables = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await apiClient.get("/api/tables");
      setTables(data.map((t) => ({ ...t, id: t._id || t.id })));
    } catch (err) {
      console.error("Error fetching tables", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();

    if (!socket) return;

    // Listen for the event from the backend and re-fetch
    socket.on("tablesUpdated", fetchTables);

    return () => {
      socket.off("tablesUpdated", fetchTables);
    };
  }, [fetchTables, socket]);

  const updateTableStatus = async (
    id,
    newStatus,
    customerName = "No Customer"
  ) => {
    try {
      await apiClient.put(`/api/tables/${id}`, {
        status: newStatus,
        currentCustomer: customerName,
      });
      fetchTables();
    } catch (err) {
      console.error("Error updating table status", err);
    }
  };

  const addTable = async (newTable) => {
    try {
      await apiClient.post("/api/tables", newTable);
      fetchTables();
    } catch (err) {
      console.error("Error adding table", err);
      throw new Error(err.response?.data?.message || "Failed to add table");
    }
  };

  const deleteTable = async (id) => {
    try {
      await apiClient.delete(`/api/tables/${id}`);
      fetchTables();
    } catch (err) {
      console.error("Error deleting table", err);
    }
  };

  const editTable = async (id, updatedTableData) => {
    try {
      await apiClient.put(`/api/tables/${id}`, updatedTableData);
      fetchTables();
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
        isLoading,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
