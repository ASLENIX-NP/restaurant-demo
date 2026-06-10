import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  CheckCircle,
  ChefHat,
  Clock,
  Coins,
  CreditCard,
  Filter,
  Percent,
  Printer,
  Receipt,
  Search,
  Smartphone,
  Table2,
  User,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import "../../styles/pendingBills.css";
import { useOrders } from "../../context/OrderContext";
import { useTables } from "../../context/TableContext";

const paymentMethods = [
  { name: "Cash", icon: Banknote },
  { name: "Card", icon: CreditCard },
  { name: "eSewa", icon: Smartphone },
  { name: "Khalti", icon: Wallet },
];

const filters = ["All", "Pending", "Cooking", "Ready", "Served"];

export default function PendingBillsPage() {
  const { orders = [], completeOrder, cancelOrder } = useOrders() || {};
  const { tables = [], updateTableStatus } = useTables() || {};

  // Dynamically generate pending bills from live global orders
  const pendingBillsData = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== "Completed"); // Only show unpaid orders
    const grouped = {};

    activeOrders.forEach((order) => {
      const isTable =
        order.table && order.table !== "Walk-in" && order.table !== "Queue";
      const key = isTable ? order.table : order.id; // Group by table if seated, else by ID

      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          orderIds: [order.id],
          table: order.table || "Walk-in",
          customer: order.customer || "Guest",
          server: order.server || "System",
          subtotal: 0,
          paymentStatus: "Unpaid",
          statuses: [order.status],
          priority: order.priority || "Normal",
          guests: order.guests || 1,
          time:
            order.time ||
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          date: order.date || new Date().toLocaleDateString(),
          section: order.channel || "Dining",
          items: [],
        };
      } else {
        grouped[key].orderIds.push(order.id);
        grouped[key].statuses.push(order.status);
      }

      const orderSubtotal = (order.items || []).reduce(
        (acc, item) => acc + item.qty * (parseFloat(item.price) || 0),
        0
      );
      grouped[key].subtotal += orderSubtotal;

      // Merge identical items
      (order.items || []).forEach((item) => {
        const existingItem = grouped[key].items.find(
          (i) => i.name === item.name && i.price === item.price
        );
        if (existingItem) {
          existingItem.qty += item.qty;
        } else {
          grouped[key].items.push({ ...item });
        }
      });
    });

    return Object.values(grouped).map((group) => {
      // Determine highest priority kitchen status across merged orders
      let overallStatus = "Served";
      if (group.statuses.includes("Pending")) overallStatus = "Pending";
      else if (group.statuses.includes("Cooking")) overallStatus = "Cooking";
      else if (group.statuses.includes("Ready")) overallStatus = "Ready";

      return {
        ...group,
        amount: group.subtotal,
        kitchenStatus: overallStatus,
      };
    });
  }, [orders]);

  const defaultTaxSettings = useMemo(() => {
    const saved = localStorage.getItem("restaurant_tax_settings");
    return saved ? JSON.parse(saved) : { vat: 13, serviceCharge: 10, defaultDiscount: 0 };
  }, []);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(defaultTaxSettings.defaultDiscount);
  const [serviceCharge, setServiceCharge] = useState(defaultTaxSettings.serviceCharge);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const selectedInvoice = pendingBillsData.find(
    (bill) => bill.id === selectedInvoiceId
  );

  const filteredBills = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return pendingBillsData.filter((bill) => {
      const matchesFilter =
        activeFilter === "All" || bill.kitchenStatus === activeFilter;
      const matchesSearch =
        !term ||
        bill.id.toLowerCase().includes(term) ||
        bill.orderIds.some((id) => id.toLowerCase().includes(term)) ||
        bill.table.toLowerCase().includes(term) ||
        bill.customer.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm, pendingBillsData]);

  const metrics = useMemo(() => {
    const pending = pendingBillsData.filter(
      (bill) => bill.kitchenStatus === "Pending"
    ).length;
    const cooking = pendingBillsData.filter(
      (bill) => bill.kitchenStatus === "Cooking"
    ).length;
    const ready = pendingBillsData.filter(
      (bill) => bill.kitchenStatus === "Ready"
    ).length;
    const served = pendingBillsData.filter(
      (bill) => bill.kitchenStatus === "Served"
    ).length;

    return {
      total: pendingBillsData.length,
      pending,
      cooking,
      ready,
      served,
    };
  }, [pendingBillsData]);

  const subtotal = selectedInvoice
    ? selectedInvoice.items.reduce(
        (acc, item) => acc + item.qty * (parseFloat(item.price) || 0),
        0
      )
    : 0;

  const discountAmount = selectedInvoice
    ? discountType === "percentage"
      ? subtotal * (Math.min(Math.max(discountValue || 0, 0), 100) / 100)
      : Math.min(Math.max(discountValue || 0, 0), subtotal)
    : 0;

  const safeServiceCharge = serviceCharge || 0;
  const total = subtotal - discountAmount + safeServiceCharge;

  const handleSelectInvoice = (billId) => {
    setSelectedInvoiceId(billId);
    setDiscountValue(defaultTaxSettings.defaultDiscount);
    setServiceCharge(defaultTaxSettings.serviceCharge); // Default service charge when opening a bill
    setIsPaymentSuccess(false);
  };

  const handleFinalizePayment = (shouldPrint) => {
    if (shouldPrint) {
      window.print();
    }

    // Use a small timeout to ensure a smooth transition and reliable print capture
    setTimeout(() => {
      const tableObj = tables.find((t) => t.name === selectedInvoice.table);
      if (tableObj) {
        updateTableStatus(tableObj.id, "Available", "No Customer");
      } else {
        const match = selectedInvoice.table.match(/\d+/);
        if (match) {
          updateTableStatus(parseInt(match[0], 10), "Available", "No Customer");
        }
      }

      const finalDetails = {
        paymentMethod,
        discountAmount,
        serviceCharge: safeServiceCharge,
        amount: total,
      };

      if (selectedInvoice.orderIds) {
        const splitDetails = {
          ...finalDetails,
          amount: total / selectedInvoice.orderIds.length,
          discountAmount: discountAmount / selectedInvoice.orderIds.length,
          serviceCharge: safeServiceCharge / selectedInvoice.orderIds.length,
        };
        selectedInvoice.orderIds.forEach((id) =>
          completeOrder(id, splitDetails)
        );
      } else {
        completeOrder(selectedInvoice.id, finalDetails);
      }

      setIsPaymentSuccess(false);
      setSelectedInvoiceId(null);
    }, 100);
  };

  const handleCancelBill = () => {
    if (window.confirm("Are you sure you want to cancel this bill?")) {
      const tableObj = tables.find((t) => t.name === selectedInvoice.table);
      if (tableObj) {
        updateTableStatus(tableObj.id, "Available", "No Customer");
      } else {
        const match = selectedInvoice.table.match(/\d+/);
        if (match) {
          updateTableStatus(parseInt(match[0], 10), "Available", "No Customer");
        }
      }

      if (selectedInvoice.orderIds) {
        selectedInvoice.orderIds.forEach((id) => cancelOrder(id));
      } else {
        cancelOrder(selectedInvoice.id);
      }
      setSelectedInvoiceId(null);
    }
  };

  return (
    <div className="pending-bills-modern">
      {/* PRINT-ONLY STYLES */}
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
          .sidebar, .navbar, header, footer, .pending-shell, .checkout-popout-backdrop, .print-modal-hide {
            display: none !important;
          }
          .pending-bills-modern {
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            min-width: 0 !important;
            background: transparent !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
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
          #printable-receipt {
            display: none;
          }

          /* Checkout Pane UI Enhancements */
          .billing-checkout-pane {
            width: 100vw !important;
            max-width: 580px !important;
            padding: 2.5rem 2rem !important;
          }
          .pane-header h2 {
            font-size: 1.8rem !important;
            margin-bottom: 0.25rem !important;
          }
          .pane-table-box table {
            font-size: 15px !important;
          }
          .pane-table-box th, .pane-table-box td {
            padding: 12px 8px !important;
          }
          .payment-method-grid button {
            padding: 16px !important;
            font-size: 15px !important;
            gap: 10px !important;
          }
          .checkout-summary {
            font-size: 16px !important;
            gap: 12px !important;
          }
          .grand-total {
            margin-top: 12px !important;
            padding-top: 18px !important;
          }
          .grand-total strong {
            font-size: 1.85rem !important;
          }
          .discount-input {
            padding: 16px 18px !important;
            font-size: 16px !important;
            border-radius: 12px !important;
          }
          .pending-metric-card.active {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(30, 41, 59, 0.1), 0 4px 6px -2px rgba(30, 41, 59, 0.05);
            border-color: #4f46e5;
          }
        }
        `}
      </style>

      <main className="pending-shell" style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <section className="pending-hero" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', backgroundColor: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div>
            <span className="pending-eyebrow" style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#6366f1', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              <Receipt size={16} />
              Cashier Checkout Desk
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Pending Bills</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
              Settle open restaurant checks, apply discounts, and close tables
              faster.
            </p>
          </div>

          <div className="pending-hero-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="pending-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <Search size={17} color="#64748b" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search table, guest or ID..."
                style={{ border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', fontSize: '14px', width: '220px' }}
              />
            </div>
            <button className="pending-date-btn" type="button" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
              <CalendarDays size={17} />
              Today
            </button>
          </div>
        </section>

        <section className="pending-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <button
            type="button"
            onClick={() => setActiveFilter("All")}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', backgroundColor: '#fff', borderRadius: '20px', border: activeFilter === 'All' ? '2px solid #6366f1' : '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: activeFilter === 'All' ? '0 10px 15px -3px rgba(99, 102, 241, 0.1)' : '0 4px 6px -1px rgba(0,0,0,0.02)' }}
          >
            <span className="metric-icon" style={{ width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#475569' }}>
              <Wallet size={28} />
            </span>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>All Bills</p>
              <strong style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{metrics.total}</strong>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("Pending")}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', backgroundColor: '#fff', borderRadius: '20px', border: activeFilter === 'Pending' ? '2px solid #ef4444' : '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: activeFilter === 'Pending' ? '0 10px 15px -3px rgba(239, 68, 68, 0.1)' : '0 4px 6px -1px rgba(0,0,0,0.02)' }}
          >
            <span className="metric-icon red" style={{ width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff1f2', color: '#ef4444' }}>
              <Clock size={28} />
            </span>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</p>
              <strong style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{metrics.pending}</strong>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("Cooking")}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', backgroundColor: '#fff', borderRadius: '20px', border: activeFilter === 'Cooking' ? '2px solid #f59e0b' : '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: activeFilter === 'Cooking' ? '0 10px 15px -3px rgba(245, 158, 11, 0.1)' : '0 4px 6px -1px rgba(0,0,0,0.02)' }}
          >
            <span className="metric-icon amber" style={{ width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <ChefHat size={28} />
            </span>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cooking</p>
              <strong style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{metrics.cooking}</strong>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("Ready")}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', backgroundColor: '#fff', borderRadius: '20px', border: activeFilter === 'Ready' || activeFilter === 'Served' ? '2px solid #10b981' : '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: activeFilter === 'Ready' || activeFilter === 'Served' ? '0 10px 15px -3px rgba(16, 185, 129, 0.1)' : '0 4px 6px -1px rgba(0,0,0,0.02)' }}
          >
            <span className="metric-icon green" style={{ width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <CheckCircle size={28} />
            </span>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ready / Served</p>
              <strong style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>{metrics.ready + metrics.served}</strong>
            </div>
          </button>
        </section>

        <section className="pending-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="filter-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#334155' }}>
            <Filter size={16} />
            Bill Queue
          </div>
          <div className="pending-tabs" style={{ display: 'flex', gap: '8px', backgroundColor: '#f1f5f9', padding: '6px', borderRadius: '12px' }}>
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeFilter === filter ? '#fff' : 'transparent', color: activeFilter === filter ? '#2563eb' : '#64748b', boxShadow: activeFilter === filter ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="bill-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredBills.map((bill) => {
            const isSelected = selectedInvoiceId === bill.id;

            return (
              <button
                key={bill.id}
                type="button"
                onClick={() => handleSelectInvoice(bill.id)}
                style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: isSelected ? '0 10px 25px -5px rgba(99, 102, 241, 0.15)' : '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: bill.kitchenStatus === 'Pending' ? '#ef4444' : bill.kitchenStatus === 'Cooking' ? '#f59e0b' : bill.kitchenStatus === 'Ready' ? '#10b981' : '#64748b' }} />

                <div className="bill-card-top" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px', alignItems: 'center' }}>
                  <span className="invoice-pill" style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                    {bill.orderIds[0]}{" "}
                    {bill.orderIds.length > 1
                      ? `(+${bill.orderIds.length - 1})`
                      : ""}
                  </span>
                  <span
                    className={`bill-status`}
                    style={{ fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '8px', backgroundColor: bill.kitchenStatus === 'Pending' ? '#fff1f2' : bill.kitchenStatus === 'Cooking' ? '#fffbeb' : bill.kitchenStatus === 'Ready' ? '#ecfdf5' : '#f1f5f9', color: bill.kitchenStatus === 'Pending' ? '#e11d48' : bill.kitchenStatus === 'Cooking' ? '#d97706' : bill.kitchenStatus === 'Ready' ? '#16a34a' : '#475569' }}
                  >
                    {bill.kitchenStatus}
                  </span>
                </div>

                <div className="table-focus" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <span className="table-icon" style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Table2 size={24} />
                  </span>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>{bill.table}</h2>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: '600' }}>{bill.section} Section</p>
                  </div>
                </div>

                <div className="bill-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                    <User size={14} color="#94a3b8" /> {bill.customer}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                    <Clock size={14} color="#94a3b8" /> {bill.time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                    <Users size={14} color="#94a3b8" /> {bill.guests} Guests
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                    <ChefHat size={14} color="#94a3b8" /> {bill.server}
                  </span>
                </div>

                <div className="bill-card-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <span className="priority-copy" style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>{bill.priority} Priority</span>
                    <strong style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>Rs. {bill.amount.toLocaleString()}</strong>
                  </div>
                  <span className="checkout-cta" style={{ fontSize: '14px', fontWeight: 'bold', color: isSelected ? '#fff' : '#6366f1', padding: '10px 20px', backgroundColor: isSelected ? '#6366f1' : '#e0e7ff', borderRadius: '10px', transition: 'all 0.2s' }}>Checkout</span>
                </div>
              </button>
            );
          })}
        </section>

        {filteredBills.length === 0 && (
          <div className="empty-bill-state" style={{ textAlign: 'center', padding: '64px 20px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <Receipt size={48} style={{ margin: '0 auto 16px auto', color: '#cbd5e1' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>No bills found</h2>
            <p style={{ margin: 0, fontSize: '15px' }}>Try another search term or change the bill status filter.</p>
          </div>
        )}

        {selectedInvoice && (
          <div
            className="checkout-popout-backdrop"
            onClick={() => setSelectedInvoiceId(null)}
          >
            <div
              className="billing-checkout-pane"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pane-header">
                <div>
                  <span className="checkout-kicker">Restaurant checkout</span>
                  <h2>{selectedInvoice.table}</h2>
                  <p>
                    {selectedInvoice.orderIds.join(", ")} -{" "}
                    {selectedInvoice.customer}
                  </p>
                </div>
                <button
                  className="close-pane-icon"
                  type="button"
                  onClick={() => setSelectedInvoiceId(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="checkout-info-strip">
                <span>
                  Date <strong>{selectedInvoice.date}</strong>
                </span>
                <span>
                  Time <strong>{selectedInvoice.time}</strong>
                </span>
                <span>
                  Guests <strong>{selectedInvoice.guests}</strong>
                </span>
              </div>

              <div className="pane-table-box">
                <table>
                  <thead>
                    <tr>
                      <th>Item Ordered</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.name}>
                        <td>
                          <strong>{item.name}</strong>
                          <span>
                            Rs. {item.price || 0} each{" "}
                            {item.station ? `- ${item.station}` : ""}
                          </span>
                        </td>
                        <td>{item.qty}</td>
                        <td>
                          Rs.{" "}
                          {(
                            item.qty * (parseFloat(item.price) || 0)
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="checkout-section">
                <h3>Payment Method</h3>
                <div className="payment-method-grid">
                  {paymentMethods.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setPaymentMethod(name)}
                      className={paymentMethod === name ? "active" : ""}
                    >
                      <Icon size={15} />
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="checkout-section">
                <h3>Apply Bill Discount</h3>
                <div className="discount-switch">
                  <button
                    type="button"
                    onClick={() => {
                      setDiscountType("percentage");
                      setDiscountValue(0);
                    }}
                    className={discountType === "percentage" ? "active" : ""}
                  >
                    <Percent size={13} />
                    Percent
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscountType("flat");
                      setDiscountValue(0);
                    }}
                    className={discountType === "flat" ? "active" : ""}
                  >
                    <Coins size={13} />
                    Flat
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  max={discountType === "percentage" ? 100 : subtotal}
                  value={discountValue || ""}
                  onChange={(event) =>
                    setDiscountValue(
                      event.target.value === ""
                        ? 0
                        : parseFloat(event.target.value)
                    )
                  }
                  placeholder={
                    discountType === "percentage"
                      ? "Percentage reduction"
                      : "Flat discount amount"
                  }
                  className="discount-input"
                />
              </div>

              <div className="checkout-section" style={{ marginTop: "1rem" }}>
                <h3>Service Charge</h3>
                <input
                  type="number"
                  min="0"
                  value={serviceCharge === 0 ? "" : serviceCharge}
                  onChange={(event) =>
                    setServiceCharge(
                      event.target.value === ""
                        ? 0
                        : parseFloat(event.target.value)
                    )
                  }
                  placeholder="Service charge amount"
                  className="discount-input"
                />
              </div>

              <div className="checkout-summary">
                <div>
                  <span>Subtotal (Excl. VAT)</span>
                  <strong>
                    Rs.{" "}
                    {(subtotal / (1 + defaultTaxSettings.vat / 100)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
                <div>
                  <span>VAT ({defaultTaxSettings.vat}%)</span>
                  <strong>
                    Rs.{" "}
                    {(subtotal - subtotal / (1 + defaultTaxSettings.vat / 100)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
                <div className="discount-row">
                  <span>Discount</span>
                  <strong>- Rs. {discountAmount.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Service Charge</span>
                  <strong>Rs. {safeServiceCharge.toFixed(2)}</strong>
                </div>
                <div className="grand-total">
                  <span>Grand Total</span>
                  <strong>Rs. {total.toFixed(2)}</strong>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  width: "100%",
                  marginTop: "16px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={{
                    flex: "1 1 calc(50% - 6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "16px 20px",
                    backgroundColor: "#fff1f2",
                    border: "1px solid #ffe4e6",
                    borderRadius: "14px",
                    color: "#e11d48",
                    fontWeight: "bold",
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  type="button"
                  onClick={handleCancelBill}
                  title="Cancel and Void Bill"
                >
                  <XCircle size={20} /> Cancel Bill
                </button>
                <button
                  style={{
                    flex: "1 1 calc(50% - 6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "16px 20px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    color: "#475569",
                    fontWeight: "bold",
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  type="button"
                  onClick={() => window.print()}
                  title="Print Receipt"
                >
                  <Printer size={20} /> Print
                </button>
                <button
                  className="complete-payment-btn-modern"
                  style={{
                    flex: "1 1 100%",
                    margin: 0,
                    padding: "20px",
                    fontSize: "17px",
                    borderRadius: "14px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  type="button"
                  onClick={() => setIsPaymentSuccess(true)}
                >
                  <CheckCircle size={22} />
                  Complete Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS / PRINT MODAL */}
        {isPaymentSuccess && selectedInvoice && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex justify-center items-center p-4 transition-opacity print-modal-hide">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-in">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">
                Payment Completed!
              </h2>
              <p className="text-sm text-slate-500 font-medium mb-6">
                Payment of <strong>Rs. {total.toFixed(2)}</strong> received
                successfully. The table is now free. Would you like to print the
                receipt?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleFinalizePayment(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition"
                >
                  No, Thanks
                </button>
                <button
                  onClick={() => handleFinalizePayment(true)}
                  className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-200 transition flex justify-center items-center gap-2"
                >
                  <Printer size={18} /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DEDICATED PRINTABLE RECEIPT LAYOUT */}
      {selectedInvoice && (
        <div id="printable-receipt">
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h2 style={{ fontSize: "20px", margin: "0 0 5px 0" }}>
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
              <span>Bill No:</span>{" "}
              <span>{selectedInvoice.orderIds.join(", ")}</span>
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
                {selectedInvoice.date} {selectedInvoice.time}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Table:</span> <span>{selectedInvoice.table}</span>
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
              {selectedInvoice.items.map((item, idx) => (
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
              marginBottom: "5px",
            }}
          >
            <span>Subtotal (Excl. VAT):</span>{" "}
            <span>Rs. {(subtotal / (1 + defaultTaxSettings.vat / 100)).toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <span>VAT ({defaultTaxSettings.vat}%):</span>{" "}
            <span>Rs. {(subtotal - subtotal / (1 + defaultTaxSettings.vat / 100)).toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Discount:</span>{" "}
              <span>- Rs. {discountAmount.toFixed(2)}</span>
            </div>
          )}
          {serviceCharge > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Service Charge:</span>{" "}
              <span>Rs. {serviceCharge.toFixed(2)}</span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "10px",
              borderTop: "1px dashed #000",
              paddingTop: "10px",
            }}
          >
            <span>GRAND TOTAL:</span>
            <span>Rs. {total.toFixed(2)}</span>
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
    </div>
  );
}
