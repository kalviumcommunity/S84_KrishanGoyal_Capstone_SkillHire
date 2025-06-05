import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../Styles/Login.css";
import "../Styles/PageTransitions.css";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
    setError(null);

    try {
      const res = await axios.post(
        `${baseUrl}/api/auth/login`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      if (res.data.token && res.data.user) {
        await login(res.data.user, res.data.token);

        setSuccessMessage("Login successful!");
        setTimeout(() => setSuccessMessage(""), 400);
        const container = document.querySelector('.login-container');
        container.classList.add('success-transition');

        setTimeout(() => {
          switch (res.data.user.role) {
            case "client":
              navigate("/client", { replace: true });
              break;
            case "go-worker":
              navigate("/go", { replace: true });
              break;
            case "pro-worker":
              navigate("/pro", { replace: true });
              break;
            default:
              navigate("/", { replace: true });
          }
        }, 800);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSignup = () => {
    const container = document.querySelector('.login-container');
    container.classList.add('slide-out');
    setTimeout(() => {
      navigate('/signup');
    }, 800);
  };

  return (
    <div className="login-bg-art">
      {successMessage && (
        <div className="custom-success-alert">{successMessage}</div>
      )}
      {error && (
        <div className="custom-error-alert">{error}</div>
      )}

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
              New here?{" "}
              <button
                type="button"
                className="login-link"
                onClick={handleNavigateToSignup}
                style={{
                  background: "none",
                  border: "none",
                  color: "#646cff",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}