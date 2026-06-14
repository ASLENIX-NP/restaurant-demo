import "../../styles/saleshistory.css";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  DollarSign,
  Receipt,
  CreditCard,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  XCircle,
  Package,
  X,
  Filter,
  Plus,
  Trash2,
  CheckCircle,
  User,
  Table2,
  Clock,
  Download,
  FileText,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useOrders } from "../../context/OrderContext";

const ITEMS_PER_PAGE = 8;

export default function SalesHistory() {
  const { orders = [], fetchOrders, cancelOrder, addOrder } = useOrders() || {};

  useEffect(() => {
    if (fetchOrders) fetchOrders();
  }, [fetchOrders]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printMode, setPrintMode] = useState("ledger"); // 'ledger', 'single', or 'batch'
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [selectedTxns, setSelectedTxns] = useState([]);
  const menuRef = useRef(null);
  const exportMenuRef = useRef(null);

  // New Custom Invoice Modal State (Imported from Invoices.jsx)
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedTxns([]); // Clear selections when filters change
  }, [searchTerm, activeTab]);

  // Keyboard Shortcuts: Close modals on 'Escape'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsNewInvoiceOpen(false);
        setSelectedInvoice(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom Invoice Handlers
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

    if (addOrder) addOrder(newInv);

    setIsNewInvoiceOpen(false);
    setNewInvoiceData({ customer: "", method: "Cash", items: [] });
  };

  // Unified Metrics
  const completedSales = orders.filter((o) => o.status === "Completed");
  const totalSalesAmount = completedSales.reduce((acc, order) => {
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
      0
    );
    return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
  }, 0);
  const totalItemsSold = completedSales.reduce(
    (acc, order) =>
      acc + (order.items || []).reduce((sum, item) => sum + item.qty, 0),
    0
  );
  const avgOrderValue =
    completedSales.length > 0 ? totalSalesAmount / completedSales.length : 0;

  // Prepare dynamic data for the Pie Chart
  const paymentData = useMemo(() => {
    let cash = 0,
      card = 0,
      esewa = 0,
      khalti = 0;
    completedSales.forEach((order) => {
      const amt =
        order.amount ||
        (order.items || []).reduce(
          (sum, i) => sum + i.qty * (parseFloat(i.price) || 0),
          0
        ) + 50;
      if (order.paymentMethod === "Card") card += amt;
      else if (order.paymentMethod === "eSewa") esewa += amt;
      else if (order.paymentMethod === "Khalti") khalti += amt;
      else cash += amt;
    });
    return [
      { name: "Cash", value: cash, color: "#10b981" },
      { name: "Card", value: card, color: "#3b82f6" },
      { name: "eSewa", value: esewa, color: "#22c55e" },
      { name: "Khalti", value: khalti, color: "#8b5cf6" },
    ].filter((item) => item.value > 0); // Only show methods that have sales
  }, [completedSales]);

  // Map Orders to Unified Ledger Data
  const ledgerData = useMemo(() => {
    return orders
      .filter(
        (o) =>
          o.status === "Completed" ||
          o.status === "Cancelled" ||
          o.status === "Refunded"
      )
      .map((order) => {
        const subtotal = (order.items || []).reduce(
          (sum, item) => sum + item.qty * (parseFloat(item.price) || 0),
          0
        );
        const total = order.amount || subtotal + (subtotal > 0 ? 50 : 0);
        return {
          ...order,
          transactionId: `TXN-${String(order.id).replace(/\D/g, "")}`,
          totalAmount: total,
          itemCount: (order.items || []).reduce((sum, i) => sum + i.qty, 0),
        };
      })
      .reverse();
  }, [orders]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return ledgerData.filter((txn) => {
      const matchesTab = activeTab === "All" ? true : txn.status === activeTab;
      const matchesSearch =
        txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (txn.customer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPayment =
        paymentFilter === "All" ? true : txn.paymentMethod === paymentFilter;
      return matchesTab && matchesSearch && matchesPayment;
    });
  }, [ledgerData, activeTab, searchTerm, paymentFilter]);

  // Pagination
  const paginatedData = filteredData.slice(0, currentPage * ITEMS_PER_PAGE);

  const highestSale =
    completedSales.length > 0
      ? Math.max(...completedSales.map((s) => s.amount || 0))
      : 0;
  const lowestSale =
    completedSales.length > 0
      ? Math.min(...completedSales.map((s) => s.amount || 0))
      : 0;

  // Multi-Select Handlers
  const toggleSelection = (id) => {
    setSelectedTxns((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleAllSelections = () => {
    if (selectedTxns.length === filteredData.length) setSelectedTxns([]);
    else setSelectedTxns(filteredData.map((t) => t.transactionId));
  };

  const handlePrintSingle = (invoice) => {
    setPrintMode("single");
    setSelectedInvoice(invoice);
    setTimeout(() => window.print(), 300);
  };

  const handlePrintBatch = () => {
    setPrintMode("batch");
    setTimeout(() => window.print(), 300);
  };

  const handlePrintLedger = () => {
    setPrintMode("ledger");
    setTimeout(() => window.print(), 300);
  };

  const handleUpdateStatus = (id, newStatus) => {
    if (newStatus === "Cancelled" && cancelOrder) {
      if (window.confirm("Are you sure you want to void this transaction?")) {
        cancelOrder(id);
        setSelectedInvoice(null);
      }
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);

    const dataToExport =
      selectedTxns.length > 0
        ? filteredData.filter((t) => selectedTxns.includes(t.transactionId))
        : filteredData;

    if (dataToExport.length === 0) {
      alert("No data to export based on current filters.");
      setIsExporting(false);
      return;
    }

    const headers = [
      "Date",
      "Time",
      "Transaction ID",
      "Order ID",
      "Customer",
      "Items Count",
      "Method",
      "Amount",
      "Status",
    ];
    const csvRows = dataToExport.map((txn) =>
      [
        txn.date,
        txn.time,
        txn.transactionId,
        txn.id,
        `"${txn.customer || "Walk-in"}"`,
        txn.itemCount,
        txn.paymentMethod || "Cash",
        txn.totalAmount,
        txn.status,
      ].join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Transaction_Ledger_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsExporting(false), 500);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700">
          <p className="font-bold text-slate-300 text-xs mb-1">
            {payload[0].name}
          </p>
          <p className="font-black text-lg">
            Rs.{" "}
            {payload[0].value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderReceipt = (invoice) => (
    <div
      key={invoice.transactionId}
      style={{
        pageBreakAfter: "always",
        marginBottom: "20px",
        borderBottom: "1px dashed #000",
        paddingBottom: "20px",
      }}
    >
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
          <span>Receipt No:</span> <span>{invoice.transactionId}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <span>Date:</span>{" "}
          <span>
            {invoice.date} {invoice.time}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <span>Customer:</span> <span>{invoice.customer || "Walk-in"}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <span>Method:</span> <span>{invoice.paymentMethod || "Cash"}</span>
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
          {invoice.items?.map((item, idx) => (
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
        <span>
          Rs.{" "}
          {invoice.totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>

      <div
        style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}
      >
        <p>Thank you for your visit!</p>
        <p>Please come again.</p>
      </div>
    </div>
  );

  return (
    <div className="sales-history-page">
      {/* DYNAMIC SMART PRINT-ONLY STYLES */}
      <style>
        {`
        @media print {
          ${
            printMode === "ledger"
              ? `
            @page { margin: 10mm; size: auto; }
            body { background: #fff; }
            .sidebar, .navbar, header, footer { display: none !important; }
            .sales-top, .sales-stats, .sales-right, .sales-filters, .load-more { display: none !important; }
            .sales-content { display: block !important; width: 100% !important; grid-template-columns: 1fr !important; }
            .sales-left { width: 100% !important; box-shadow: none !important; border: none !important; }
            .print-hide-row { display: none !important; }
            .print-container { display: none !important; }
            .details-btn, .arrow-icon { display: none !important; }
          `
              : `
            @page { margin: 0; size: 80mm auto; }
            html, body { width: 80mm !important; background: #fff !important; margin: 0 !important; padding: 0 !important; }
            .sidebar, .navbar, header, footer { display: none !important; }
            .sales-history-page > *:not(.print-container) { display: none !important; }
            .sales-history-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
            .print-container { position: absolute !important; left: 0 !important; top: 0 !important; width: 80mm !important; margin: 0 !important; padding: 5mm !important; font-family: 'Courier New', monospace; color: #000; font-size: 12px; background: #fff; display: block !important; z-index: 99999; }
          `
          }
        }
        @media screen {
          .print-container { display: none; }
        }
        `}
      </style>

      {/* HEADER */}
      <div className="sales-top">
        <div>
          <h1>Sales History</h1>
          <p>Unified Ledger: Sales, Payments & Custom Invoices</p>
        </div>
        <div className="sales-top-actions flex gap-3">
          <button className="date-btn">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </button>
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isExporting}
              className="bg-white border border-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition shadow-sm"
            >
              <Download size={16} />{" "}
              {isExporting
                ? "Exporting..."
                : selectedTxns.length > 0
                ? `Export (${selectedTxns.length})`
                : "Export"}
            </button>
            {isExportMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-xl w-56 z-50 overflow-hidden text-left animate-slide-in">
                {selectedTxns.length > 0 ? (
                  <>
                    <button
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        handlePrintBatch();
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50"
                    >
                      <Printer size={16} className="text-emerald-500" /> Print
                      Selected Receipts
                    </button>
                    <button
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        handleExportCSV();
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <FileText size={16} className="text-blue-500" /> Download
                      Selected CSV
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        handlePrintLedger();
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50"
                    >
                      <Printer size={16} className="text-emerald-500" /> Print
                      Ledger Page
                    </button>
                    <button
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        handleExportCSV();
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <FileText size={16} className="text-blue-500" /> Download
                      CSV (All)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsNewInvoiceOpen(true)}
            className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition shadow-sm"
          >
            <Plus size={16} /> Custom Invoice
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="sales-stats">
        <div className="sales-stat-card">
          <div className="stat-icon green">📈</div>
          <div>
            <h4>Total Sales</h4>
            <h2>
              Rs.{" "}
              {totalSalesAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
            <span>0% vs yesterday</span>
          </div>
        </div>
        <div className="sales-stat-card">
          <div className="stat-icon blue">🛒</div>
          <div>
            <h4>Total Orders</h4>
            <h2>{completedSales.length}</h2>
            <span>0 vs yesterday</span>
          </div>
        </div>
        <div className="sales-stat-card">
          <div className="stat-icon orange">📦</div>
          <div>
            <h4>Items Sold</h4>
            <h2>{totalItemsSold}</h2>
            <span>0% vs yesterday</span>
          </div>
        </div>
        <div className="sales-stat-card">
          <div className="stat-icon purple">💳</div>
          <div>
            <h4>Average Order Value</h4>
            <h2>
              Rs.{" "}
              {avgOrderValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
            <span>0% vs yesterday</span>
          </div>
        </div>
      </div>

      {/* UNIFIED WORKSPACE */}
      <div className="sales-content">
        {/* LEFT COLUMN: HISTORY LIST */}
        <div className="sales-left">
          <div className="sales-filters">
            <div className="sales-search">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="eSewa">eSewa</option>
              <option value="Khalti">Khalti</option>
            </select>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="sales-list">
            <div className="sales-date">
              Today -{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {paginatedData.length > 0 ? (
              paginatedData.map((sale) => (
                <div className="sales-row" key={sale.id}>
                  <div className="sales-time">{sale.time || "N/A"}</div>
                  <div className="sales-info">
                    <div className="sales-id">
                      <h4 className="flex items-center gap-1.5">
                        <Receipt size={14} className="text-purple-500" />{" "}
                        {sale.transactionId}
                      </h4>
                      <p className="flex items-center gap-1.5">
                        <User size={13} /> {sale.customer || "Walk-in"}
                      </p>
                      <span className="flex items-center gap-1.5">
                        <Table2 size={13} /> {sale.channel || "Dining"}
                      </span>
                    </div>
                    <div className="sales-items">
                      <h4>{sale.itemCount} Items</h4>
                      <p
                        className="truncate w-32 flex items-center gap-1.5"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sale.items
                          .map((i) => `${i.name} x${i.qty}`)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="sales-payment">
                      <h4 className="flex items-center gap-1.5">
                        <CreditCard size={14} className="text-emerald-500" />{" "}
                        {sale.paymentMethod || "Cash"}
                      </h4>
                      <p>{sale.id}</p>
                    </div>
                    <div className="sales-amount">
                      Rs.{" "}
                      {sale.totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div>
                      <span
                        className={`sale-status ${sale.status.toLowerCase()} flex items-center gap-1.5 w-max`}
                      >
                        {sale.status === "Completed" ? (
                          <CheckCircle size={14} />
                        ) : sale.status === "Cancelled" ? (
                          <XCircle size={14} />
                        ) : (
                          <Clock size={14} />
                        )}
                        {sale.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="details-btn flex items-center gap-2 hover:border-purple-300 hover:text-purple-600 transition-colors"
                        onClick={() => setSelectedInvoice(sale)}
                      >
                        <Eye size={16} /> Details
                      </button>
                      <button
                        className="details-btn flex items-center gap-2 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                        onClick={() => handlePrintSingle(sale)}
                      >
                        <Printer size={16} /> Print
                      </button>
                    </div>
                    <ChevronRight className="arrow-icon" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <Receipt size={32} className="text-slate-300" />
                </div>
                No transactions found matching your criteria.
              </div>
            )}

            {paginatedData.length < filteredData.length && (
              <div
                className="load-more"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Load More History
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: OVERVIEW CHARTS */}
        <div className="sales-right">
          <div className="right-card">
            <h3>Sales by Payment Method</h3>
            <div className="payment-chart">
              <div className="relative h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        paymentData.length > 0
                          ? paymentData
                          : [{ name: "No Data", value: 1, color: "#e2e8f0" }]
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {(paymentData.length > 0
                        ? paymentData
                        : [{ name: "No Data", value: 1, color: "#e2e8f0" }]
                      ).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-sm font-black text-slate-900 mt-0.5">
                    Rs.{" "}
                    {totalSalesAmount > 1000
                      ? (totalSalesAmount / 1000).toFixed(1) + "k"
                      : totalSalesAmount}
                  </span>
                </div>
              </div>
              <div className="chart-details flex flex-col gap-3">
                {paymentData.map((method, idx) => (
                  <div key={idx} className="chart-item flex items-center gap-3">
                    <span
                      className="dot w-3 h-3 rounded-full"
                      style={{ backgroundColor: method.color }}
                    ></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">
                        {method.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        Rs. {method.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                {paymentData.length === 0 && (
                  <span className="text-sm text-slate-400 font-medium">
                    No sales data yet
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="right-card">
            <h3>Sales Summary</h3>
            <div className="summary-item">
              <span>Total Sales</span>
              <strong>
                Rs.{" "}
                {totalSalesAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
            <div className="summary-item">
              <span>Total Orders</span>
              <strong>{completedSales.length}</strong>
            </div>
            <div className="summary-item">
              <span>Total Items Sold</span>
              <strong>{totalItemsSold}</strong>
            </div>
            <div className="summary-item">
              <span>Average Order Value</span>
              <strong>
                Rs.{" "}
                {avgOrderValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
            <div className="summary-item">
              <span>Highest Sale</span>
              <strong>
                Rs.{" "}
                {highestSale.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
            <div className="summary-item">
              <span>Lowest Sale</span>
              <strong>
                Rs.{" "}
                {lowestSale.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* INVOICE PREVIEW MODAL */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-in flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900">
                Receipt Details
              </h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Transaction ID
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedInvoice.transactionId}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Date & Time
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedInvoice.date} {selectedInvoice.time}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Customer
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedInvoice.customer || "Walk-in"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Payment Method
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedInvoice.paymentMethod || "Cash"}
                  </span>
                </div>
              </div>

              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Itemized Breakdown
              </h4>
              <table className="w-full text-left border-collapse mb-6">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="p-3 border-b border-slate-100 rounded-tl-lg">
                      Item
                    </th>
                    <th className="p-3 border-b border-slate-100 text-center">
                      Qty
                    </th>
                    <th className="p-3 border-b border-slate-100 text-right">
                      Price
                    </th>
                    <th className="p-3 border-b border-slate-100 text-right rounded-tr-lg">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-slate-700">
                        {item.name}
                      </td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-right">
                        Rs. {parseFloat(item.price || 0).toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-bold">
                        Rs.{" "}
                        {(item.qty * parseFloat(item.price || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-600 uppercase tracking-wider text-xs">
                  Grand Total
                </span>
                <span className="text-xl font-black text-purple-600">
                  Rs.{" "}
                  {selectedInvoice.totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button
                onClick={() => handlePrintSingle(selectedInvoice)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-md flex justify-center items-center gap-2"
              >
                <Printer size={18} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THERMAL PRINTER RECEIPT BATCH LAYOUT */}
      <div className="print-container">
        {printMode === "single" &&
          selectedInvoice &&
          renderReceipt(selectedInvoice)}
        {printMode === "batch" &&
          filteredData
            .filter((t) => selectedTxns.includes(t.transactionId))
            .map(renderReceipt)}
      </div>
    </div>
  );
}
