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
  CheckCircle
} from "lucide-react";

// Mock Data Array
const INITIAL_INVOICES = [
  { id: "INV-10024", date: "May 15, 2024", customer: "Walk-in Customer", amount: "Rs. 2,250.00", status: "Paid", method: "Cash", items: [{ name: "Burger", qty: 3, price: 350 }, { name: "Pizza", qty: 1, price: 700 }, { name: "Coke", qty: 4, price: 100 }] },
  { id: "INV-10023", date: "May 15, 2024", customer: "Arman Sharma", amount: "Rs. 1,350.00", status: "Paid", method: "Card", items: [{ name: "Fried Chicken", qty: 2, price: 500 }, { name: "Momo", qty: 1, price: 350 }] },
  { id: "INV-10022", date: "May 15, 2024", customer: "Neha Verma", amount: "Rs. 880.00", status: "Paid", method: "Khalti", items: [{ name: "Veg Biryani", qty: 4, price: 220 }] },
  { id: "INV-10021", date: "May 15, 2024", customer: "Sita Thapa", amount: "Rs. 1,080.00", status: "Pending", method: "eSewa", items: [{ name: "Paneer Tikka", qty: 2, price: 400 }, { name: "Naan", qty: 4, price: 70 }] },
  { id: "INV-10020", date: "May 14, 2024", customer: "Rohan Das", amount: "Rs. 3,300.00", status: "Paid", method: "Card", items: [{ name: "Platter Meal", qty: 3, price: 1100 }] },
  { id: "INV-10019", date: "May 14, 2024", customer: "Walk-in Customer", amount: "Rs. 2,150.00", status: "Paid", method: "Cash", items: [{ name: "Pizza Special", qty: 2, price: 900 }, { name: "Ice Tea", qty: 5, price: 70 }] },
  { id: "INV-10018", date: "May 14, 2024", customer: "Amit Kumar", amount: "Rs. 1,750.00", status: "Cancelled", method: "Card", items: [{ name: "Pasta Bolognese", qty: 2, price: 875 }] },
  { id: "INV-10017", date: "May 13, 2024", customer: "Priya Patel", amount: "Rs. 950.00", status: "Paid", method: "Khalti", items: [{ name: "Chowmein", qty: 3, price: 250 }, { name: "Lemonade", qty: 2, price: 100 }] },
];

const ITEMS_PER_PAGE = 5;

const Invoices = () => {
  // Collection core state Management
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Feature specific toggle Hooks
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Triggers Modal View
  const [activeDropdownId, setActiveDropdownId] = useState(null); // Triggers Context Menu
  const menuRef = useRef(null);

  // Close context dropdown menus when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 1. Filter layout setup tracking search query changes
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

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
    alert(`Initializing print queue layout configuration window for: ${invoice.id}`);
    window.print();
  };

  const handleUpdateStatus = (id, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    setActiveDropdownId(null);
  };

  return (
    <div className="invoices-page">
      {/* Header Layout */}
      <div className="invoice-top">
        <div>
          <h1>Invoices</h1>
          <p>Home <span>&rsaquo;</span> Invoices</p>
        </div>
        <div className="invoice-actions">
          <button className="filter-btn">Filter</button>
          <button className="new-btn"><Plus size={16} /> New Invoice</button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="invoice-stats">
        <div className="invoice-card">
          <div className="card-icon blue"><FileText size={20} /></div>
          <div>
            <h4>Total Invoices</h4>
            <h2>128</h2>
            <span className="green">&uarr; 15.2% vs yesterday</span>
          </div>
        </div>
        <div className="invoice-card">
          <div className="card-icon green-bg"><DollarSign size={20} /></div>
          <div>
            <h4>Paid Invoices</h4>
            <h2>98</h2>
            <span className="green">&uarr; 12.5% vs yesterday</span>
          </div>
        </div>
        <div className="invoice-card">
          <div className="card-icon orange-bg"><Clock size={20} /></div>
          <div>
            <h4>Pending Invoices</h4>
            <h2>20</h2>
            <span className="green">&uarr; 8.3% vs yesterday</span>
          </div>
        </div>
        <div className="invoice-card">
          <div className="card-icon red-bg"><XCircle size={20} /></div>
          <div>
            <h4>Cancelled Invoices</h4>
            <h2>10</h2>
            <span className="red">&darr; 4.1% vs yesterday</span>
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
            <button className="export-btn"><Download size={16} /> Export</button>
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
                      <button title="View Details" className="icon-action-btn" onClick={() => setSelectedInvoice(invoice)}>
                        <Eye size={16} />
                      </button>
                      
                      {/* Print Command Direct Action Button */}
                      <button title="Print Invoice" className="icon-action-btn" onClick={() => handlePrint(invoice)}>
                        <Printer size={16} />
                      </button>
                      
                      {/* Context Popover Dropdown Action Control */}
                      <div className="inline-dropdown-anchor">
                        <button 
                          title="More Actions" 
                          className={`icon-action-btn ${activeDropdownId === invoice.id ? "active-focus" : ""}`}
                          onClick={() => setActiveDropdownId(activeDropdownId === invoice.id ? null : invoice.id)}
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
                              <button className="text-green" onClick={() => handleUpdateStatus(invoice.id, "Paid")}>
                                <CheckCircle size={14} /> Mark Paid
                              </button>
                            )}
                            {invoice.status !== "Cancelled" && (
                              <button className="text-red" onClick={() => handleUpdateStatus(invoice.id, "Cancelled")}>
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
          <p>Showing {displayStartIndex} to {displayEndIndex} of {totalItems} entries</p>
          <div className="pages">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="arrow-btn">
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
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="arrow-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE INVOICE MODAL VIEW WINDOW OVERLAY */}
      {selectedInvoice && (
        <div className="invoice-modal-backdrop" onClick={() => setSelectedInvoice(null)}>
          <div className="invoice-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Invoice Breakdown Details</h3>
              <button className="close-modal-x" onClick={() => setSelectedInvoice(null)}>
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
                      <td className="txt-right font-bold">Rs. {(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-summary-footer">
              <div className="status-footer-badge">
                Status: <span className={`status ${selectedInvoice.status.toLowerCase()}`}>{selectedInvoice.status}</span>
              </div>
              <div className="grand-total-block">
                <span>Grand Total:</span>
                <h3>{selectedInvoice.amount}</h3>
              </div>
            </div>

            <div className="modal-actions-footer-bar">
              <button className="modal-print-btn" onClick={() => handlePrint(selectedInvoice)}>
                <Printer size={16} /> Send to Printer Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;