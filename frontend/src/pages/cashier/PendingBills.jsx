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
  Receipt,
  Search,
  Smartphone,
  Table2,
  User,
  Wallet,
  X,
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

const filters = ["All", "Unpaid", "Partial"];

export default function PendingBillsPage() {
  const { orders, completeOrder } = useOrders();
  const { updateTableStatus } = useTables();

  // Dynamically generate pending bills from live global orders
  const pendingBillsData = useMemo(() => {
    return orders
      .filter((order) => order.status !== "Completed") // Only show unpaid orders
      .map((order) => {
        const subtotal = (order.items || []).reduce((acc, item) => acc + item.qty * item.price, 0);
        return {
          id: order.id,
          table: order.table || "Walk-in",
          customer: order.customer || "Guest",
          server: order.server || "System",
          amount: subtotal + (subtotal * 0.13) + (subtotal > 0 ? 50 : 0), // Subtotal + VAT + Service Charge
          status: "Unpaid",
          priority: order.priority || "Normal",
          guests: order.guests || 1,
          time: order.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: order.date || new Date().toLocaleDateString(),
          section: order.channel || "Dining",
          items: order.items || [],
        };
      });
  }, [orders]);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedInvoice = pendingBillsData.find((bill) => bill.id === selectedInvoiceId);

  const filteredBills = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return pendingBillsData.filter((bill) => {
      const matchesFilter = activeFilter === "All" || bill.status === activeFilter;
      const matchesSearch =
        !term ||
        bill.id.toLowerCase().includes(term) ||
        bill.table.toLowerCase().includes(term) ||
        bill.customer.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const metrics = useMemo(() => {
    const totalDue = pendingBillsData.reduce((sum, bill) => sum + bill.amount, 0);
    const unpaid = pendingBillsData.filter((bill) => bill.status === "Unpaid").length;
    const partial = pendingBillsData.filter((bill) => bill.status === "Partial").length;
    const largestBill = Math.max(...pendingBillsData.map((bill) => bill.amount));

    return { totalDue, unpaid, partial, largestBill };
  }, []);

  const subtotal = selectedInvoice
    ? selectedInvoice.items.reduce((acc, item) => acc + item.qty * item.price, 0)
    : 0;

  const discountAmount = selectedInvoice
    ? discountType === "percentage"
      ? subtotal * (Math.min(Math.max(discountValue, 0), 100) / 100)
      : Math.min(Math.max(discountValue, 0), subtotal)
    : 0;

  const taxableAmount = subtotal - discountAmount;
  const vat = taxableAmount * 0.13;
  const serviceCharge = subtotal > 0 ? 50 : 0;
  const total = taxableAmount + vat + serviceCharge;

  const handleSelectInvoice = (billId) => {
    setSelectedInvoiceId(billId);
    setDiscountValue(0);
  };

  return (
    <div className="pending-bills-modern">
      <main className="pending-shell">
        <section className="pending-hero">
          <div>
            <span className="pending-eyebrow">
              <Receipt size={16} />
              Cashier Checkout Desk
            </span>
            <h1>Pending Bills</h1>
            <p>Settle open restaurant checks, apply discounts, and close tables faster.</p>
          </div>

          <div className="pending-hero-actions">
            <div className="pending-search">
              <Search size={17} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search table, guest, or invoice"
              />
            </div>
            <button className="pending-date-btn" type="button">
              <CalendarDays size={17} />
              Today
            </button>
          </div>
        </section>

        <section className="pending-metrics">
          <div className="pending-metric-card dark">
            <span className="metric-icon"><Wallet size={22} /></span>
            <div>
              <p>Total Due</p>
              <strong>Rs. {metrics.totalDue.toLocaleString()}</strong>
            </div>
          </div>
          <div className="pending-metric-card">
            <span className="metric-icon red"><Receipt size={22} /></span>
            <div>
              <p>Unpaid Checks</p>
              <strong>{metrics.unpaid}</strong>
            </div>
          </div>
          <div className="pending-metric-card">
            <span className="metric-icon amber"><Coins size={22} /></span>
            <div>
              <p>Partial Bills</p>
              <strong>{metrics.partial}</strong>
            </div>
          </div>
          <div className="pending-metric-card">
            <span className="metric-icon green"><ChefHat size={22} /></span>
            <div>
              <p>Largest Table</p>
              <strong>Rs. {metrics.largestBill.toLocaleString()}</strong>
            </div>
          </div>
        </section>

        <section className="pending-toolbar">
          <div className="filter-label">
            <Filter size={16} />
            Bill Queue
          </div>
          <div className="pending-tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                type="button"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="bill-card-grid">
          {filteredBills.map((bill) => {
            const isSelected = selectedInvoiceId === bill.id;

            return (
              <button
                key={bill.id}
                type="button"
                onClick={() => handleSelectInvoice(bill.id)}
                className={`restaurant-bill-card ${isSelected ? "selected" : ""} status-${bill.status.toLowerCase()}`}
              >
                <div className="bill-card-top">
                  <span className="invoice-pill">{bill.id}</span>
                  <span className="bill-status">{bill.status}</span>
                </div>

                <div className="table-focus">
                  <span className="table-icon"><Table2 size={22} /></span>
                  <div>
                    <h2>{bill.table}</h2>
                    <p>{bill.section} section</p>
                  </div>
                </div>

                <div className="bill-meta-grid">
                  <span><User size={14} /> {bill.customer}</span>
                  <span><Clock size={14} /> {bill.time}</span>
                  <span>{bill.guests} guests</span>
                  <span>Server {bill.server}</span>
                </div>

                <div className="bill-card-bottom">
                  <div>
                    <span className="priority-copy">{bill.priority}</span>
                    <strong>Rs. {bill.amount.toLocaleString()}</strong>
                  </div>
                  <span className="checkout-cta">Checkout</span>
                </div>
              </button>
            );
          })}
        </section>

        {filteredBills.length === 0 && (
          <div className="empty-bill-state">
            <Receipt size={30} />
            <h2>No bills found</h2>
            <p>Try another search term or change the bill status filter.</p>
          </div>
        )}

        {selectedInvoice && (
          <div className="checkout-popout-backdrop" onClick={() => setSelectedInvoiceId(null)}>
            <div className="billing-checkout-pane" onClick={(event) => event.stopPropagation()}>
              <div className="pane-header">
                <div>
                  <span className="checkout-kicker">Restaurant checkout</span>
                  <h2>{selectedInvoice.table}</h2>
                  <p>{selectedInvoice.id} - {selectedInvoice.customer}</p>
                </div>
                <button className="close-pane-icon" type="button" onClick={() => setSelectedInvoiceId(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="checkout-info-strip">
                <span>Date <strong>{selectedInvoice.date}</strong></span>
                <span>Time <strong>{selectedInvoice.time}</strong></span>
                <span>Guests <strong>{selectedInvoice.guests}</strong></span>
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
                          <span>Rs. {item.price} each - {item.station}</span>
                        </td>
                        <td>{item.qty}</td>
                        <td>Rs. {(item.qty * item.price).toLocaleString()}</td>
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
                  onChange={(event) => setDiscountValue(parseFloat(event.target.value) || 0)}
                  placeholder={discountType === "percentage" ? "Percentage reduction" : "Flat discount amount"}
                  className="discount-input"
                />
              </div>

              <div className="checkout-summary">
                <div><span>Subtotal</span><strong>Rs. {subtotal.toLocaleString()}</strong></div>
                <div className="discount-row"><span>Discount</span><strong>- Rs. {discountAmount.toFixed(2)}</strong></div>
                <div><span>VAT (13%)</span><strong>Rs. {vat.toFixed(2)}</strong></div>
                <div><span>Service Charge</span><strong>Rs. {serviceCharge}</strong></div>
                <div className="grand-total"><span>Grand Total</span><strong>Rs. {total.toFixed(2)}</strong></div>
              </div>

              <button 
                className="complete-payment-btn-modern" 
                type="button"
                onClick={() => {
                  // 1. Free up the table globally if it was a dine-in order
                  const match = selectedInvoice.table.match(/\d+/);
                  if (match) {
                    updateTableStatus(parseInt(match[0]), "Available", "No Customer");
                  }
                  
                  // 2. Mark the order as completed to remove it from Pending Bills
                  completeOrder(selectedInvoice.id); // Triggers global context update
                  setSelectedInvoiceId(null); // Closes the modal
                  alert(`Payment of Rs. ${total.toFixed(2)} completed! Table is now free.`);
                }}
              >
                <CheckCircle size={16} />
                Complete Payment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
