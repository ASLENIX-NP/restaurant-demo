import "../../styles/settings.css";

const Settings = () => {
  return (
    <div className="settings-page">

      {/* TOP */}

      <div className="settings-top">

        <div>
          <h1>Settings</h1>
          <p>Dashboard {" > "} Settings</p>
        </div>

        <button className="save-settings-btn">
          Save Changes
        </button>

      </div>

      <div className="settings-grid">

        {/* LEFT SECTION */}

        <div className="settings-left">

          {/* RESTAURANT INFO */}

          <div className="settings-card">

            <h2>Restaurant Information</h2>

            <div className="settings-form">

              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  defaultValue="Aslenix Restaurant"
                />
              </div>

              <div className="form-group">
                <label>Branch Name</label>
                <input
                  type="text"
                  defaultValue="Main Branch"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  defaultValue="restaurant@gmail.com"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  defaultValue="+977 9812345678"
                />
              </div>

              <div className="form-group">
                <label>PAN / VAT Number</label>
                <input
                  type="text"
                  defaultValue="123456789"
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="text"
                  defaultValue="www.aslenix.com"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  rows="4"
                  defaultValue="Kathmandu, Nepal"
                />
              </div>

            </div>

          </div>

          {/* TAX SETTINGS */}

          <div className="settings-card">

            <h2>Tax Settings</h2>

            <div className="settings-form">

              <div className="form-group">
                <label>VAT (%)</label>
                <input
                  type="number"
                  defaultValue="13"
                />
              </div>

              <div className="form-group">
                <label>Service Charge (%)</label>
                <input
                  type="number"
                  defaultValue="10"
                />
              </div>

              <div className="form-group">
                <label>Default Discount (%)</label>
                <input
                  type="number"
                  defaultValue="0"
                />
              </div>

            </div>

          </div>

          {/* PRINTER SETTINGS */}

          <div className="settings-card">

            <h2>Printer Settings</h2>

            <div className="settings-form">

              <div className="form-group">
                <label>Kitchen Printer</label>
                <input
                  type="text"
                  defaultValue="Kitchen Printer"
                />
              </div>

              <div className="form-group">
                <label>Billing Printer</label>
                <input
                  type="text"
                  defaultValue="POS Printer"
                />
              </div>

              <div className="form-group">
                <label>Paper Size</label>

                <select>
                  <option>80mm</option>
                  <option>58mm</option>
                </select>
              </div>

            </div>

          </div>

          {/* PAYMENT METHODS */}

          <div className="settings-card">

            <h2>Payment Methods</h2>

            <div className="settings-options">

              <div className="settings-option">
                <h4>Cash</h4>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="settings-option">
                <h4>Card</h4>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="settings-option">
                <h4>eSewa</h4>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="settings-option">
                <h4>Khalti</h4>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="settings-option">
                <h4>FonePay</h4>
                <input type="checkbox" />
              </div>

              <div className="settings-option">
                <h4>QR Payment</h4>
                <input type="checkbox" defaultChecked />
              </div>

            </div>

          </div>

          {/* SYSTEM PREFERENCES */}

          <div className="settings-card">

            <h2>System Preferences</h2>

            <div className="settings-options">

              <div className="settings-option">
                <div>
                  <h4>Dark Mode</h4>
                  <p>Enable dark appearance</p>
                </div>

                <input type="checkbox" />
              </div>

              <div className="settings-option">
                <div>
                  <h4>Notifications</h4>
                  <p>Enable notifications</p>
                </div>

                <input type="checkbox" defaultChecked />
              </div>

              <div className="settings-option">
                <div>
                  <h4>Auto Backup</h4>
                  <p>Daily database backup</p>
                </div>

                <input type="checkbox" defaultChecked />
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="settings-right">

          {/* PROFILE */}

          <div className="settings-card profile-card">

            <div className="profile-top">

              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt=""
              />

              <h3>Admin User</h3>

              <p>Super Administrator</p>

            </div>

            <button className="upload-btn">
              Upload Profile
            </button>

          </div>

          {/* ROLE MANAGEMENT */}

          <div className="settings-card">

            <h2>Role Management</h2>

            <div className="security-list">

              <button>👑 Admin</button>
              <button>📋 Manager</button>
              <button>💰 Cashier</button>
              <button>👨‍🍳 Chef</button>
              <button>🍽️ Waiter / Staff</button>

            </div>

          </div>

          {/* SECURITY */}

          <div className="settings-card">

            <h2>Security</h2>

            <div className="security-list">

              <button>🔒 Change Password</button>
              <button>📱 Two Factor Authentication</button>
              <button>🛡 Login Activity</button>
              <button>🚪 Logout All Devices</button>

            </div>

          </div>

          {/* BACKUP */}

          <div className="settings-card">

            <h2>Backup & Restore</h2>

            <div className="security-list">

              <button>💾 Backup Database</button>
              <button>📤 Export Data</button>
              <button>📥 Import Data</button>
              <button>♻ Restore Backup</button>

            </div>

          </div>

          {/* BILLING */}

          <div className="settings-card">

            <h2>Billing & Subscription</h2>

            <div className="billing-info">

              <div className="billing-row">
                <span>Current Plan</span>
                <strong>Premium</strong>
              </div>

              <div className="billing-row">
                <span>Renewal Date</span>
                <strong>June 25, 2026</strong>
              </div>

              <div className="billing-row">
                <span>Payment Method</span>
                <strong>Visa Card</strong>
              </div>

            </div>

            <button className="upgrade-btn">
              Upgrade Plan
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;