import { NavLink } from"react-router-dom";

import"../../styles/sidebar.css";

const Sidebar = ({ links, title }) => {
 return (
 <div className="sidebar">
 <div className="sidebar-top">
 <h2>{title}</h2>
 </div>

 <div className="sidebar-links">
 {links.map((link) => (
 <NavLink
 key={link.path}
 to={link.path}
 className={({ isActive }) =>
 isActive
 ?"sidebar-link active"
 :"sidebar-link"
 }
 >
 <span>{link.icon}</span>

 <span>{link.label}</span>
 </NavLink>
 ))}
 </div>
 </div>
 );
};

export default Sidebar;
