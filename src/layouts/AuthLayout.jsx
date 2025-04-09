import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function AuthLayout() {
  const fullName = localStorage.getItem("fullName");

  if (fullName) {
    return (
      <div>
        <Navbar />
        <Outlet />
      </div>
    );
  }

  return <Navigate to="/login" />;
}
