import { Routes, Route } from "react-router-dom";
import SellerDashboard from "../pages/SellerDashboard";
import AddProduct from "../pages/AddProduct";
import OrdersReceived from "../pages/OrdersReceived";
import SellerNavbar from "../pages/SellerNavbar";

const SellerRoute = () => {
  const token = localStorage.getItem("token");

  return (
    <>
      <SellerNavbar />
      <Routes>
        <Route path="/" element={<SellerDashboard />} />
        <Route path="/add-product" element={<AddProduct token={token} />} />
        <Route path="/orders" element={<OrdersReceived />} />
      </Routes>
    </>
  );
};

export default SellerRoute;
