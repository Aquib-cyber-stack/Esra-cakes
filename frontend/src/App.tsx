import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import CakeDetails from "./pages/CakeDetails";
import Order from "./pages/Order";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminCakes from "./pages/admin/AdminCakes";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminMessages from "./pages/admin/AdminMessages";

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#FFFDF9",
            color: "#2E1C16",
            border: "1px solid rgba(122,31,61,0.1)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#7A1F3D", secondary: "#FFFDF9" } },
        }}
      />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<CakeDetails />} />
          <Route path="/order" element={<Order />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            <Route path="/admin/cakes" element={<AdminCakes />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
