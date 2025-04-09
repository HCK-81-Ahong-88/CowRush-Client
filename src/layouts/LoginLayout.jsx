import { Outlet, Navigate } from "react-router";

export default function LoginLayout() {
  const fullName = localStorage.getItem("fullName");

  if (fullName) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
