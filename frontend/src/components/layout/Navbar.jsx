import { useNavigate } from "react-router-dom";

import "../../styles/navbar.css";

const Navbar = ({ title }) => {

  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="navbar">

      <div className="navbar-left">
        <h2>{title}</h2>
      </div>

      <div className="navbar-right">

        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />

        <div className="profile-circle">
          A
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;