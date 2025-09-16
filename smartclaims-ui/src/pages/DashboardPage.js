import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import { getClaims, createClaim, updateClaim, deleteClaims } from '../services/apiService';
import './DashboardPage.css';

const DashboardPage = () => {
    const [claims, setClaims] = useState([]);
    const [allClaims, setAllClaims] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRowId, setEditingRowId] = useState(null);
    const [newClaim, setNewClaim] = useState({ claimantName: '', claimAmount: '', claimType: '' });
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        setIsLoading(true);
        try {
            const data = await getClaims();
            setAllClaims(data);
            setClaims(data);
        } catch (err) {
            setError('Failed to fetch claims.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const filteredClaims = allClaims.filter(claim =>
            Object.values(claim).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setClaims(filteredClaims);
    }, [searchTerm, allClaims]);

    const handleCreateClaim = async (e) => {
        e.preventDefault();
        try {
            await createClaim(newClaim);
            setNewClaim({ claimantName: '', claimAmount: '', claimType: '' });
            fetchClaims();
        } catch (err) {
            setError('Failed to create claim.');
            console.error(err);
        }
    };

    const handleUpdateClaim = async (id, updatedData) => {
        try {
            await updateClaim(id, updatedData);
            setEditingRowId(null);
            fetchClaims();
        } catch (err) {
            setError('Failed to update claim.');
            console.error(err);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) {
            alert("Please select claims to delete.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${selectedIds.size} claim(s)?`)) {
            try {
                await deleteClaims(Array.from(selectedIds));
                setSelectedIds(new Set());
                fetchClaims();
            } catch (err) {
                setError('Failed to delete claims.');
                console.error(err);
            }
        }
    };

    const handleSelectRow = (id) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
        } else {
            newSelectedIds.add(id);
        }
        setSelectedIds(newSelectedIds);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(claims.map(c => c.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const EditRow = ({ claim, onSave, onCancel }) => {
        const [rowData, setRowData] = useState({ ...claim });
        return (
            <tr>
                <td></td>
                <td>{claim.id.substring(0, 8)}...</td>
                <td><input type="text" value={rowData.claimantName} onChange={e => setRowData({...rowData, claimantName: e.target.value})} /></td>
                <td><input type="number" value={rowData.claimAmount} onChange={e => setRowData({...rowData, claimAmount: e.target.value})} /></td>
                <td><input type="text" value={rowData.claimType} onChange={e => setRowData({...rowData, claimType: e.target.value})} /></td>
                <td>{claim.status}</td>
                <td>{new Date(claim.createdAt).toLocaleString()}</td>
                <td>
                    <button onClick={() => onSave(claim.id, rowData)}>Save</button>
                    <button onClick={onCancel}>Cancel</button>
                </td>
            </tr>
        );
    };

    const ViewRow = ({ claim }) => (
        <tr key={claim.id}>
            <td>
                <input
                    type="checkbox"
                    checked={selectedIds.has(claim.id)}
                    onChange={() => handleSelectRow(claim.id)}
                />
            </td>
            <td title={claim.id}>{claim.id.substring(0, 8)}...</td>
            <td>{claim.claimantName}</td>
            <td>${claim.claimAmount.toFixed(2)}</td>
            <td>{claim.claimType}</td>
            <td>{claim.status}</td>
            <td>{new Date(claim.createdAt).toLocaleString()}</td>
            <td><button onClick={() => setEditingRowId(claim.id)}>Edit</button></td>
        </tr>
    );

    return (
        <div>
            <Header />
            <main className="dashboard-container">
                <h2>Create a New Claim</h2>
                <form onSubmit={handleCreateClaim} className="claim-form">
                    <input type="text" placeholder="Claimant Name" value={newClaim.claimantName} onChange={e => setNewClaim({...newClaim, claimantName: e.target.value})} required/>
                    <input type="number" placeholder="Amount" value={newClaim.claimAmount} onChange={e => setNewClaim({...newClaim, claimAmount: e.target.value})} required />
                    <input type="text" placeholder="Type" value={newClaim.claimType} onChange={e => setNewClaim({...newClaim, claimType: e.target.value})} required />
                    <button type="submit">Create Claim</button>
                </form>

                <h2>All Claims</h2>
                <div className="toolbar">
                    <input
                        type="text"
                        placeholder="Search claims..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={handleDeleteSelected} className="delete-btn">Delete Selected</button>
                </div>

                {isLoading && <p>Loading claims...</p>}
                {error && <p className="error-message">{error}</p>}
                {!isLoading && !error && (
                    <table className="claims-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" onChange={handleSelectAll} /></th>
                                <th>ID</th>
                                <th>Claimant Name</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map(claim => (
                                editingRowId === claim.id
                                    ? <EditRow key={claim.id} claim={claim} onSave={handleUpdateClaim} onCancel={() => setEditingRowId(null)} />
                                    : <ViewRow key={claim.id} claim={claim} />
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;
