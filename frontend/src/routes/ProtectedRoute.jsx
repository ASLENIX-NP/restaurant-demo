import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  role,
}) => {

  const { user } =
    useAuth();

  // NOT LOGGED IN
  if (!user) {

    return (
      <Navigate to="/" />
    );
  }

  // WRONG ROLE
  if (
    user.role?.toLowerCase() !== role?.toLowerCase()
  ) {

    return (
      <Navigate to="/" />
    );
  }

  return children;
};

export default ProtectedRoute;