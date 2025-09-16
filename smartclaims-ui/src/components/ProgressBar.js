import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentStep }) => {
    const steps = ['Client Info', 'Claim Details', 'Review', 'Submit'];
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="progress-bar-container">
            <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                {steps.map((label, index) => (
                    <div
                        key={index}
                        className={`step ${index + 1 < currentStep ? 'completed' : ''} ${index + 1 === currentStep ? 'active' : ''}`}
                    >
                        {index + 1}
                        <span className="step-label">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressBar;
