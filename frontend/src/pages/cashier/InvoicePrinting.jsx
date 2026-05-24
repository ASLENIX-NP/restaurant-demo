import "../../styles/cashier.css";

const InvoicePrinting = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Invoice Printing</h1>

        <p>
          Generate and print invoices
        </p>
      </div>

      <div className="invoice-card">
        <h2>Restaurant Invoice</h2>

        <div className="invoice-info">
          <p>Invoice ID: #1004</p>

          <p>Table: 4</p>

          <p>Date: 2026-05-25</p>
        </div>

        <div className="invoice-items">
          <div className="invoice-item">
            <span>Burger x2</span>

            <span>Rs. 900</span>
          </div>

          <div className="invoice-item">
            <span>Pizza</span>

            <span>Rs. 850</span>
          </div>
        </div>

        <div className="invoice-total">
          <h3>Total</h3>

          <h2>Rs. 1,750</h2>
        </div>

        <button className="print-btn">
          🖨️ Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePrinting;