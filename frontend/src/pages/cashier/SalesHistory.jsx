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
  TrendingUp,
  ShoppingCart
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
  const [viewMode, setViewMode] = useState("ledger"); // 'ledger', 'invoices', 'payments', 'eod'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printMode, setPrintMode] = useState("ledger"); // 'ledger', 'single', 'batch', 'summary', 'eod'
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
  }, [searchTerm, activeTab, paymentFilter, viewMode]);

  // Reset search and dropdown filters when changing tabs for a fresh view
  useEffect(() => {
    setActiveTab("All");
    setPaymentFilter("All");
    setSearchTerm("");
  }, [viewMode]);

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
    if (!newItemInput.name || newItemInput.price < 0 || newItemInput.qty < 1) return;
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

    const subtotal = newInvoiceData.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const newInv = {
      id: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
      customer: newInvoiceData.customer || "Walk-in Customer",
      paymentMethod: newInvoiceData.method,
      items: newInvoiceData.items,
      amount: subtotal,
      status: "Completed",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      table: "Walk-in",
    };

    if (addOrder) addOrder(newInv);
    
    setIsNewInvoiceOpen(false);
    setNewInvoiceData({ customer: "", method: "Cash", items: [] });
  };

  // Unified Metrics
  const completedSales = orders.filter((o) => o.status === "Completed");
  const totalSalesAmount = completedSales.reduce((acc, order) => {
    const subtotal = (order.items || []).reduce((sum, item) => sum + item.qty * (parseFloat(item.price) || 0), 0);
    return acc + (order.amount || subtotal + (subtotal > 0 ? 50 : 0));
  }, 0);
  const totalItemsSold = completedSales.reduce((acc, order) => acc + (order.items || []).reduce((sum, item) => sum + item.qty, 0), 0);
  const avgOrderValue = completedSales.length > 0 ? totalSalesAmount / completedSales.length : 0;

  // Prepare dynamic data for the Pie Chart
  const paymentData = useMemo(() => {
    let cash = 0, card = 0, esewa = 0, khalti = 0;
    completedSales.forEach((order) => {
      const amt = order.amount || ((order.items || []).reduce((sum, i) => sum + i.qty * (parseFloat(i.price) || 0), 0) + 50);
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
    ].filter(item => item.value > 0); // Only show methods that have sales
  }, [completedSales]);

  // End of Day (Today's) Metrics
  const eodMetrics = useMemo(() => {
    const todayStr = new Date().toLocaleDateString();
    const todayStrISO = new Date().toISOString().split("T")[0];
    
    const todayCompleted = completedSales.filter(o => {
      const oDate = o.date || (o.timestamp ? new Date(o.timestamp).toLocaleDateString() : "");
      return oDate === todayStr || oDate === todayStrISO || (o.timestamp && new Date(o.timestamp).toLocaleDateString() === new Date().toLocaleDateString());
    });

    let cash = 0, card = 0, esewa = 0, khalti = 0, total = 0;

    todayCompleted.forEach(order => {
      const subtotal = (order.items || []).reduce((sum, item) => sum + item.qty * (parseFloat(item.price) || 0), 0);
      const amt = order.amount || (subtotal + (subtotal > 0 ? 50 : 0));
      total += amt;

      if (order.paymentMethod === "Card") card += amt;
      else if (order.paymentMethod === "eSewa") esewa += amt;
      else if (order.paymentMethod === "Khalti") khalti += amt;
      else cash += amt; // Default to cash
    });

    return {
      ordersCount: todayCompleted.length,
      total, cash, card, esewa, khalti
    };
  }, [completedSales]);

  // Map Orders to Unified Ledger Data
  const ledgerData = useMemo(() => {
    return orders
      .map(order => {
        const subtotal = (order.items || []).reduce((sum, item) => sum + item.qty * (parseFloat(item.price) || 0), 0);
        const total = order.amount || (subtotal + (subtotal > 0 ? 50 : 0));
        return {
          ...order,
          transactionId: `TXN-${String(order.id).replace(/\D/g, "")}`,
          totalAmount: total,
          itemCount: (order.items || []).reduce((sum, i) => sum + i.qty, 0)
        };
      }).reverse();
  }, [orders]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return ledgerData.filter(txn => {
      const matchesTab = activeTab === "All" ? true : txn.status === activeTab;
      const matchesSearch = txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (txn.customer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            txn.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPayment = paymentFilter === "All" ? true : txn.paymentMethod === paymentFilter;
      
      // Apply view mode specific filters
      let matchesView = true;
      if (viewMode === "ledger") matchesView = txn.status === "Completed" || txn.status === "Cancelled" || txn.status === "Refunded";
      if (viewMode === "payments") matchesView = txn.status === "Completed"; // Only show finalized payments
      if (viewMode === "invoices") matchesView = true; // Show all (including Pending)
      
      return matchesTab && matchesSearch && matchesPayment && matchesView;
    });
  }, [ledgerData, activeTab, searchTerm, paymentFilter, viewMode]);

  // Pagination
  const paginatedData = filteredData.slice(0, currentPage * ITEMS_PER_PAGE);

  const highestSale = completedSales.length > 0 ? Math.max(...completedSales.map((s) => s.amount || 0)) : 0;
  const lowestSale = completedSales.length > 0 ? Math.min(...completedSales.map((s) => s.amount || 0)) : 0;

  // Multi-Select Handlers
  const toggleSelection = (id) => {
    setSelectedTxns((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
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

  const handlePrintSummary = () => {
    setPrintMode("summary");
    setTimeout(() => window.print(), 300);
  };

  const handleUpdateStatus = (id, newStatus) => {
    if (newStatus === "Cancelled" && cancelOrder) {
      if(window.confirm("Are you sure you want to void this transaction?")) {
        cancelOrder(id);
        setSelectedInvoice(null);
      }
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    
    const dataToExport = selectedTxns.length > 0 
      ? filteredData.filter(t => selectedTxns.includes(t.transactionId)) 
      : filteredData;

    if (dataToExport.length === 0) {
      alert("No data to export based on current filters.");
      setIsExporting(false);
      return;
    }

    const headers = ["Date", "Time", "Transaction ID", "Order ID", "Customer", "Items Count", "Method", "Amount", "Status"];
    const csvRows = dataToExport.map(txn => [
      txn.date, txn.time, txn.transactionId, txn.id,
      `"${txn.customer || "Walk-in"}"`, txn.itemCount,
      txn.paymentMethod || "Cash", txn.totalAmount, txn.status
    ].join(","));

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Transaction_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsExporting(false), 500);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700">
          <p className="font-bold text-slate-300 text-xs mb-1">{payload[0].name}</p>
          <p className="font-black text-lg">
            Rs. {payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderReceipt = (invoice) => (
    <div key={invoice.transactionId} style={{ pageBreakAfter: "always", marginBottom: "20px", borderBottom: "1px dashed #000", paddingBottom: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <h2 style={{ fontSize: "18px", margin: "0 0 5px 0" }}>ASLENIX RESTAURANT</h2>
        <p style={{ margin: "2px 0" }}>Kathmandu, Nepal</p>
        <p style={{ margin: "2px 0" }}>Tel: +977 9812345678</p>
      </div>

      <div style={{ borderBottom: "1px dashed #000", paddingBottom: "10px", marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span>Receipt No:</span> <span>{invoice.transactionId}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span>Date:</span> <span>{invoice.date} {invoice.time}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span>Customer:</span> <span>{invoice.customer || "Walk-in"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span>Method:</span> <span>{invoice.paymentMethod || "Cash"}</span>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", marginBottom: "10px", borderBottom: "1px dashed #000", paddingBottom: "10px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px dashed #000", paddingBottom: "5px" }}>Item</th>
            <th style={{ textAlign: "center", borderBottom: "1px dashed #000", paddingBottom: "5px" }}>Qty</th>
            <th style={{ textAlign: "right", borderBottom: "1px dashed #000", paddingBottom: "5px" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: "5px 0" }}>{item.name}</td>
              <td style={{ textAlign: "center", padding: "5px 0" }}>{item.qty}</td>
              <td style={{ textAlign: "right", padding: "5px 0" }}>Rs. {(item.qty * (parseFloat(item.price) || 0)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "14px", marginTop: "10px", borderTop: "1px dashed #000", paddingTop: "10px" }}>
        <span>GRAND TOTAL:</span>
        <span>Rs. {invoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
        <p>Thank you for your visit!</p>
        <p>Please come again.</p>
      </div>
    </div>
  );

  const renderSummaryReport = () => (
    <div key="summary-report" style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", color: "#000" }}>
      <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", margin: "0 0 10px 0" }}>ASLENIX RESTAURANT</h1>
        <h2 style={{ fontSize: "18px", margin: "0 0 5px 0", color: "#475569" }}>Sales & Payment Summary Report</h2>
        <p style={{ margin: 0, color: "#64748b" }}>Generated on: {new Date().toLocaleString()}</p>
        <p style={{ margin: "5px 0 0 0", color: "#64748b" }}>Current Filter: {activeTab} | Payment Method: {paymentFilter}</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
        <div style={{ flex: "1 1 45%", padding: "15px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Total Revenue</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#0f172a" }}>Rs. {totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div style={{ flex: "1 1 45%", padding: "15px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Total Orders</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#0f172a" }}>{completedSales.length}</p>
        </div>
        <div style={{ flex: "1 1 45%", padding: "15px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Items Sold</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#0f172a" }}>{totalItemsSold}</p>
        </div>
        <div style={{ flex: "1 1 45%", padding: "15px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#64748b", textTransform: "uppercase" }}>Average Order Value</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#0f172a" }}>Rs. {avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <h3 style={{ fontSize: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "15px" }}>Payments by Method</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>Method</th>
            <th style={{ textAlign: "right", padding: "10px", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((method, idx) => (
            <tr key={idx}>
              <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", fontWeight: "bold" }}>{method.name}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>Rs. {method.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            </tr>
          ))}
          {paymentData.length === 0 && (
            <tr>
              <td colSpan="2" style={{ padding: "15px", textAlign: "center", color: "#64748b" }}>No payment data available</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div style={{ textAlign: "center", marginTop: "40px", fontSize: "12px", color: "#94a3b8" }}>
        <p>This is a system generated report. No signature required.</p>
      </div>
    </div>
  );

  const renderEODReport = () => (
    <div key="eod-report" style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", color: "#000" }}>
      <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", margin: "0 0 10px 0" }}>ASLENIX RESTAURANT</h1>
        <h2 style={{ fontSize: "18px", margin: "0 0 5px 0", color: "#475569" }}>End of Day Summary (Z-Report)</h2>
        <p style={{ margin: 0, color: "#64748b" }}>Date: {new Date().toLocaleDateString()}</p>
      </div>

      <h3 style={{ fontSize: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "15px" }}>Sales Summary</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
        <tbody>
          <tr>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", fontWeight: "bold" }}>Total Revenue Today</td>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>Rs. {eodMetrics.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", fontWeight: "bold" }}>Total Orders Today</td>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>{eodMetrics.ordersCount}</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ fontSize: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "15px" }}>Payment Breakdown</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
        <tbody>
          <tr>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", fontWeight: "bold" }}>Cash</td>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>Rs. {eodMetrics.cash.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", fontWeight: "bold" }}>Card</td>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>Rs. {eodMetrics.card.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", fontWeight: "bold" }}>eSewa</td>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>Rs. {eodMetrics.esewa.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", fontWeight: "bold" }}>Khalti</td>
            <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", textAlign: "right" }}>Rs. {eodMetrics.khalti.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          </tr>
        </tbody>
      </table>
      
      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Expected Cash in Drawer:</span>
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Rs. {eodMetrics.cash.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
      </div>

      <div style={{ textAlign: "center", marginTop: "40px", fontSize: "12px", color: "#94a3b8" }}>
        <p>End of Day System Report. No signature required.</p>
      </div>
    </div>
  );

  return (
    <div className="sales-history-page">
      {/* DYNAMIC SMART PRINT-ONLY STYLES */}
      <style>
        {`
        @media print {
          ${printMode === 'ledger' ? `
            @page { margin: 10mm; size: auto; }
            body { background: #fff; }
            .sidebar, .navbar, header, footer { display: none !important; }
            .sales-top, .sales-stats, .sales-right, .sales-filters, .load-more { display: none !important; }
            .sales-content { display: block !important; width: 100% !important; grid-template-columns: 1fr !important; }
            .sales-left { width: 100% !important; box-shadow: none !important; border: none !important; }
            .print-hide-row { display: none !important; }
            .print-container { display: none !important; }
            .details-btn, .arrow-icon { display: none !important; }
          ` : printMode === 'summary' || printMode === 'eod' ? `
            @page { margin: 10mm; size: auto; }
            html, body { width: 100% !important; background: #fff !important; margin: 0 !important; padding: 0 !important; }
            .sidebar, .navbar, header, footer { display: none !important; }
            .sales-history-page > *:not(.print-container) { display: none !important; }
            .sales-history-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
            .print-container { position: relative !important; width: 100% !important; margin: 0 !important; padding: 0 !important; display: block !important; z-index: 99999; }
          ` : `
            @page { margin: 0; size: 80mm auto; }
            html, body { width: 80mm !important; background: #fff !important; margin: 0 !important; padding: 0 !important; }
            .sidebar, .navbar, header, footer { display: none !important; }
            .sales-history-page > *:not(.print-container) { display: none !important; }
            .sales-history-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
            .print-container { position: absolute !important; left: 0 !important; top: 0 !important; width: 80mm !important; margin: 0 !important; padding: 5mm !important; font-family: 'Courier New', monospace; color: #000; font-size: 12px; background: #fff; display: block !important; z-index: 99999; }
          `}
        }
        @media screen {
          .print-container { display: none; }
        }
        `}
      </style>

      {/* HEADER */}
      <div className="sales-top">
        <div>
          <h1>
            {viewMode === "ledger" && "Sales Ledger"}
            {viewMode === "invoices" && "Invoices"}
            {viewMode === "payments" && "Payments History"}
            {viewMode === "eod" && "End of Day"}
          </h1>
          <p>
            {viewMode === "ledger" && "Unified Ledger: Sales, Payments & Custom Invoices"}
            {viewMode === "invoices" && "Manage all generated bills and pending invoices"}
            {viewMode === "payments" && "View all completed and settled transactions"}
            {viewMode === "eod" && "Review today's total payments and shift metrics"}
          </p>
        </div>
        <div className="sales-top-actions flex gap-3">
          <button className="date-btn">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </button>
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isExporting}
              className="bg-white border border-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition shadow-sm"
            >
              <Download size={16} /> {isExporting ? "Exporting..." : selectedTxns.length > 0 ? `Export (${selectedTxns.length})` : "Export"}
            </button>
            {isExportMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-xl w-56 z-50 overflow-hidden text-left animate-slide-in">
                {selectedTxns.length > 0 ? (
                  <>
                    <button onClick={() => { setIsExportMenuOpen(false); handlePrintBatch(); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50">
                      <Printer size={16} className="text-emerald-500" /> Print Selected Receipts
                    </button>
                    <button onClick={() => { setIsExportMenuOpen(false); handleExportCSV(); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                      <FileText size={16} className="text-blue-500" /> Download Selected CSV
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setIsExportMenuOpen(false); handlePrintSummary(); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50">
                      <Printer size={16} className="text-purple-500" /> Print Summary Report
                    </button>
                    <button onClick={() => { setIsExportMenuOpen(false); handlePrintLedger(); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-b border-slate-50">
                      <Printer size={16} className="text-emerald-500" /> Print Ledger Page
                    </button>
                    <button onClick={() => { setIsExportMenuOpen(false); handleExportCSV(); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors">
                      <FileText size={16} className="text-blue-500" /> Download CSV (All)
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

      {/* UNIFIED VIEW SWITCHER TABS */}
      <div className="flex gap-6 border-b border-slate-200 mb-6 px-1 mx-6 mt-6">
        {["ledger", "invoices", "payments", "eod"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`pb-3 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${viewMode === mode ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-700"}`}
          >
            {mode === "ledger" ? "All History" : mode === "eod" ? "End of Day" : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {viewMode === "eod" ? (
        <div className="max-w-4xl mx-auto my-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="text-center mb-8 pb-8 border-b border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 mb-2">End of Day Report</h2>
            <p className="text-slate-500 font-medium">Business Date: {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Total Revenue Today</span>
              <h3 className="text-4xl font-black text-slate-900 mt-2">Rs. {eodMetrics.total.toLocaleString(undefined, {minimumFractionDigits:2})}</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Total Orders Today</span>
              <h3 className="text-4xl font-black text-slate-900 mt-2">{eodMetrics.ordersCount}</h3>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Breakdown</h3>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3"><span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span><span className="font-bold text-slate-700">Cash Payments</span></div>
              <span className="font-black text-lg text-slate-900">Rs. {eodMetrics.cash.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
            <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3"><span className="w-3.5 h-3.5 rounded-full bg-blue-500"></span><span className="font-bold text-slate-700">Card Payments</span></div>
              <span className="font-black text-lg text-slate-900">Rs. {eodMetrics.card.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
            <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3"><span className="w-3.5 h-3.5 rounded-full bg-green-500"></span><span className="font-bold text-slate-700">eSewa</span></div>
              <span className="font-black text-lg text-slate-900">Rs. {eodMetrics.esewa.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
            <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3"><span className="w-3.5 h-3.5 rounded-full bg-purple-500"></span><span className="font-bold text-slate-700">Khalti</span></div>
              <span className="font-black text-lg text-slate-900">Rs. {eodMetrics.khalti.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex justify-between items-center">
            <div>
              <h4 className="text-lg font-bold text-emerald-800">Expected Cash in Drawer</h4>
              <p className="text-sm text-emerald-600 font-medium mt-1">Sum of all cash payments processed today</p>
            </div>
            <span className="text-3xl font-black text-emerald-700">Rs. {eodMetrics.cash.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button onClick={() => {setPrintMode('eod'); setTimeout(() => window.print(), 300);}} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-2">
              <Printer size={18} /> Print End of Day Report
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* METRICS GRID */}
          <div className="sales-stats">
            <div className="sales-stat-card">
              <div className="stat-icon green flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200">
                <TrendingUp size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4>Total Sales</h4>
                <h2>Rs. {totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                <span>0% vs yesterday</span>
              </div>
            </div>
            <div className="sales-stat-card">
              <div className="stat-icon blue flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
                <ShoppingCart size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4>Total Orders</h4>
                <h2>{completedSales.length}</h2>
                <span>0 vs yesterday</span>
              </div>
            </div>
            <div className="sales-stat-card">
              <div className="stat-icon orange flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600 shadow-sm border border-amber-200">
                <Package size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4>Items Sold</h4>
                <h2>{totalItemsSold}</h2>
                <span>0% vs yesterday</span>
              </div>
            </div>
            <div className="sales-stat-card">
              <div className="stat-icon purple flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 shadow-sm border border-purple-200">
                <CreditCard size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4>Average Order Value</h4>
                <h2>Rs. {avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
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
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="eSewa">eSewa</option>
              <option value="Khalti">Khalti</option>
            </select>
            <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
              <option value="All">All Status</option>
              {viewMode === "invoices" && <option value="Pending">Pending</option>}
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="sales-list">
            <div className="sales-date">
              Today - {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>

            {paginatedData.length > 0 ? (
              paginatedData.map((sale) => (
                <div className="sales-row" key={sale.id}>
                  <div className="sales-time">{sale.time || "N/A"}</div>
                  <div className="sales-info">
                    <div className="sales-id">
                      <h4 className="flex items-center gap-1.5"><Receipt size={14} className="text-purple-500" /> {sale.transactionId}</h4>
                      <p className="flex items-center gap-1.5"><User size={13} /> {sale.customer || "Walk-in"}</p>
                      <span className="flex items-center gap-1.5"><Table2 size={13} /> {sale.channel || "Dining"}</span>
                    </div>
                    <div className="sales-items">
                      <h4>{sale.itemCount} Items</h4>
                      <p className="truncate w-32 flex items-center gap-1.5" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sale.items.map(i => `${i.name} x${i.qty}`).join(", ")}
                      </p>
                    </div>
                    <div className="sales-payment">
                      <h4 className="flex items-center gap-1.5"><CreditCard size={14} className="text-emerald-500"/> {sale.paymentMethod || "Cash"}</h4>
                      <p>{sale.id}</p>
                    </div>
                    <div className="sales-amount">Rs. {sale.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div>
                      <span className={`sale-status ${sale.status.toLowerCase()} flex items-center gap-1.5 w-max`}>
                        {sale.status === "Completed" ? <CheckCircle size={14} /> : sale.status === "Cancelled" ? <XCircle size={14} /> : <Clock size={14} />}
                        {sale.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="details-btn flex items-center gap-2 hover:border-purple-300 hover:text-purple-600 transition-colors" onClick={() => setSelectedInvoice(sale)}>
                        <Eye size={16} /> Details
                      </button>
                      <button className="details-btn flex items-center gap-2 hover:border-emerald-300 hover:text-emerald-600 transition-colors" onClick={() => handlePrintSingle(sale)}>
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
              <div className="load-more" onClick={() => setCurrentPage(p => p + 1)}>Load More History</div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: OVERVIEW CHARTS */}
        <div className="sales-right">
          <div className="right-card">
            <h3>Sales by Payment Method</h3>
            <div className="payment-chart">
              <div className="relative h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie
                      data={paymentData.length > 0 ? paymentData : [{ name: "No Data", value: 1, color: "#e2e8f0" }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {(paymentData.length > 0 ? paymentData : [{ name: "No Data", value: 1, color: "#e2e8f0" }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5">
                    Rs. {totalSalesAmount > 1000 ? (totalSalesAmount/1000).toFixed(1) + 'k' : totalSalesAmount}
                  </span>
                </div>
              </div>
              <div className="chart-details flex flex-col gap-3">
                {paymentData.map((method, idx) => (
                  <div key={idx} className="chart-item flex items-center gap-3">
                    <span className="dot w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{method.name}</span>
                      <span className="text-xs font-semibold text-slate-400">Rs. {method.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {paymentData.length === 0 && (
                  <span className="text-sm text-slate-400 font-medium">No sales data yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="right-card">
            <h3>Sales Summary</h3>
            <div className="summary-item"><span>Total Sales</span><strong>Rs. {totalSalesAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
            <div className="summary-item"><span>Total Orders</span><strong>{completedSales.length}</strong></div>
            <div className="summary-item"><span>Total Items Sold</span><strong>{totalItemsSold}</strong></div>
            <div className="summary-item"><span>Average Order Value</span><strong>Rs. {avgOrderValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
            <div className="summary-item"><span>Highest Sale</span><strong>Rs. {highestSale.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
            <div className="summary-item"><span>Lowest Sale</span><strong>Rs. {lowestSale.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* INVOICE PREVIEW MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900">Receipt Details</h2>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"><X size={16} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.transactionId}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.date} {selectedInvoice.time}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.customer || "Walk-in"}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.paymentMethod || "Cash"}</span>
                </div>
              </div>

              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Itemized Breakdown</h4>
              <table className="w-full text-left border-collapse mb-6">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="p-3 border-b border-slate-100 rounded-tl-lg">Item</th>
                    <th className="p-3 border-b border-slate-100 text-center">Qty</th>
                    <th className="p-3 border-b border-slate-100 text-right">Price</th>
                    <th className="p-3 border-b border-slate-100 text-right rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-slate-700">{item.name}</td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-right">Rs. {parseFloat(item.price||0).toFixed(2)}</td>
                      <td className="p-3 text-right font-bold">Rs. {(item.qty * parseFloat(item.price||0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-600 uppercase tracking-wider text-xs">Grand Total</span>
                <span className="text-xl font-black text-purple-600">Rs. {selectedInvoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button onClick={() => handlePrintSingle(selectedInvoice)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-md flex justify-center items-center gap-2">
                <Printer size={18} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THERMAL PRINTER RECEIPT BATCH LAYOUT */}
      <div className="print-container">
        {printMode === "single" && selectedInvoice && renderReceipt(selectedInvoice)}
        {printMode === "batch" && filteredData.filter(t => selectedTxns.includes(t.transactionId)).map(renderReceipt)}
        {printMode === "summary" && renderSummaryReport()}
        {printMode === "eod" && renderEODReport()}
      </div>

      {/* CREATE NEW INVOICE MODAL */}
      {isNewInvoiceOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity"
          onClick={() => setIsNewInvoiceOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900">Create Custom Invoice</h2>
              <button
                onClick={() => setIsNewInvoiceOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Customer Name</label>
                  <input
                    type="text"
                    value={newInvoiceData.customer}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, customer: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-purple-400"
                    placeholder="Walk-in Customer"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Payment Method</label>
                  <select
                    value={newInvoiceData.method}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, method: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-purple-400"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="eSewa">eSewa</option>
                    <option value="Khalti">Khalti</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Add Items</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItemInput.name}
                    onChange={(e) => setNewItemInput({ ...newItemInput, name: e.target.value })}
                    className="flex-2 w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-purple-400"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={newItemInput.qty || ""}
                    onChange={(e) => setNewItemInput({ ...newItemInput, qty: parseInt(e.target.value) || 0 })}
                    className="flex-1 w-20 rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-purple-400"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    min="0"
                    value={newItemInput.price === 0 ? "" : newItemInput.price}
                    onChange={(e) => setNewItemInput({ ...newItemInput, price: parseFloat(e.target.value) || 0 })}
                    className="flex-1 w-24 rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={handleAddNewItem}
                    className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 rounded-lg hover:bg-slate-200 transition"
                  >
                    Add
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <tr>
                        <th className="p-2 pl-3">Item</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Price</th>
                        <th className="p-2 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {newInvoiceData.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2 pl-3">{item.name}</td>
                          <td className="p-2 text-center">{item.qty}</td>
                          <td className="p-2 text-right">Rs. {item.price.toFixed(2)}</td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => {
                                const newItems = [...newInvoiceData.items];
                                newItems.splice(idx, 1);
                                setNewInvoiceData({ ...newInvoiceData, items: newItems });
                              }}
                              className="text-rose-500 hover:text-rose-700 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {newInvoiceData.items.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-6 text-center text-slate-400">No items added yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="text-lg font-black text-slate-900">
                Total: Rs. {newInvoiceData.items.reduce((sum, i) => sum + i.qty * i.price, 0).toFixed(2)}
              </div>
              <button
                onClick={handleCreateInvoice}
                className="bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-emerald-600 transition shadow-md flex items-center gap-2"
              >
                <CheckCircle size={18} /> Create & Settle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
