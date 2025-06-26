import React, { useState } from 'react';
import '../Styles/PaymentNegotiationModal.css';

const PaymentNegotiationModal = ({ open, onClose, onSubmit, initialAmount, isClient }) => {
  const [amount, setAmount] = useState(initialAmount || '');
  const [notes, setNotes] = useState('');
  
  if (!open) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amount: parseFloat(amount), notes });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h3>{isClient ? 'Set Final Payment Amount' : 'Propose Payment Amount'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input 
              type="number" 
              id="amount"
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={`Explain why you're ${isClient ? 'setting' : 'proposing'} this amount...`}
              rows={3}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {isClient ? 'Set Final Amount' : 'Propose Amount'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentNegotiationModal;