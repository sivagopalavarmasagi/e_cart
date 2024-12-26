import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellerRoute from "./routes/SellerRoutes";
import ConsumerRoutes from "./routes/ConsumerRoutes";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/seller/*" exact element={<SellerRoute />} />
          <Route path="/*" element={<ConsumerRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
