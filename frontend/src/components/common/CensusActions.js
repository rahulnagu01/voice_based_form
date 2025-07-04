// src/components/common/CensusActions.js
import React, { useState } from 'react';
import axios from 'axios';
import './CensusActions.css';
import EditCensusForm from './EditCensusForm';

const CensusActions = ({ 
    census, 
    onActionComplete, 
    userRole, // 'admin' or 'officer'
    token 
}) => {
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState('');

    // Handle View
    const handleView = () => {
        setShowViewModal(true);
    };

    // Handle Edit
    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleUpdate = (updatedCensus) => {
        onActionComplete('edit');
    };

    // Handle Delete
    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    // Confirm Delete
    const confirmDelete = async () => {
        try {
            // Determine the API endpoint based on user role
            const endpoint = userRole === 'admin' 
                ? `/api/admin/census/${census._id}`
                : `/api/census/${census._id}`;

            const response = await axios.delete(
                `http://localhost:5000${endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setShowDeleteModal(false);
                onActionComplete('delete');
            } else {
                setError(response.data.message || 'Failed to delete census record');
            }
        } catch (error) {
            console.error('Error deleting census:', error);
            setError(error.response?.data?.message || 'Failed to delete census record');
        }
    };

    // View Modal Component
    const ViewModal = ({ onClose }) => (
        <div className="modal">
            <div className="modal-content">
                <h2>Census Details</h2>
                <div className="census-details">
                    <h3>Personal Information</h3>
                    <p><strong>Form ID:</strong> {census.formId}</p>
                    <p><strong>Full Name:</strong> {census.personalDetails.fullName}</p>
                    <p><strong>Aadhaar Number:</strong> {census.aadhaarNumber}</p>
                    <p><strong>Gender:</strong> {census.personalDetails.gender}</p>
                    <p><strong>Date of Birth:</strong> {new Date(census.personalDetails.dateOfBirth).toLocaleDateString()}</p>
                    
                    <h3>Contact Information</h3>
                    <p><strong>Phone:</strong> {census.contactInformation.phoneNumber}</p>
                    <p><strong>Email:</strong> {census.contactInformation.email}</p>
                    <p><strong>Address:</strong> {census.contactInformation.permanentAddress}</p>
                            
                    <h3>Demographic Details</h3>
                    <p><strong>State:</strong> {census.demographicDetails.state}</p>
                    <p><strong>District/City:</strong> {census.demographicDetails.districtCity}</p>
                    <p><strong>Pincode:</strong> {census.demographicDetails.pincode}</p>
                    
                    <h3>Employment & Education</h3>
                    <p><strong>Employment Status:</strong> {census.employmentEducation.employmentStatus}</p>
                    <p><strong>Occupation:</strong> {census.employmentEducation.occupation}</p>
                    <p><strong>Qualification:</strong> {census.employmentEducation.highestQualification}</p>
                    
                    <h3>Family Details</h3>
                    <p><strong>Head of Family:</strong> {census.familyDetails.headOfFamily}</p>
                    <p><strong>Family Members:</strong> {census.familyDetails.familyMembers}</p>
                    
                    <h3>Additional Information</h3>
                    <p><strong>Disabilities:</strong> {census.additionalInfo.disabilities}</p>
                    <p><strong>Annual Income:</strong> {census.additionalInfo.annualIncome}</p>
                </div>             
                <button className="btn close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );

    // Delete Confirmation Modal
    const DeleteModal = ({ onConfirm, onCancel }) => (
        <div className="modal">
            <div className="modal-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this census record?</p>
                <p><strong>Form ID:</strong> {census.formId}</p>
                <p><strong>Name:</strong> {census.personalDetails.fullName}</p>
                <div className="modal-actions">
                    <button className="btn delete-btn" onClick={onConfirm}>Delete</button>
                    <button className="btn cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="action-buttons">
                <button 
                    className="btn view-btn" 
                    onClick={handleView}
                    title="View Details"
                >
                    View
                </button>
                <button 
                    className="btn edit-btn" 
                    onClick={handleEdit}
                    title="Edit Record"
                >
                    Edit
                </button>
                <button 
                    className="btn delete-btn" 
                    onClick={handleDelete}
                    title="Delete Record"
                >
                    Delete
                </button>
            </div>

            {/* Modals */}
            {showViewModal && (
                <ViewModal 
                    onClose={() => setShowViewModal(false)}
                />
            )}

            {showDeleteModal && (
                <DeleteModal 
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}

            {showEditModal && (
                <EditCensusForm 
                    census={census}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdate}
                    userRole={userRole}
                    token={token}
                />
            )}

            {error && <div className="error-message">{error}</div>}
        </>
    );
};

export default CensusActions;