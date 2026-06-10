import { Outlet } from "react-router-dom";

const ChefLayout = () => {
  return (
    <div className="dashboard-layout chef-layout-full">
      <div className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChefLayout;
