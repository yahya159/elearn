import React, { useState } from 'react';
import './AuthForms.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    // TODO: Implement forgot password logic
    setLoading(false);
  };

  return (
    <div className="auth-form-container">
      <h2>Mot de passe oublié</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm; 