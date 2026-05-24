import "../../styles/cashier.css";

const Payments = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Payments</h1>

        <p>
          Process customer payments
        </p>
      </div>

      <div className="payment-grid">
        {/* BILL */}
        <div className="bill-card">
          <h2>Current Bill</h2>

          <div className="bill-items">
            <div className="bill-item">
              <span>Burger x2</span>

              <span>Rs. 900</span>
            </div>

            <div className="bill-item">
              <span>Pizza</span>

              <span>Rs. 850</span>
            </div>

            <div className="bill-item">
              <span>Coke</span>

              <span>Rs. 250</span>
            </div>
          </div>

          <div className="bill-total">
            <h3>Total</h3>

            <h2>Rs. 2,000</h2>
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="payment-methods">
          <h2>Payment Methods</h2>

          <button className="payment-btn cash">
            💵 Cash
          </button>

          <button className="payment-btn card">
            💳 Card
          </button>

          <button className="payment-btn esewa">
            📱 eSewa
          </button>

          <button className="payment-btn khalti">
            🟣 Khalti
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;