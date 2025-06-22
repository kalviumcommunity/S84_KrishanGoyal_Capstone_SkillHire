import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../Styles/SignupMultiStep.css";
import "../Styles/PageTransitions.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function SignupMultiStep() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    goSkills: [],
    location: { city: "", subCity: "" },
    proSkills: [],
    portfolioUrl: "",
  });

  // Predefined skills for GO workers
  const predefinedGoSkills = [
    "Cleaning",
    "Delivery",
    "Moving",
    "Repairs",
    "Installation",
    "Gardening",
    "Painting",
    "Plumbing",
    "Electrical Work",
  ];

  // Predefined skills for PRO workers
  const predefinedProSkills = [
    "Web Development",
    "Mobile App Development",
    "Graphic Design",
    "UI/UX Design",
    "Content Writing",
    "Digital Marketing",
    "Video Editing",
    "Photography",
  ];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [goSkillInput, setGoSkillInput] = useState("");
  const [proSkillInput, setProSkillInput] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedProSkill, setSelectedProSkill] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^(\+?\d{10,15})$/.test(phone);

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

  // Handle adding a skill from dropdown
  const handleAddSkillFromDropdown = (skillType) => {
    if (skillType === "go") {
      if (selectedSkill && !form.goSkills.includes(selectedSkill)) {
        setForm((prev) => ({
          ...prev,
          goSkills: [...prev.goSkills, selectedSkill],
        }));
        setSelectedSkill("");
      }
    } else {
      if (selectedProSkill && !form.proSkills.includes(selectedProSkill)) {
        setForm((prev) => ({
          ...prev,
          proSkills: [...prev.proSkills, selectedProSkill],
        }));
        setSelectedProSkill("");
      }
    }
  };

  const handleAddGoSkill = () => {
    if (goSkillInput.trim() && !form.goSkills.includes(goSkillInput.trim())) {
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
    if (
      proSkillInput.trim() &&
      !form.proSkills.includes(proSkillInput.trim())
    ) {
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

  // GOOGLE SIGNUP HANDLER
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/google`,
        { token: credentialResponse.credential },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data?.success) {
        await login(response.data.user, response.data.token);

        // If user has no role, go to step 2 (profile completion)
        if (!response.data.user.role || !response.data.user.isProfileComplete) {
          setStep(2);
        } else {
          // Otherwise, redirect to dashboard
          navigate(`/${response.data.user.role}`, { replace: true });
        }
      } else {
        throw new Error(response.data?.error || "Authentication failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.message ||
          "Google authentication failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setError("Google login failed. Please try again or use email signup.");
  };

  // EMAIL SIGNUP HANDLER
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (form.phone && !isValidPhone(form.phone)) {
      setError(
        "Please enter a valid phone number (10-15 digits, numbers only)."
      );
      setLoading(false);
      return;
    }

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

      if (res.data.token && res.data.user) {
        await login(res.data.user, res.data.token);
        setSuccessMessage("Account created successfully!");
        setTimeout(() => setSuccessMessage(""), 400);
        setTimeout(() => setStep(2), 1000); // Go to next step
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // PROFILE COMPLETION HANDLER
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const payload = { role: form.role };
      if (form.role === "go-worker") {
        payload.goSkills = form.goSkills;
        payload.location = form.location;
      } else if (form.role === "pro-worker") {
        payload.proSkills = form.proSkills;
        payload.portfolioUrl = form.portfolioUrl;
      }

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await axiosInstance.post(
        "/api/auth/complete-profile",
        payload
      );

      if (res.data.token && res.data.user) {
        await login(res.data.user, res.data.token);
        setSuccessMessage("Profile completed successfully!");
        setTimeout(() => setSuccessMessage(""), 400);

        setTimeout(() => {
          switch (form.role) {
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
              alert("Error in checking the role of user");
          }
        }, 600);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to complete profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    const container = document.querySelector(".signup-container");
    if (container) container.classList.add("slide-out");
    setTimeout(() => {
      navigate("/login");
    }, 600);
  };

  return (
    <div className="signup-bg-art">
      {successMessage && (
        <div className="custom-success-alert">{successMessage}</div>
      )}
      {error && <div className="custom-error-alert">{error}</div>}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
      <h2 className="signup-heading-outer">Sign Up</h2>
      <div className="signup-container">
        <div className="signup-form-section">
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
                  pattern="^\+?\d{10,15}$"
                  title="Please enter a valid phone number (10-15 digits, numbers only)"
                  required
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
                  text="continue_with"
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
                  onClick={handleNavigateToLogin}
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

                    {/* Dropdown for predefined skills */}
                    <div className="skill-input-row">
                      <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="skill-dropdown"
                      >
                        <option value="">-- Select a skill --</option>
                        {predefinedGoSkills.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddSkillFromDropdown("go")}
                        className="add-skill-btn"
                        disabled={!selectedSkill}
                      >
                        Add
                      </button>
                    </div>

                    {/* Custom skill input */}
                    <label className="custom-skill-label">
                      Or add a custom skill:
                    </label>
                    <div className="skill-input-row">
                      <input
                        type="text"
                        value={goSkillInput}
                        onChange={(e) => setGoSkillInput(e.target.value)}
                        placeholder="Enter a custom skill"
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

                    {/* Display selected skills */}
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

                    {/* Dropdown for predefined PRO skills */}
                    <div className="skill-input-row">
                      <select
                        value={selectedProSkill}
                        onChange={(e) => setSelectedProSkill(e.target.value)}
                        className="skill-dropdown"
                      >
                        <option value="">-- Select a skill --</option>
                        {predefinedProSkills.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddSkillFromDropdown("pro")}
                        className="add-skill-btn"
                        disabled={!selectedProSkill}
                      >
                        Add
                      </button>
                    </div>

                    {/* Custom skill input */}
                    <label className="custom-skill-label">
                      Or add a custom skill:
                    </label>
                    <div className="skill-input-row">
                      <input
                        type="text"
                        value={proSkillInput}
                        onChange={(e) => setProSkillInput(e.target.value)}
                        placeholder="Enter a custom skill"
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

                    {/* Display selected skills */}
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
  );
}
