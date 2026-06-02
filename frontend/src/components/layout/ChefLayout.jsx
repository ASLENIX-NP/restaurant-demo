import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const ChefLayout = () => {
  return (
    <div className="dashboard-layout chef-layout-full">
      <div className="main-content">
        <Navbar title="Kitchen Panel" />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChefLayout;
