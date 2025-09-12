document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.progress-bar .step');
    const progressBarFill = document.getElementById('progressBarFill');

    const nextBtn1 = document.getElementById('next-step-1');
    const nextBtn2 = document.getElementById('next-step-2');
    const nextBtn3 = document.getElementById('next-step-3');

    const prevBtn2 = document.getElementById('prev-step-2');
    const prevBtn3 = document.getElementById('prev-step-3');
    const prevBtn4 = document.getElementById('prev-step-4');

    const submitBtn = document.getElementById('submit-claim');

    let currentStep = 1;
    let claimId = null; // To store the claim ID after step 1

    const updateProgress = () => {
        stepIndicators.forEach((indicator, index) => {
            if (index < currentStep - 1) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else if (index === currentStep - 1) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
        const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
        progressBarFill.style.width = `${progressPercentage}%`;
    };

    const showStep = (stepNumber) => {
        steps.forEach(step => step.style.display = 'none');
        document.getElementById(`step-${stepNumber}`).style.display = 'block';
        currentStep = stepNumber;
        updateProgress();
    };

    const getAuthToken = () => {
        return localStorage.getItem('jwt');
    };

    const validateForm = (formId) => {
        const form = document.getElementById(formId);
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        return true;
    };

    // Step 1 -> Step 2
    nextBtn1.addEventListener('click', async () => {
        if (!validateForm('client-info-form')) return;

        const formData = new FormData(document.getElementById('client-info-form'));
        const clientData = Object.fromEntries(formData.entries());

        try {
            const token = getAuthToken();
            if (!token) {
                alert('You must be logged in to proceed.');
                window.location.href = '/login.html';
                return;
            }

            nextBtn1.disabled = true;
            nextBtn1.textContent = 'Saving...';

            const response = await fetch('/api/v1/processing/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(clientData)
            });

            if (!response.ok) {
                throw new Error('Failed to save client information.');
            }

            const result = await response.json();
            claimId = result.claimId;
            console.log('Claim created with ID:', claimId);
            showStep(2);

        } catch (error) {
            console.error('Error in step 1:', error);
            alert('An error occurred. Please try again.');
        } finally {
            nextBtn1.disabled = false;
            nextBtn1.textContent = 'Next';
        }
    });

    // Step 2 -> Step 3
    nextBtn2.addEventListener('click', async () => {
        if (!validateForm('claim-details-form')) return;

        const formData = new FormData(document.getElementById('claim-details-form'));
        const claimData = Object.fromEntries(formData.entries());

        try {
            const token = getAuthToken();
            nextBtn2.disabled = true;
            nextBtn2.textContent = 'Saving...';

            const response = await fetch(`/api/v1/processing/claim/${claimId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(claimData)
            });

            if (!response.ok) {
                throw new Error('Failed to save claim details.');
            }

            await populateReviewDetails();
            showStep(3);

        } catch (error) {
            console.error('Error in step 2:', error);
            alert('An error occurred. Please try again.');
        } finally {
            nextBtn2.disabled = false;
            nextBtn2.textContent = 'Next';
        }
    });

    // Step 3 -> Step 4
    nextBtn3.addEventListener('click', () => {
        showStep(4);
    });

    // Final Submission
    submitBtn.addEventListener('click', async () => {
        try {
            const token = getAuthToken();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const response = await fetch(`/api/v1/processing/submit/${claimId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to submit claim.');
            }

            const result = await response.json();
            document.getElementById('claim-processing-steps').style.display = 'none';
            document.querySelector('.progress-bar-container').style.display = 'none';
            document.getElementById('submission-success').style.display = 'block';
            document.getElementById('final-claim-id').textContent = claimId;
            console.log('Submission successful:', result.message);

        } catch (error) {
            console.error('Error in submission:', error);
            alert('An error occurred during submission. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Claim';
        }
    });

    const populateReviewDetails = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`/api/v1/processing/claim/${claimId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch review details.');

            const data = await response.json();
            const reviewContainer = document.getElementById('review-details');
            reviewContainer.innerHTML = `
                <h3>Client Information</h3>
                <p><strong>Full Name:</strong> ${data.fullName || ''}</p>
                <p><strong>Address:</strong> ${data.address || ''}</p>
                <p><strong>Phone:</strong> ${data.phoneNumber || ''}</p>
                <p><strong>Email:</strong> ${data.email || ''}</p>
                <hr>
                <h3>Claim Information</h3>
                <p><strong>Date of Incident:</strong> ${data.dateOfIncident || ''}</p>
                <p><strong>Claim Type:</strong> ${data.claimType || ''}</p>
                <p><strong>Claim Amount:</strong> $${data.claimAmount ? data.claimAmount.toFixed(2) : '0.00'}</p>
                <p><strong>Description:</strong> ${data.description || ''}</p>
                <hr>
                <p><strong>Status:</strong> ${data.status || ''}</p>
            `;
        } catch (error) {
            console.error("Failed to populate review details", error);
            document.getElementById('review-details').innerHTML = '<p class="error">Could not load review details. Please go back and try again.</p>';
        }
    };

    // Previous button listeners
    prevBtn2.addEventListener('click', () => showStep(1));
    prevBtn3.addEventListener('click', () => showStep(2));
    prevBtn4.addEventListener('click', () => showStep(3));

    // Initial setup
    showStep(1);
});
