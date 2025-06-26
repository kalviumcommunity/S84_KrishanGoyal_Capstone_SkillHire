import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NavbarDashboards from '../Components/NavbarDashboards';
import '../Styles/PaymentSuccess.css';

const PaymentSuccess = () => {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${baseUrl}/api/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            withCredentials: true,
          }
        );

        setPayment(response.data.payment);
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError(error.response?.data?.error || 'Failed to fetch payment details');
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId, baseUrl]);

  if (loading) {
    return (
      <>
        <NavbarDashboards />
        <div className="payment-success-container">
          <div className="loading-spinner">Loading payment details...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarDashboards />
        <div className="payment-success-container">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <Link to="/client" className="back-link">Back to Dashboard</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarDashboards />
      <div className="payment-success-container">
        <div className="payment-success-card">
          <div className="success-icon">✓</div>
          <h1>Payment Successful!</h1>
          <p className="success-message">
            Your payment of ₹{payment?.amount} has been processed successfully.
          </p>
          
          <div className="payment-details">
            <div className="detail-row">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value">{payment?.razorpayPaymentId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Project:</span>
              <span className="detail-value">{payment?.projectId?.title}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Worker:</span>
              <span className="detail-value">{payment?.worker?.fullName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{new Date(payment?.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <Link to="/client" className="btn-primary">Go to Dashboard</Link>
            <Link to={`/${payment?.projectType.toLowerCase().replace('project', '')}-projects/${payment?.projectId._id}`} className="btn-outline">
              View Project
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;