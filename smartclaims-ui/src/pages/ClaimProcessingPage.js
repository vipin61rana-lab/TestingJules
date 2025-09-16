import React, { useState } from 'react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import ClientInfoStep from '../components/ClientInfoStep';
import ClaimDetailsStep from '../components/ClaimDetailsStep';
import ReviewStep from '../components/ReviewStep';
import SubmitStep from '../components/SubmitStep';
import './ClaimProcessingPage.css';

const ClaimProcessingPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [claimId, setClaimId] = useState(null);
    const [formData, setFormData] = useState({
        // This will hold data across all steps
        clientInfo: {},
        claimDetails: {}
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleClientInfoSuccess = (data, newClaimId) => {
        setFormData(prev => ({ ...prev, clientInfo: data }));
        setClaimId(newClaimId);
        nextStep();
    };

    const handleClaimDetailsSuccess = (data) => {
        setFormData(prev => ({ ...prev, claimDetails: data }));
        nextStep();
    };

    const handleSubmissionSuccess = () => {
        nextStep(); // Move to a final "success" view
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <ClientInfoStep onSuccess={handleClientInfoSuccess} />;
            case 2:
                return <ClaimDetailsStep claimId={claimId} onSuccess={handleClaimDetailsSuccess} onBack={prevStep} />;
            case 3:
                return <ReviewStep claimId={claimId} onNext={nextStep} onBack={prevStep} />;
            case 4:
                return <SubmitStep claimId={claimId} onSubmitSuccess={handleSubmissionSuccess} onBack={prevStep} />;
            case 5:
                return (
                    <div className="submission-success">
                        <h2>Claim Submitted Successfully!</h2>
                        <p>Your claim ID is: <strong>{claimId}</strong></p>
                        <p>Thank you for using SmartClaims360.</p>
                    </div>
                );
            default:
                return <ClientInfoStep onSuccess={handleClientInfoSuccess} />;
        }
    };

    return (
        <div>
            <Header />
            <main className="processing-container">
                <h1>Claim Processing</h1>
                {currentStep <= 4 && <ProgressBar currentStep={currentStep} />}
                <div className="step-content">
                    {renderStep()}
                </div>
            </main>
        </div>
    );
};

export default ClaimProcessingPage;
