import React, { useState, useMemo, useRef, useEffect } from "react";
import "../../styles/invoices.css";
import {
  Search,
  Plus,
  Download,
  Eye,
  Printer,
  MoreVertical,
  FileText,
  DollarSign,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  CheckCircle,
  Filter,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useTables } from "../../context/TableContext";

const ITEMS_PER_PAGE = 5;

const Invoices = () => {
  const {
    orders = [],
    completeOrder,
    cancelOrder,
    addOrder,
    fetchOrders,
  } = useOrders() || {};
  const { updateTableStatus, fetchTables } = useTables() || {};

  useEffect(() => {
    if (fetchOrders) fetchOrders();
    if (fetchTables) fetchTables();
  }, [fetchOrders, fetchTables]);

  // Dynamically map global orders into the standard Invoice format
  const invoices = useMemo(() => {
    return orders
      .map((order) => {
        const subtotal = (order.items || []).reduce(
          (sum, item) => sum + item.qty * item.price,
          0
        );
        const total = subtotal + (subtotal > 0 ? 50 : 0); // VAT included, add default Service Charge

        return {
          id: order.id,
          date: order.date || new Date().toLocaleDateString(),
          customer: order.customer || "Walk-in Customer",
          amount: `Rs. ${total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          status:
            order.status === "Completed"
              ? "Paid"
              : order.status === "Cancelled"
              ? "Cancelled"
              : "Pending",
          method: order.paymentMethod || "Cash/Card",
          items: order.items || [],
        };
      })
      .reverse(); // Reverse so newest invoices appear at the top
  }, [orders]);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Feature specific toggle Hooks
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Triggers Modal View
  const [activeDropdownId, setActiveDropdownId] = useState(null); // Triggers Context Menu
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const filterMenuRef = useRef(null);

  // New Custom Invoice Modal State
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    customer: "",
    method: "Cash",
    items: [],
  });
  const [newItemInput, setNewItemInput] = useState({
    name: "",
    qty: 1,
    price: 0,
  });

  // Close context dropdown menus when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 1. Filter layout setup tracking search query changes
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        String(invoice.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(invoice.customer || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;
      const matchesMethod =
        methodFilter === "All" ||
        (invoice.method || "")
          .toLowerCase()
          .includes(methodFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [invoices, searchTerm, statusFilter, methodFilter]);

  // 2. Pagination Calculations
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedInvoices = useMemo(() => {
    return filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInvoices, startIndex]);

  const displayStartIndex = totalItems === 0 ? 0 : startIndex + 1;
  const displayEndIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  // Actions handling operations
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePrint = (invoice) => {
    setActiveDropdownId(null);
    setSelectedInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleUpdateStatus = (id, newStatus) => {
    if (newStatus === "Paid" && completeOrder) {
      completeOrder(id); // Use the global context to mark the order as paid!

      // Automatically free up the table globally for this order
      const originalOrder = orders.find((o) => o.id === id);
      if (originalOrder && originalOrder.table && updateTableStatus) {
        const match = originalOrder.table.match(/\d+/);
        if (match) {
          updateTableStatus(parseInt(match[0], 10), "Available", "No Customer");
        }
      }
    } else if (newStatus === "Cancelled" && cancelOrder) {
      cancelOrder(id);
      const originalOrder = orders.find((o) => o.id === id);
      if (originalOrder && originalOrder.table && updateTableStatus) {
        const match = originalOrder.table.match(/\d+/);
        if (match) {
          updateTableStatus(parseInt(match[0], 10), "Available", "No Customer");
        }
      }
    }

    setActiveDropdownId(null);
  };

  // Functions for New Invoice handling
  const handleAddNewItem = () => {
    if (!newItemInput.name || newItemInput.price < 0 || newItemInput.qty < 1)
      return;
    setNewInvoiceData({
      ...newInvoiceData,
      items: [...newInvoiceData.items, newItemInput],
    });
    setNewItemInput({ name: "", qty: 1, price: 0 });
  };

  const handleCreateInvoice = () => {
    if (newInvoiceData.items.length === 0) {
      alert("Please add at least one item to the invoice.");
      return;
    }

    const subtotal = newInvoiceData.items.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );
    const newInv = {
      id: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
      customer: newInvoiceData.customer || "Walk-in Customer",
      paymentMethod: newInvoiceData.method,
      items: newInvoiceData.items,
      amount: subtotal,
      status: "Completed",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      table: "Walk-in",
    };

    if (addOrder) {
      addOrder(newInv);
    } else {
      console.log("New Invoice Data:", newInv);
      alert("Invoice processed successfully!");
    }

    setIsNewInvoiceOpen(false);
    setNewInvoiceData({ customer: "", method: "Cash", items: [] });
  };

  return (
    <div className="invoices-page">
      {/* PRINT-ONLY STYLES FOR THERMAL PRINTER */}
      <style>
        {`
        @media print {
          @page { margin: 0; size: 80mm auto; }
          html, body {
            width: 80mm;
            background: #fff;
            margin: 0;
            padding: 0;
          }
          body * {
            visibility: hidden;
          }
          /* Completely collapse layout structures that stretch the page width */
          .sidebar, .navbar, header, footer, .invoices-page > *:not(#printable-invoice-container) {
            display: none !important;
          }
          .invoices-page {
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            min-width: 0 !important;
            background: transparent !important;
          }
          #printable-invoice-container, #printable-invoice-container * {
            visibility: visible;
          }
          #printable-invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            margin: 0;
            padding: 5mm;
            font-family: 'Courier New', monospace;
            color: #000;
            font-size: 12px;
            background: #fff;
          }
        }
        @media screen {
          #printable-invoice-container {
            display: none;
          }
        }
        `}
      </style>

      {/* Header Layout */}
      <div className="invoice-top">
        <div>
          <h1>Invoices</h1>
          <p>
            Home <span>&rsaquo;</span> Invoices
          </p>
        </div>
        <div className="invoice-actions">
          <div style={{ position: "relative" }} ref={filterMenuRef}>
            <button
              className="filter-btn"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Filter size={16} /> Filter
            </button>
            {isFilterMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  right: 0,
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  zIndex: 50,
                  minWidth: "160px",
                  textAlign: "left",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#64748b",
                  }}
                >
                  Payment Method
                </label>
                <select
                  value={methodFilter}
                  onChange={(e) => {
                    setMethodFilter(e.target.value);
                    setCurrentPage(1);
                    setIsFilterMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    fontSize: "13px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <option value="All">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Khalti">Khalti</option>
                </select>
              </div>
            )}
          </div>
          <button className="new-btn" onClick={() => setIsNewInvoiceOpen(true)}>
            <Plus size={16} /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="invoice-stats">
        <div className="invoice-card">
          <div className="card-icon blue">
            <FileText size={20} />
          </div>
          <div>
            <h4>Total Invoices</h4>
            <h2>{invoices.length}</h2>
            <span className="text-slate-400">0% vs yesterday</span>
          </div>
        </div>
        <div className="invoice-card">
          <div className="card-icon green-bg">
            <DollarSign size={20} />
          </div>
          <div>
            <h4>Paid Invoices</h4>
            <h2>{invoices.filter((i) => i.status === "Paid").length}</h2>
            <span className="text-slate-400">0% vs yesterday</span>
          </div>
        </div>
        <div className="invoice-card">
          <div className="card-icon orange-bg">
            <Clock size={20} />
          </div>
          <div>
            <h4>Pending Invoices</h4>
            <h2>{invoices.filter((i) => i.status === "Pending").length}</h2>
            <span className="text-slate-400">0% vs yesterday</span>
          </div>
        </div>
        <div className="invoice-card">
          <div className="card-icon red-bg">
            <XCircle size={20} />
          </div>
          <div>
            <h4>Cancelled Invoices</h4>
            <h2>{invoices.filter((i) => i.status === "Cancelled").length}</h2>
            <span className="text-slate-400">0% vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Primary Table Ledger Card Workspace */}
      <div className="invoice-table-card">
        <div className="table-header">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by Invoice ID or Customer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="table-buttons">
            <select
              className="status-dropdown"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button className="export-btn">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Invoice Data Listing Grid */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-id">{invoice.id}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.customer}</td>
                  <td>{invoice.amount}</td>
                  <td>
                    <span className={`status ${invoice.status.toLowerCase()}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>{invoice.method}</td>
                  <td>
                    <div className="action-buttons-wrapper">
                      {/* View Details Action Button */}
                      <button
                        title="View Details"
                        className="icon-action-btn"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <Eye size={16} />
                      </button>

                      {/* Print Command Direct Action Button */}
                      <button
                        title="Print Invoice"
                        className="icon-action-btn"
                        onClick={() => handlePrint(invoice)}
                      >
                        <Printer size={16} />
                      </button>

                      {/* Cancel Order Action Button */}
                      {invoice.status !== "Cancelled" &&
                        invoice.status !== "Paid" && (
                          <button
                            title="Cancel Order"
                            className="icon-action-btn text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() =>
                              handleUpdateStatus(invoice.id, "Cancelled")
                            }
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                      {/* Context Popover Dropdown Action Control */}
                      <div className="inline-dropdown-anchor">
                        <button
                          title="More Actions"
                          className={`icon-action-btn ${
                            activeDropdownId === invoice.id
                              ? "active-focus"
                              : ""
                          }`}
                          onClick={() =>
                            setActiveDropdownId(
                              activeDropdownId === invoice.id
                                ? null
                                : invoice.id
                            )
                          }
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeDropdownId === invoice.id && (
                          <div className="context-action-menu" ref={menuRef}>
                            <button onClick={() => setSelectedInvoice(invoice)}>
                              <Eye size={14} /> Full View
                            </button>
                            <button onClick={() => handlePrint(invoice)}>
                              <Printer size={14} /> Print Job
                            </button>
                            <hr />
                            {invoice.status !== "Paid" && (
                              <button
                                className="text-green"
                                onClick={() =>
                                  handleUpdateStatus(invoice.id, "Paid")
                                }
                              >
                                <CheckCircle size={14} /> Mark Paid
                              </button>
                            )}
                            {invoice.status !== "Cancelled" && (
                              <button
                                className="text-red"
                                onClick={() =>
                                  handleUpdateStatus(invoice.id, "Cancelled")
                                }
                              >
                                <XCircle size={14} /> Cancel Order
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data-fallback">
                  No records matching your active criteria filters were found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Dynamic Pagination Footer Navigation Links */}
        <div className="pagination">
          <p>
            Showing {displayStartIndex} to {displayEndIndex} of {totalItems}{" "}
            entries
          </p>
          <div className="pages">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="arrow-btn"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                className={currentPage === idx + 1 ? "active-page" : ""}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="arrow-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE INVOICE MODAL VIEW WINDOW OVERLAY */}
      {selectedInvoice && (
        <div
          className="invoice-modal-backdrop"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="invoice-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-row">
              <h3>Invoice Breakdown Details</h3>
              <button
                className="close-modal-x"
                onClick={() => setSelectedInvoice(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-meta-grid">
              <div>
                <span className="lbl">Invoice Number</span>
                <p className="val highlight-id">{selectedInvoice.id}</p>
              </div>
              <div>
                <span className="lbl">Transaction Date</span>
                <p className="val">{selectedInvoice.date}</p>
              </div>
              <div>
                <span className="lbl">Payment Target Client</span>
                <p className="val">{selectedInvoice.customer}</p>
              </div>
              <div>
                <span className="lbl">Gateway Channel</span>
                <p className="val">{selectedInvoice.method}</p>
              </div>
            </div>

            <div className="items-billing-ledger">
              <h4>Charged Items Breakdown</h4>
              <table className="modal-items-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th className="txt-center">Qty</th>
                    <th className="txt-right">Unit Price</th>
                    <th className="txt-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className="txt-center">{item.qty}</td>
                      <td className="txt-right">Rs. {item.price.toFixed(2)}</td>
                      <td className="txt-right font-bold">
                        Rs. {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-summary-footer">
              <div className="status-footer-badge">
                Status:{" "}
                <span
                  className={`status ${selectedInvoice.status.toLowerCase()}`}
                >
                  {selectedInvoice.status}
                </span>
              </div>
              <div className="grand-total-block">
                <span>Grand Total:</span>
                <h3>{selectedInvoice.amount}</h3>
              </div>
            </div>

            <div className="modal-actions-footer-bar">
              {selectedInvoice.status !== "Cancelled" &&
                selectedInvoice.status !== "Paid" && (
                  <button
                    className="modal-cancel-btn"
                    style={{
                      background: "#fff1f2",
                      color: "#e11d48",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginRight: "auto",
                    }}
                    onClick={() =>
                      handleUpdateStatus(selectedInvoice.id, "Cancelled")
                    }
                  >
                    <XCircle size={16} /> Cancel Order
                  </button>
                )}
              <button
                className="modal-print-btn"
                onClick={() => handlePrint(selectedInvoice)}
              >
                <Printer size={16} /> Send to Printer Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED PRINTABLE INVOICE RECEIPT */}
      {selectedInvoice && (
        <div id="printable-invoice-container">
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h2 style={{ fontSize: "18px", margin: "0 0 5px 0" }}>
              ASLENIX RESTAURANT
            </h2>
            <p style={{ margin: "2px 0" }}>Kathmandu, Nepal</p>
            <p style={{ margin: "2px 0" }}>Tel: +977 9812345678</p>
          </div>

          <div
            style={{
              borderBottom: "1px dashed #000",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Bill No:</span> <span>{selectedInvoice.id}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Date:</span> <span>{selectedInvoice.date}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Customer:</span> <span>{selectedInvoice.customer}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Method:</span> <span>{selectedInvoice.method}</span>
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
              marginBottom: "10px",
              borderBottom: "1px dashed #000",
              paddingBottom: "10px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px dashed #000",
                    paddingBottom: "5px",
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    textAlign: "center",
                    borderBottom: "1px dashed #000",
                    paddingBottom: "5px",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    textAlign: "right",
                    borderBottom: "1px dashed #000",
                    paddingBottom: "5px",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items?.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "5px 0" }}>{item.name}</td>
                  <td style={{ textAlign: "center", padding: "5px 0" }}>
                    {item.qty}
                  </td>
                  <td style={{ textAlign: "right", padding: "5px 0" }}>
                    Rs. {(item.qty * (parseFloat(item.price) || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "14px",
              marginTop: "10px",
              borderTop: "1px dashed #000",
              paddingTop: "10px",
            }}
          >
            <span>GRAND TOTAL:</span>
            <span>{selectedInvoice.amount}</span>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            <p>Thank you for your visit!</p>
            <p>Please come again.</p>
          </div>
        </div>
      )}

      {/* CREATE NEW INVOICE MODAL */}
      {isNewInvoiceOpen && (
        <div
          className="invoice-modal-backdrop"
          onClick={() => setIsNewInvoiceOpen(false)}
        >
          <div
            className="invoice-modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px" }}
          >
            <div className="modal-header-row">
              <h3>Create Custom Invoice</h3>
              <button
                className="close-modal-x"
                onClick={() => setIsNewInvoiceOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Customer Info */}
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "6px",
                      color: "#64748b",
                    }}
                  >
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={newInvoiceData.customer}
                    onChange={(e) =>
                      setNewInvoiceData({
                        ...newInvoiceData,
                        customer: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      outline: "none",
                      fontSize: "14px",
                    }}
                    placeholder="Walk-in Customer"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "6px",
                      color: "#64748b",
                    }}
                  >
                    Payment Method
                  </label>
                  <select
                    value={newInvoiceData.method}
                    onChange={(e) =>
                      setNewInvoiceData({
                        ...newInvoiceData,
                        method: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      outline: "none",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="eSewa">eSewa</option>
                    <option value="Khalti">Khalti</option>
                  </select>
                </div>
              </div>

              {/* Items Management */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#64748b",
                  }}
                >
                  Add Items
                </label>
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
                >
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItemInput.name}
                    onChange={(e) =>
                      setNewItemInput({ ...newItemInput, name: e.target.value })
                    }
                    style={{
                      flex: 2,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={newItemInput.qty || ""}
                    onChange={(e) =>
                      setNewItemInput({
                        ...newItemInput,
                        qty: parseInt(e.target.value) || 0,
                      })
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    min="0"
                    value={newItemInput.price === 0 ? "" : newItemInput.price}
                    onChange={(e) =>
                      setNewItemInput({
                        ...newItemInput,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleAddNewItem}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#334155",
                      transition: "0.2s",
                    }}
                  >
                    Add
                  </button>
                </div>

                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                >
                  <table className="modal-items-table" style={{ margin: 0 }}>
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "#f8fafc",
                      }}
                    >
                      <tr>
                        <th>Item</th>
                        <th className="txt-center">Qty</th>
                        <th className="txt-right">Price</th>
                        <th className="txt-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {newInvoiceData.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td className="txt-center">{item.qty}</td>
                          <td className="txt-right">
                            Rs. {item.price.toFixed(2)}
                          </td>
                          <td className="txt-center">
                            <button
                              onClick={() => {
                                const newItems = [...newInvoiceData.items];
                                newItems.splice(idx, 1);
                                setNewInvoiceData({
                                  ...newInvoiceData,
                                  items: newItems,
                                });
                              }}
                              style={{
                                color: "#ef4444",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                              }}
                              title="Remove Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {newInvoiceData.items.length === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            style={{
                              textAlign: "center",
                              color: "#94a3b8",
                              padding: "20px",
                            }}
                          >
                            No items added yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #f1f5f9",
                backgroundColor: "#f8fafc",
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "900",
                  color: "#0f172a",
                }}
              >
                Total: Rs.{" "}
                {newInvoiceData.items
                  .reduce((sum, i) => sum + i.qty * i.price, 0)
                  .toFixed(2)}
              </div>
              <button
                onClick={handleCreateInvoice}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
                }}
              >
                <CheckCircle size={18} /> Create & Settle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
