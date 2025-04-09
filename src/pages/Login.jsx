import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (!fullName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nama tidak boleh kosong",
      });
      return;
    }

    localStorage.setItem("fullName", fullName.trim());

    navigate("/typing-test");
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100">
        <div className="col-md-6 offset-md-3">
          <div className="card p-4 shadow-lg">
            <h2 className="text-center mb-3">Masukkan Nama Anda</h2>
            <p className="text-muted text-center">
              Silakan masukkan nama untuk memulai game.
            </p>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Nama</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Masukkan nama Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Mulai
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
