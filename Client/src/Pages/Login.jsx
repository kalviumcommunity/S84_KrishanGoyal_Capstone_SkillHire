import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.width = "";
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        switch (data.user?.role) {
          case "client":
            navigate("/client");
            break;
          case "go-worker":
            navigate("/go");
            break;
          case "pro-worker":
            navigate("/pro");
            break;
          default:
            alert('Error in checking for role')
        }
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg-art">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <h2 className="login-heading-outer">Log In</h2>

      <div className="login-container">
        <div className="login-design-section">
          <div className="design-overlay">
            <h1>Welcome Back!</h1>
            <p>
              Continue exploring opportunities and connect with top talent.
              <br />
              Log in to your SkillHire account.
            </p>
            <ul>
              <li>✔️ Secure & Fast Access</li>
              <li>✔️ Personalized Dashboard</li>
              <li>✔️ Skill Tracking</li>
            </ul>
          </div>
        </div>

        <div className="login-form-section">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="login-btn-row">
              <button
                type="submit"
                className="login-btn-unique"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Log In"}
              </button>

              <button type="button" className="login-btn-google">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/180px-Google_%22G%22_logo.svg.png"
                  alt="Google"
                />
                Google
              </button>
            </div>

            <div className="signup-link adjusted-login-link">
              New here? <a href="/signup">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
