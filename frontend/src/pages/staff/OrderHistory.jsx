import { useMemo, useState } from "react";
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
} from "lucide-react";
import "../../styles/history.css";
import { useOrders } from "../../context/OrderContext";

const filters = ["All", "Completed", "Cancelled"];

const avatarColors = ["blue", "violet", "green"];

const History = () => {
  const { orders = [] } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const ordersList = useMemo(() => {
    return orders
      .filter((o) => o.status === "Completed" || o.status === "Cancelled")
      .map((o) => {
        const subtotal = (o.items || []).reduce(
          (sum, i) => sum + i.qty * (parseFloat(i.price) || 0),
          0
        );
        const amount =
          o.amount !== undefined
            ? o.amount
            : subtotal + (subtotal > 0 ? 50 : 0);
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

  const handleExport = () => {
    setIsExporting(true);
    window.setTimeout(() => setIsExporting(false), 900);
  };

  return (
    <div className="history-page">
      <section className="history-hero">
        <div>
          <span className="history-eyebrow">
            <Receipt size={16} />
            Staff Order Ledger
          </span>
          <h1>Order History</h1>
          <p>
            Track completed and cancelled restaurant orders with receipt-level
            detail.
          </p>
        </div>

        <button
          className={`export-btn ${isExporting ? "loading" : ""}`}
          onClick={handleExport}
          disabled={isExporting}
          type="button"
        >
          <Download size={16} />
          {isExporting ? "Preparing..." : "Export History"}
        </button>
      </section>

      <section className="history-summary-cards">
        <div className="summary-card dark">
          <span className="card-icon">
            <FileText size={23} />
          </span>
          <div>
            <h3>{stats.totalItems} Items</h3>
            <p>Total Items Processed</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="card-icon green">
            <CheckCircle2 size={23} />
          </span>
          <div>
            <h3>{stats.completedCount} Orders</h3>
            <p>Completed Manifests</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="card-icon red">
            <XCircle size={23} />
          </span>
          <div>
            <h3>{stats.cancelledCount} Orders</h3>
            <p>Cancelled Invoices</p>
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", maxHeight: "60px", overflowY: "auto", fontSize: "12px" }}>
                      {order.breakdown.map((item, i) => (
                        <span key={i} style={{ color: "#475569", whiteSpace: "nowrap" }}>
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
    </div>
  );
};

export default History;
