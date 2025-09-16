import React, { useState } from 'react';
import { saveClaimDetails } from '../services/apiService';

const ClaimDetailsStep = ({ claimId, onSuccess, onBack }) => {
    const [formData, setFormData] = useState({
        dateOfIncident: '',
        claimType: '',
        claimAmount: '',
        description: ''
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
            await saveClaimDetails(claimId, formData);
            onSuccess(formData);
        } catch (err) {
            setError('Failed to save claim details. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-step-container">
            <h2>Step 2: Claim Details</h2>
            <div className="form-group">
                <label>Date of Incident</label>
                <input type="date" name="dateOfIncident" value={formData.dateOfIncident} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Claim Type</label>
                <input type="text" name="claimType" value={formData.claimType} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Claim Amount</label>
                <input type="number" name="claimAmount" value={formData.claimAmount} onChange={handleChange} required min="0.01" step="0.01" />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required></textarea>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
                <button type="button" onClick={onBack} className="prev-btn">Previous</button>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Next'}
                </button>
            </div>
        </form>
    );
};

export default ClaimDetailsStep;
