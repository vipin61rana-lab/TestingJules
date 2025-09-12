document.addEventListener('DOMContentLoaded', function () {
    const claimsTableBody = document.querySelector('#claims-table tbody');
    const createClaimForm = document.getElementById('create-claim-form');
    const searchInput = document.getElementById('search-input');
    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.getElementById('admin-link');
    const processingLink = document.getElementById('processing-link');
    let allClaims = []; // Store all claims to filter from

    const token = localStorage.getItem('jwt');
    if (!token) {
        window.location.href = '/login.html';
        return;
    } else {
        // If token exists, user is logged in, so show the processing link
        processingLink.style.display = 'inline-block';
    }

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.roles && decodedToken.roles.includes('ROLE_ADMIN')) {
        adminLink.style.display = 'inline-block';
    }

    const fetchClaims = async () => {
        try {
            const response = await fetch('/api/v1/claims', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 401 || response.status === 403) {
                window.location.href = '/login.html';
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allClaims = await response.json();
            renderClaims(allClaims);
        } catch (error) {
            console.error('Error fetching claims:', error);
        }
    };

    const renderClaims = (claims) => {
        claimsTableBody.innerHTML = '';
        if (claims.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 8;
            cell.textContent = 'No claims found.';
            row.appendChild(cell);
            claimsTableBody.appendChild(row);
        } else {
            claims.forEach(claim => {
                const row = document.createElement('tr');
                row.dataset.id = claim.id;
                row.innerHTML = `
                    <td><input type="checkbox" class="claim-checkbox" data-id="${claim.id}"></td>
                    <td><span class="view-span">${claim.id}</span></td>
                    <td>
                        <span class="view-span">${claim.claimantName}</span>
                        <input type="text" class="edit-input" value="${claim.claimantName}" data-field="claimantName">
                    </td>
                    <td>
                        <span class="view-span">${claim.claimAmount.toFixed(2)}</span>
                        <input type="number" class="edit-input" value="${claim.claimAmount.toFixed(2)}" data-field="claimAmount">
                    </td>
                    <td>
                        <span class="view-span">${claim.claimType}</span>
                        <input type="text" class="edit-input" value="${claim.claimType}" data-field="claimType">
                    </td>
                    <td><span class="view-span">${claim.status}</span></td>
                    <td><span class="view-span">${new Date(claim.createdAt).toLocaleString()}</span></td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="save-btn" style="display:none;">Save</button>
                        <button class="cancel-btn" style="display:none;">Cancel</button>
                    </td>
                `;
                claimsTableBody.appendChild(row);
            });
        }
    };

    const filterClaims = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredClaims = allClaims.filter(claim =>
            Object.values(claim).some(value =>
                value.toString().toLowerCase().includes(searchTerm)
            )
        );
        renderClaims(filteredClaims);
    };

    const deleteSelectedClaims = async () => {
        const selectedCheckboxes = document.querySelectorAll('.claim-checkbox:checked');
        const claimIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);

        if (claimIds.length === 0) {
            alert('Please select at least one claim to delete.');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${claimIds.length} claim(s)?`)) {
            return;
        }

        try {
            const response = await fetch('/api/v1/claims', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(claimIds),
            });

            if (response.ok) {
                fetchClaims();
            } else {
                alert('Error deleting claims.');
            }
        } catch (error) {
            console.error('Error deleting claims:', error);
            alert('An unexpected error occurred while deleting claims.');
        }
    };

    const toggleSelectAll = (event) => {
        const checkboxes = document.querySelectorAll('.claim-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
    };

    const handleTableRowClick = (event) => {
        const target = event.target;
        const row = target.closest('tr');
        if (!row) return;

        if (target.classList.contains('edit-btn')) {
            row.classList.add('edit-mode');
            target.style.display = 'none';
            row.querySelector('.save-btn').style.display = 'inline-block';
            row.querySelector('.cancel-btn').style.display = 'inline-block';
        } else if (target.classList.contains('cancel-btn')) {
            row.classList.remove('edit-mode');
            target.style.display = 'none';
            row.querySelector('.save-btn').style.display = 'none';
            row.querySelector('.edit-btn').style.display = 'inline-block';
            // Reset input values to original
            row.querySelectorAll('.edit-input').forEach(input => {
                const fieldName = input.dataset.field;
                const originalValue = allClaims.find(c => c.id === row.dataset.id)[fieldName];
                input.value = originalValue;
            });
        } else if (target.classList.contains('save-btn')) {
            const claimId = row.dataset.id;
            const updatedClaim = {
                claimantName: row.querySelector('[data-field="claimantName"]').value,
                claimAmount: parseFloat(row.querySelector('[data-field="claimAmount"]').value),
                claimType: row.querySelector('[data-field="claimType"]').value,
            };
            saveClaim(claimId, updatedClaim);
        }
    };

    const saveClaim = async (id, claimData) => {
        try {
            const response = await fetch(`/api/v1/claims/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(claimData),
            });

            if (response.ok) {
                fetchClaims(); // Refresh the table
            } else {
                const errorData = await response.json();
                alert(`Error updating claim: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Error updating claim:', error);
            alert('An unexpected error occurred while updating the claim.');
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        window.location.href = '/login.html';
    };

    searchInput.addEventListener('input', filterClaims);
    deleteSelectedBtn.addEventListener('click', deleteSelectedClaims);
    selectAllCheckbox.addEventListener('change', toggleSelectAll);
    logoutBtn.addEventListener('click', logout);
    claimsTableBody.addEventListener('click', handleTableRowClick);

    createClaimForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createClaimForm);
        const claimRequest = {
            claimantName: formData.get('claimantName'),
            claimAmount: parseFloat(formData.get('claimAmount')),
            claimType: formData.get('claimType'),
        };

        try {
            const response = await fetch('/api/v1/claims', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(claimRequest),
            });

            if (response.ok) {
                createClaimForm.reset();
                fetchClaims(); // Refresh the table
            } else {
                const errorData = await response.json();
                alert(`Error creating claim: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Error creating claim:', error);
            alert('An unexpected error occurred.');
        }
    });

    fetchClaims();
});
