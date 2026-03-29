import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import AdminPanel from "./pages/AdminPanel";
import Cart from "./pages/Cart";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'


const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.email === "admin@gmail.com";

  if (isAdmin) {
    return <Navigate to="/admin-panel" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.email === "admin@gmail.com";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRoute><Shop /></UserRoute>} />
        <Route path="/product/:id" element={<UserRoute><ProductDetails /></UserRoute>} />
        <Route 
          path="/admin-panel" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
        <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
        <Route path="/order-details" element={<UserRoute><OrderDetails /></UserRoute>} />
        <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
