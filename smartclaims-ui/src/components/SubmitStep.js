import React, { useState } from 'react';
import { submitClaim } from '../services/apiService';

const SubmitStep = ({ claimId, onSubmitSuccess, onBack }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            await submitClaim(claimId);
            onSubmitSuccess();
        } catch (err) {
            setError('Failed to submit claim. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-step-container">
            <h2>Step 4: Submit Claim</h2>
            <p>You have reviewed your claim details. Click the button below to finalize and submit your claim.</p>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
                <button type="button" onClick={onBack} className="prev-btn">Previous</button>
                <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                </button>
            </div>
        </div>
    );
};

export default SubmitStep;
