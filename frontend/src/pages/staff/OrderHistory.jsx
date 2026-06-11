import { useMemo, useState, useRef, useEffect } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Receipt,
  Search,
  Table2,
  User,
  Wallet,
  X,
  XCircle,
  Printer,
} from "lucide-react";
import "../../styles/history.css";
import { useOrders } from "../../context/OrderContext";

const filters = ["All", "Completed", "Cancelled"];

const avatarColors = ["blue", "violet", "green"];

const History = () => {
  const { orders = [], fetchOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    if (fetchOrders) fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target)
      ) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const ordersList = useMemo(() => {
    return orders
      .filter((o) => o.status === "Completed" || o.status === "Cancelled")
      .map((o) => {
        const subtotal = (o.items || []).reduce(
          (sum, i) => sum + i.qty * (parseFloat(i.price) || 0),
          0
        );
        const amount = o.amount || subtotal + (subtotal > 0 ? 50 : 0);
        return {
          id: o.id,
          table: o.table || "Walk-in",
          amount: amount,
          status: o.status,
          customer: o.customer || "Guest",
          customerType: "Customer",
          itemsCount: (o.items || []).reduce((sum, i) => sum + i.qty, 0),
          time: o.time || "N/A",
          date: o.date || new Date().toLocaleDateString(),
          paymentMethod: o.paymentMethod || "Cash",
          server: o.server || "System",
          breakdown: o.items || [],
        };
      })
      .reverse();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return ordersList.filter((order) => {
      const matchesSearch =
        !term ||
        order.customer.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term) ||
        order.table.toLowerCase().includes(term) ||
        order.paymentMethod.toLowerCase().includes(term);
      const matchesTab = activeTab === "All" || order.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [activeTab, ordersList, searchTerm]);

  const stats = useMemo(() => {
    const completedOrders = ordersList.filter(
      (order) => order.status === "Completed"
    );
    const cancelledOrders = ordersList.filter(
      (order) => order.status === "Cancelled"
    );
    const totalItems = completedOrders.reduce(
      (sum, order) => sum + order.itemsCount,
      0
    );

    return {
      totalItems,
      completedCount: completedOrders.length,
      cancelledCount: cancelledOrders.length,
    };
  }, [ordersList]);

  const handleExportCSV = () => {
    setIsExporting(true);

    if (filteredOrders.length === 0) {
      alert("No data to export based on current filters.");
      setIsExporting(false);
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Time",
      "Customer",
      "Table",
      "Items Count",
      "Items Breakdown",
      "Amount",
      "Status",
      "Payment Method",
      "Server",
    ];

    const csvRows = filteredOrders.map((order) => {
      const itemsBreakdown = order.breakdown
        .map((i) => `${i.qty}x ${i.name}`)
        .join("; ");
      return [
        order.id,
        order.date || "N/A",
        order.time || "N/A",
        `"${order.customer || "Guest"}"`,
        `"${order.table || "Walk-in"}"`,
        order.itemsCount,
        `"${itemsBreakdown}"`,
        order.amount,
        order.status,
        order.paymentMethod || "Cash",
        `"${order.server || "System"}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Order_History_${activeTab.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => setIsExporting(false), 900);
  };

  const handleExportPDF = () => {
    if (filteredOrders.length === 0) {
      alert("No data to export based on current filters.");
      return;
    }

    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="history-page">
      {/* PRINT-ONLY STYLES FOR PDF EXPORT */}
      <style>
        {`
        @media print {
          @page { margin: 10mm; size: A4 portrait; }
          html, body { background: #fff; margin: 0; padding: 0; }
          body * { visibility: hidden; }
          .sidebar, .navbar, header, footer, .history-page > *:not(#printable-order-history) { display: none !important; }
          .history-page { padding: 0 !important; margin: 0 !important; background: transparent !important; }
          #printable-order-history, #printable-order-history * { visibility: visible; }
          #printable-order-history { position: absolute; left: 0; top: 0; width: 100%; margin: 0; font-family: 'Arial', sans-serif; color: #000; }
          .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .print-table th, .print-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
          .print-table th { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; font-weight: bold; color: #334155; }
        }
        @media screen {
          #printable-order-history { display: none; }
        }
        /* Dropdown item hover */
        .export-dropdown-item:hover {
          background-color: #f8fafc;
        }
        `}
      </style>

      <section
        className="history-hero"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "24px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
        }}
      >
        <div>
          <span
            className="history-eyebrow"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
            }}
          >
            <Receipt size={16} />
            Staff Order Ledger
          </span>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "900",
              color: "#0f172a",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Order History
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
            Track completed and cancelled restaurant orders with receipt-level
            detail.
          </p>
        </div>

        <div style={{ position: "relative" }} ref={exportMenuRef}>
          <button
            className={`export-btn ${isExporting ? "loading" : ""}`}
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            disabled={isExporting}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 24px",
              backgroundColor: "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
              opacity: isExporting ? 0.7 : 1,
            }}
          >
            <Download size={16} />
            {isExporting ? "Preparing..." : "Export History"}
          </button>
          {isExportMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 5px)",
                right: 0,
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "8px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                zIndex: 50,
                minWidth: "180px",
              }}
            >
              <button
                onClick={() => {
                  handleExportPDF();
                  setIsExportMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "10px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155",
                  transition: "0.2s",
                }}
                className="export-dropdown-item"
              >
                <Printer size={16} /> Print / Save PDF
              </button>
              <button
                onClick={() => {
                  handleExportCSV();
                  setIsExportMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "10px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155",
                  transition: "0.2s",
                }}
                className="export-dropdown-item"
              >
                <FileText size={16} /> Download CSV
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        className="history-summary-cards"
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        <div
          className="summary-card"
          style={{
            flex: "1",
            minWidth: "250px",
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            border: "1px solid #f1f5f9",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)",
          }}
        >
          <span
            className="card-icon"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "#f1f5f9",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={28} />
          </span>
          <div>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "900",
                color: "#0f172a",
                margin: "0 0 4px 0",
              }}
            >
              {stats.totalItems}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Items Processed
            </p>
          </div>
        </div>

        <div
          className="summary-card"
          style={{
            flex: "1",
            minWidth: "250px",
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            border: "1px solid #f1f5f9",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)",
          }}
        >
          <span
            className="card-icon green"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "#ecfdf5",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={28} />
          </span>
          <div>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "900",
                color: "#0f172a",
                margin: "0 0 4px 0",
              }}
            >
              {stats.completedCount}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Completed Orders
            </p>
          </div>
        </div>

        <div
          className="summary-card"
          style={{
            flex: "1",
            minWidth: "250px",
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            border: "1px solid #f1f5f9",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)",
          }}
        >
          <span
            className="card-icon red"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "#fff1f2",
              color: "#f43f5e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <XCircle size={28} />
          </span>
          <div>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "900",
                color: "#0f172a",
                margin: "0 0 4px 0",
              }}
            >
              {stats.cancelledCount}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Cancelled Orders
            </p>
          </div>
        </div>
      </section>

      <section className="history-toolbar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search ID, customer, table, payment..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {filters.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="history-table-wrapper">
        {filteredOrders.length === 0 ? (
          <div className="empty-search-state">
            <FileText size={30} />
            <h2>No orders found</h2>
            <p>Try another keyword or switch the status filter.</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Profile</th>
                <th>Assigned Table</th>
                <th>Cart Load</th>
                <th>Timestamp</th>
                <th>Items Ordered</th>
                <th>Workflow Status</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>
                    <div className="customer-box">
                      <div
                        className={`customer-avatar ${
                          avatarColors[index % avatarColors.length]
                        }`}
                      >
                        {order.customer.charAt(0)}
                      </div>
                      <div>
                        <h4>{order.customer}</h4>
                        <p>{order.customerType}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-badge">
                      <Table2 size={14} />
                      {order.table}
                    </span>
                  </td>
                  <td>{order.itemsCount} Items</td>
                  <td>
                    <span className="time-cell">
                      <CalendarDays size={14} />
                      {order.date}
                    </span>
                    <small>{order.time}</small>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        maxHeight: "60px",
                        overflowY: "auto",
                        fontSize: "12px",
                      }}
                    >
                      {order.breakdown.map((item, i) => (
                        <span
                          key={i}
                          style={{ color: "#475569", whiteSpace: "nowrap" }}
                        >
                          <strong>{item.qty}x</strong> {item.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge-history ${order.status.toLowerCase()}`}
                    >
                      {order.status === "Completed" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-inspect-btn"
                      onClick={() => setSelectedOrder(order)}
                      type="button"
                    >
                      <Eye size={14} />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="invoice-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="invoice-header">
              <div>
                <span className="invoice-kicker">Receipt Preview</span>
                <h2>Invoice Manifest</h2>
                <p>
                  {selectedOrder.id} - {selectedOrder.date}
                </p>
              </div>
              <button
                className="close-x-btn"
                onClick={() => setSelectedOrder(null)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="invoice-meta-grid">
              <p>
                <User size={14} />
                <span>Customer</span>
                <strong>{selectedOrder.customer}</strong>
              </p>
              <p>
                <Table2 size={14} />
                <span>Table</span>
                <strong>{selectedOrder.table}</strong>
              </p>
              <p>
                <CalendarDays size={14} />
                <span>Time</span>
                <strong>{selectedOrder.time}</strong>
              </p>
              <p>
                <Wallet size={14} />
                <span>Payment</span>
                <strong>{selectedOrder.paymentMethod}</strong>
              </p>
            </div>

            <h4 className="modal-section-title">Itemized Summary</h4>
            <div className="invoice-items-list">
              {selectedOrder.breakdown.map((item, i) => (
                <div key={i} className="invoice-item-row">
                  <span>
                    {item.name} <strong>x{item.qty}</strong>
                  </span>
                </div>
              ))}
            </div>

            <div className="invoice-total-row">
              <h3>Total Items</h3>
              <h2>{selectedOrder.itemsCount}</h2>
            </div>

            <div className="invoice-status-footer">
              <span
                className={`status-badge-history ${selectedOrder.status.toLowerCase()}`}
              >
                {selectedOrder.status === "Completed" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                Invoice State: {selectedOrder.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED PRINTABLE PDF REPORT LAYOUT */}
      <div id="printable-order-history">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", margin: "0 0 8px 0" }}>
            ASLENIX RESTAURANT
          </h2>
          <h3
            style={{ fontSize: "16px", margin: "0 0 5px 0", color: "#475569" }}
          >
            Order History Report
          </h3>
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Filter Status:</strong> {activeTab}
          </p>
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Generated On:</strong> {new Date().toLocaleString()}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            fontSize: "13px",
            backgroundColor: "#f8fafc",
            padding: "12px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            WebkitPrintColorAdjust: "exact",
          }}
        >
          <div>
            <strong>Orders Displayed:</strong> {filteredOrders.length}
          </div>
          <div>
            <strong>Items Processed:</strong> {stats.totalItems}
          </div>
          <div>
            <strong>Completed Orders:</strong> {stats.completedCount}
          </div>
          <div>
            <strong>Cancelled Orders:</strong> {stats.cancelledCount}
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date & Time</th>
              <th>Customer</th>
              <th>Table</th>
              <th>Items Ordered</th>
              <th style={{ textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => {
              const itemsBreakdown = order.breakdown
                .map((i) => `${i.qty}x ${i.name}`)
                .join("; ");
              return (
                <tr key={idx}>
                  <td style={{ fontWeight: "bold" }}>{order.id}</td>
                  <td>
                    {order.date || "N/A"} {order.time || ""}
                  </td>
                  <td>{order.customer || "Guest"}</td>
                  <td>{order.table || "Walk-in"}</td>
                  <td>{itemsBreakdown}</td>
                  <td style={{ textAlign: "center" }}>{order.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
