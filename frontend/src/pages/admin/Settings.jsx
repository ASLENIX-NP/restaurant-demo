import "../../styles/settings.css";

const Settings = () => {

  return (

    <div className="settings-page">

      {/* TOP */}

      <div className="settings-top">

        <div>

          <h1>
            Settings
          </h1>

          <p>
            Dashboard {" > "} Settings
          </p>

        </div>

        <button className="save-settings-btn">
          Save Changes
        </button>

      </div>

      {/* SETTINGS GRID */}

      <div className="settings-grid">

        {/* LEFT */}

        <div className="settings-left">

          {/* RESTAURANT */}

          <div className="settings-card">

            <h2>
              Restaurant Information
            </h2>

            <div className="settings-form">

              <div className="form-group">

                <label>
                  Restaurant Name
                </label>

                <input
                  type="text"
                  placeholder="Aslenix Restaurant"
                />

              </div>

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="restaurant@gmail.com"
                />

              </div>

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="+977 9812345678"
                />

              </div>

              <div className="form-group">

                <label>
                  Address
                </label>

                <textarea
                  rows="4"
                  placeholder="Kathmandu, Nepal"
                ></textarea>

              </div>

            </div>

          </div>

          {/* SYSTEM */}

          <div className="settings-card">

            <h2>
              System Preferences
            </h2>

            <div className="settings-options">

              <div className="settings-option">

                <div>

                  <h4>
                    Dark Mode
                  </h4>

                  <p>
                    Enable dark appearance
                  </p>

                </div>

                <label className="switch">

                  <input type="checkbox" />

                  <span className="slider"></span>

                </label>

              </div>

              <div className="settings-option">

                <div>

                  <h4>
                    Notifications
                  </h4>

                  <p>
                    Enable push notifications
                  </p>

                </div>

                <label className="switch">

                  <input type="checkbox" checked />

                  <span className="slider"></span>

                </label>

              </div>

              <div className="settings-option">

                <div>

                  <h4>
                    Auto Backup
                  </h4>

                  <p>
                    Daily database backup
                  </p>

                </div>

                <label className="switch">

                  <input type="checkbox" checked />

                  <span className="slider"></span>

                </label>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="settings-right">

          {/* PROFILE */}

          <div className="settings-card profile-card">

            <div className="profile-top">

              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt=""
              />

              <h3>
                Admin User
              </h3>

              <p>
                Super Administrator
              </p>

            </div>

            <button className="upload-btn">
              Upload Profile
            </button>

          </div>

          {/* SECURITY */}

          <div className="settings-card">

            <h2>
              Security
            </h2>

            <div className="security-list">

              <button>
                🔒 Change Password
              </button>

              <button>
                📱 Two Factor Authentication
              </button>

              <button>
                🛡 Login Activity
              </button>

              <button>
                🚪 Logout All Devices
              </button>

            </div>

          </div>

          {/* BILLING */}

          <div className="settings-card">

            <h2>
              Billing & Subscription
            </h2>

            <div className="billing-info">

              <div className="billing-row">

                <span>
                  Current Plan
                </span>

                <strong>
                  Premium
                </strong>

              </div>

              <div className="billing-row">

                <span>
                  Renewal Date
                </span>

                <strong>
                  June 25, 2026
                </strong>

              </div>

              <div className="billing-row">

                <span>
                  Payment Method
                </span>

                <strong>
                  Visa Card
                </strong>

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