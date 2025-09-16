import React, { useState } from 'react';
import { saveClientInfo } from '../services/apiService';

const ClientInfoStep = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phoneNumber: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const result = await saveClientInfo(formData);
            if (result && result.claimId) {
                onSuccess(formData, result.claimId);
            } else {
                throw new Error("Response did not contain a claimId.");
            }
        } catch (err) {
            setError('Failed to save client information. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-step-container">
            <h2>Step 1: Client Information</h2>
            <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Next'}
                </button>
            </div>
        </form>
    );
};

export default ClientInfoStep;
