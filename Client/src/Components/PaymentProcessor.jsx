import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/PaymentProcessor.css';

const PaymentProcessor = ({ projectId, projectType, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPaymentOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `${baseUrl}/api/payments/${projectType}/${projectId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            withCredentials: true,
          }
        );

        setOrderData(response.data);
        
        // Only initialize Razorpay if we got valid data
        if (response.data && response.data.order && response.data.key) {
          initializeRazorpay(response.data);
        } else {
          setError('Invalid payment data received from server');
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to create payment order');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentOrder();
  }, [projectId, projectType, baseUrl]);

  const initializeRazorpay = (data) => {
    if (!data || !data.order || !data.key) {
      return;
    }

    // Store payment ID in a safer place
    const paymentId = data.payment?.id;
    if (!paymentId) {
      setError('Payment initialization failed: Missing payment ID');
      return;
    }

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "SkillHire",
      description: `Payment for ${data.project?.title || 'Project'}`,
      order_id: data.order.id,
      prefill: {
        name: data.client?.name || '',
        email: data.client?.email || '',
      },
      handler: function (response) {
        // Pass the stored paymentId instead of relying on orderData
        handlePaymentSuccess(response, paymentId);
      },
      modal: {
        ondismiss: function() {
          onClose();
        }
      },
      theme: {
        color: "#0366d6",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const handlePaymentSuccess = async (response, paymentId) => {
    try {
      setLoading(true);
      
      if (!paymentId) {
        setError('Payment verification failed: Missing payment ID');
        return;
      }
      
      
      // Verify the payment on the server
      const verifyResponse = await axios.post(
        `${baseUrl}/api/payments/verify`,
        {
          paymentId: paymentId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      
      
      if (verifyResponse.data.success) {
        if (onSuccess) {
          onSuccess(verifyResponse.data);
        } else {
          navigate(`/payment-success/${paymentId}`);
        }
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setError(error.response?.data?.error || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orderData) {
    return <div className="payment-processor-loading">Setting up payment...</div>;
  }

  if (error) {
    return (
      <div className="payment-processor-error">
        <h3>Payment Error</h3>
        <p>{error}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div className="payment-processor-container">
      <div className="payment-processor-content">
        <h3>Processing Payment</h3>
        <p>Please complete the payment in the Razorpay window.</p>
        <p>Amount: ₹{orderData?.payment?.amount}</p>
        <button onClick={onClose} className="cancel-payment-btn">Cancel Payment</button>
      </div>
    </div>
  );
};

export default PaymentProcessor;