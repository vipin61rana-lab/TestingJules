document.addEventListener('DOMContentLoaded', function () {
    const claimsTableBody = document.querySelector('#claims-table tbody');
    const createClaimForm = document.getElementById('create-claim-form');
    const searchInput = document.getElementById('search-input');
    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    const logoutBtn = document.getElementById('logout-btn');
    let allClaims = []; // Store all claims to filter from

    const token = localStorage.getItem('jwt');
    if (!token) {
        window.location.href = '/login.html';
        return;
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
        claimsTableBody.innerHTML = ''; // Clear existing rows
        if (claims.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 6;
            cell.textContent = 'No claims found.';
            row.appendChild(cell);
            claimsTableBody.appendChild(row);
        } else {
            claims.forEach(claim => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="claim-checkbox" data-id="${claim.id}"></td>
                    <td>${claim.id}</td>
                    <td>${claim.claimantName}</td>
                    <td>${claim.claimAmount.toFixed(2)}</td>
                    <td>${claim.claimType}</td>
                    <td>${claim.status}</td>
                    <td>${new Date(claim.createdAt).toLocaleString()}</td>
                `;
                claimsTableBody.appendChild(row);
            });
        }
    };

    const filterClaims = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredClaims = allClaims.filter(claim => {
            return (
                claim.id.toLowerCase().includes(searchTerm) ||
                claim.claimantName.toLowerCase().includes(searchTerm) ||
                claim.claimAmount.toString().includes(searchTerm) ||
                claim.claimType.toLowerCase().includes(searchTerm) ||
                claim.status.toLowerCase().includes(searchTerm)
            );
        });
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
                fetchClaims(); // Refresh the table
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

    const logout = () => {
        localStorage.removeItem('jwt');
        window.location.href = '/login.html';
    };

    searchInput.addEventListener('input', filterClaims);
    deleteSelectedBtn.addEventListener('click', deleteSelectedClaims);
    selectAllCheckbox.addEventListener('change', toggleSelectAll);
    logoutBtn.addEventListener('click', logout);

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

    // Initial fetch of claims
    fetchClaims();
});
