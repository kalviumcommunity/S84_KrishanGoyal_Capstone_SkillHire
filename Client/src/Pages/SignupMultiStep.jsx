import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../Styles/SignupMultiStep.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function SignupMultiStep() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    goSkills: [],
    hourlyRate: "",
    location: { city: "", subCity: "" },
    proSkills: [],
    portfolioUrl: "",
    minProjectRate: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [goSkillInput, setGoSkillInput] = useState("");
  const [proSkillInput, setProSkillInput] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);

    if (name === "city" || name === "subCity") {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddGoSkill = () => {
    if (goSkillInput.trim()) {
      setForm((prev) => ({
        ...prev,
        goSkills: [...prev.goSkills, goSkillInput.trim()],
      }));
      setGoSkillInput("");
    }
  };

  const handleRemoveGoSkill = (idx) => {
    setForm((prev) => ({
      ...prev,
      goSkills: prev.goSkills.filter((_, i) => i !== idx),
    }));
  };

  const handleAddProSkill = () => {
    if (proSkillInput.trim()) {
      setForm((prev) => ({
        ...prev,
        proSkills: [...prev.proSkills, proSkillInput.trim()],
      }));
      setProSkillInput("");
    }
  };

  const handleRemoveProSkill = (idx) => {
    setForm((prev) => ({
      ...prev,
      proSkills: prev.proSkills.filter((_, i) => i !== idx),
    }));
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setError(null);

    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, picture } = decoded;

      const response = await axios.post(
        `${baseUrl}/api/auth/google-auth`,
        {
          token: credentialResponse.credential,
          user: { name, email, picture },
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("authToken", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setError(
        error.response?.data?.error ||
          "Google authentication failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setError("Google login failed. Please try again or use email signup.");
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${baseUrl}/api/auth/signup`,
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        localStorage.setItem("authToken", res.data.token);
        setStep(2);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const payload = {
            role: form.role,
        };

        if (form.role === "go-worker") {
            payload.goSkills = form.goSkills;
            payload.hourlyRate = form.hourlyRate;
            payload.location = form.location;
        } else if (form.role === "pro-worker") {
            payload.proSkills = form.proSkills;
            payload.portfolioUrl = form.portfolioUrl;
            payload.minProjectRate = form.minProjectRate;
        }

        const axiosInstance = axios.create({
            baseURL: baseUrl,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await axiosInstance.post('/api/auth/complete-profile', payload);

        if (res.data.token) {
            localStorage.setItem("authToken", res.data.token);
        }

        switch (form.role) {
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
                alert("Error in checking the role of user");
        }
    } catch (err) {
        setError(
            err.response?.data?.error ||
            "Failed to complete profile. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {" "}
      <div className="signup-bg-art">
        {" "}
        <div className="circle circle1"></div>{" "}
        <div className="circle circle2"></div>{" "}
        <div className="circle circle3"></div>
        <h2 className="signup-heading-outer">Sign Up</h2>
        <div className="signup-container">
          <div className="signup-form-section">
            {error && <div className="error-message">{error}</div>}

            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="signup-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>

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
                    minLength="6"
                    autoComplete="new-password"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    pattern="[0-9]{10,15}"
                    title="Please enter a valid phone number (numbers only)"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the <a href="#">Terms & Conditions</a>
                  </label>
                </div>

                <div className="signup-btn-row">
                  <button
                    type="submit"
                    className="signup-btn-unique"
                    disabled={loading}
                  >
                    {loading ? <span className="button-loader"></span> : "Next"}
                  </button>
                </div>

                <div className="divider">
                  <span>or</span>
                </div>

                <div className="google-login-container">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    useOneTap
                    theme="filled_blue"
                    size="large"
                    text="signup_with"
                    shape="pill"
                    width="300"
                    disabled={googleLoading}
                  />
                  {googleLoading && (
                    <div className="google-loading">Processing...</div>
                  )}
                </div>

                <div className="login-redirect">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="login-link"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="signup-form">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Role --</option>
                    <option value="client">Client</option>
                    <option value="go-worker">Go-Worker</option>
                    <option value="pro-worker">Pro-Worker</option>
                  </select>
                </div>

                {form.role === "go-worker" && (
                  <>
                    <div className="form-group">
                      <label>Go-Worker Skills</label>
                      <div className="skill-input-row">
                        <input
                          type="text"
                          value={goSkillInput}
                          onChange={(e) => setGoSkillInput(e.target.value)}
                          placeholder="Enter a skill"
                        />
                        <button
                          type="button"
                          onClick={handleAddGoSkill}
                          className="add-skill-btn"
                          disabled={!goSkillInput.trim()}
                        >
                          Add
                        </button>
                      </div>
                      {form.goSkills.length > 0 && (
                        <div className="skill-tags">
                          {form.goSkills.map((skill, idx) => (
                            <span key={idx} className="skill-tag">
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveGoSkill(idx)}
                                className="remove-skill-btn"
                                aria-label={`Remove ${skill}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Hourly Rate ($)</label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={form.hourlyRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={form.location.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Sub City</label>
                      <input
                        type="text"
                        name="subCity"
                        value={form.location.subCity}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {form.role === "pro-worker" && (
                  <>
                    <div className="form-group">
                      <label>Pro-Worker Skills</label>
                      <div className="skill-input-row">
                        <input
                          type="text"
                          value={proSkillInput}
                          onChange={(e) => setProSkillInput(e.target.value)}
                          placeholder="Enter a skill"
                        />
                        <button
                          type="button"
                          onClick={handleAddProSkill}
                          className="add-skill-btn"
                          disabled={!proSkillInput.trim()}
                        >
                          Add
                        </button>
                      </div>
                      {form.proSkills.length > 0 && (
                        <div className="skill-tags">
                          {form.proSkills.map((skill, idx) => (
                            <span key={idx} className="skill-tag">
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveProSkill(idx)}
                                className="remove-skill-btn"
                                aria-label={`Remove ${skill}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Portfolio URL</label>
                      <input
                        type="url"
                        name="portfolioUrl"
                        value={form.portfolioUrl}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Minimum Project Rate ($)</label>
                      <input
                        type="number"
                        name="minProjectRate"
                        value={form.minProjectRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="signup-btn-row">
                  <button
                    type="button"
                    className="signup-btn-google"
                    onClick={() => {
                      setStep(1);
                      setError(null);
                    }}
                    disabled={loading}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="signup-btn-unique"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="button-loader"></span>
                    ) : (
                      "Complete Profile"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="signup-design-section">
            <div className="design-overlay">
              <h1>Welcome to SkillHire</h1>
              <p>
                Find the best talent or your next opportunity.
                <br />
                Join a growing community of skilled professionals.
              </p>
              <ul>
                <li>✔️ Fast & Secure Signup</li>
                <li>✔️ Verified Talent</li>
                <li>✔️ Smart Matching</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}