import { useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import { ThemeContext } from "../contexts/theme.context";

export default function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("fullName");
    navigate("/");
  };

  const isLogin = useMemo(() => {
    return !!localStorage.getItem("fullName");
  }, []);

  const handleChangeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg bg-${theme} sticky-top`}>
      <div className="container-fluid">
        <a
          className={`navbar-brand text-${
            theme === "light" ? "dark" : "light"
          }`}
          href="#"
        >
          <h5>Cow Rush</h5>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="navbar-nav me-auto"></div>

          {/* Tombol toggle theme */}
          <button onClick={handleChangeTheme} className="btn btn-secondary">
            {theme === "light" ? "Switch to Dark" : "Switch to Light"}
          </button>

          {/* Tombol logout (hanya muncul jika user login) */}
          {isLogin && (
            <button
              className="btn btn-outline-danger mx-1"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
