import {
 Navigate,
} from"react-router-dom";

import {
 useAuth,
} from"../context/AuthContext";

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

 // Map actual user role to canonical route role
 let userRouteRole = user.role?.toLowerCase() ||"staff";
 if (userRouteRole ==="manager" || userRouteRole ==="admin") userRouteRole ="admin";
 else if (userRouteRole ==="waiter" || userRouteRole ==="staff") userRouteRole ="staff";
 else if (userRouteRole ==="chef") userRouteRole ="chef";
 else if (userRouteRole ==="cashier") userRouteRole ="cashier";

 // WRONG ROLE
 if (userRouteRole !=="admin" && userRouteRole !== role?.toLowerCase()) {
 return <Navigate to="/" />;
 }

 return children;
};

export default ProtectedRoute;
