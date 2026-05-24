import "../../styles/navbar.css";

const Navbar = ({ title }) => {
  return (
    <div className="navbar">
      <div>
        <h2>{title}</h2>
      </div>

      <div className="navbar-right">
        <input
          type="text"
          placeholder="Search..."
        />

        <div className="profile-circle">
          A
        </div>
      </div>
    </div>
  );
};

export default Navbar;