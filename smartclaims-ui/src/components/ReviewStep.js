import React, { useState, useEffect } from 'react';
import { getClaimForReview } from '../services/apiService';

const ReviewStep = ({ claimId, onNext, onBack }) => {
    const [reviewData, setReviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviewData = async () => {
            if (!claimId) {
                setError("No claim ID found. Please start over.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const data = await getClaimForReview(claimId);
                setReviewData(data);
            } catch (err) {
                setError('Failed to fetch review data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviewData();
    }, [claimId]);

    if (isLoading) {
        return <p>Loading review details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="form-step-container">
            <h2>Step 3: Review Your Claim</h2>
            {reviewData && (
                <div className="review-details">
                    <h3>Client Information</h3>
                    <p><strong>Full Name:</strong> {reviewData.fullName}</p>
                    <p><strong>Address:</strong> {reviewData.address}</p>
                    <p><strong>Phone:</strong> {reviewData.phoneNumber}</p>
                    <p><strong>Email:</strong> {reviewData.email}</p>
                    <hr />
                    <h3>Claim Information</h3>
                    <p><strong>Date of Incident:</strong> {reviewData.dateOfIncident}</p>
                    <p><strong>Claim Type:</strong> {reviewData.claimType}</p>
                    <p><strong>Claim Amount:</strong> ${reviewData.claimAmount?.toFixed(2)}</p>
                    <p><strong>Description:</strong> {reviewData.description}</p>
                </div>
            )}
            <div className="form-actions">
                <button type="button" onClick={onBack} className="prev-btn">Previous</button>
                <button type="button" onClick={onNext}>Next</button>
            </div>
        </div>
    );
};

export default ReviewStep;
