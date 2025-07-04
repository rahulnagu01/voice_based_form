// components/common/EditCensusForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditCensusForm.css';

const EditCensusForm = ({ census, onClose, onUpdate, userRole, token }) => {
    const [formData, setFormData] = useState({
        personalDetails: {
            fullName: '',
            gender: '',
            dateOfBirth: '',
            maritalStatus: '',
            nationality: ''
        },
        contactInformation: {
            phoneNumber: '',
            email: '',
            permanentAddress: '',
            temporaryAddress: ''
        },
        employmentEducation: {
            employmentStatus: '',
            occupation: '',
            highestQualification: ''
        },
        demographicDetails: {
            state: '',
            districtCity: '',
            pincode: ''
        },
        familyDetails: {
            headOfFamily: '',
            familyMembers: '',
            dependentMembers: ''
        },
        additionalInfo: {
            disabilities: '',
            annualIncome: ''
        }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (census) {
            setFormData({
                personalDetails: { ...census.personalDetails },
                contactInformation: { ...census.contactInformation },
                employmentEducation: { ...census.employmentEducation },
                demographicDetails: { ...census.demographicDetails },
                familyDetails: { ...census.familyDetails },
                additionalInfo: { ...census.additionalInfo }
            });
        }
    }, [census]);

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = userRole === 'admin'
                ? `/api/admin/census/${census._id}`
                : `/api/census/${census._id}`;

            const response = await axios.put(
                `http://localhost:5000${endpoint}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                onUpdate(response.data.data);
                onClose();
            } else {
                setError(response.data.message || 'Failed to update census data');
            }
        } catch (error) {
            console.error('Error updating census:', error);
            setError(error.response?.data?.message || 'Failed to update census data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content edit-form">
            <div className="modal-header">
                <h2>Edit Census Form</h2>
                <button className="close-button" onClick={onClose}>
                    <span>&times;</span>
                </button>
            </div>

                <form onSubmit={handleSubmit}>
                    {/* Personal Details */}
                    <section className="form-section">
                        <h3>Personal Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.personalDetails.fullName}
                                    onChange={(e) => handleChange('personalDetails', 'fullName', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select
                                    value={formData.personalDetails.gender}
                                    onChange={(e) => handleChange('personalDetails', 'gender', e.target.value)}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.personalDetails.dateOfBirth.split('T')[0]}
                                    onChange={(e) => handleChange('personalDetails', 'dateOfBirth', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Marital Status</label>
                                <select
                                    value={formData.personalDetails.maritalStatus}
                                    onChange={(e) => handleChange('personalDetails', 'maritalStatus', e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="form-section">
                        <h3>Contact Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.contactInformation.phoneNumber}
                                    onChange={(e) => handleChange('contactInformation', 'phoneNumber', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.contactInformation.email}
                                    onChange={(e) => handleChange('contactInformation', 'email', e.target.value)}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Permanent Address</label>
                                <textarea
                                    value={formData.contactInformation.permanentAddress}
                                    onChange={(e) => handleChange('contactInformation', 'permanentAddress', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Demographic Details */}
                    <section className="form-section">
                        <h3>Demographic Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    value={formData.demographicDetails.state}
                                    onChange={(e) => handleChange('demographicDetails', 'state', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>District/City</label>
                                <input
                                    type="text"
                                    value={formData.demographicDetails.districtCity}
                                    onChange={(e) => handleChange('demographicDetails', 'districtCity', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    value={formData.demographicDetails.pincode}
                                    onChange={(e) => handleChange('demographicDetails', 'pincode', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Employment & Education */}
                    <section className="form-section">
                        <h3>Employment & Education</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Employment Status</label>
                                <select
                                    value={formData.employmentEducation.employmentStatus}
                                    onChange={(e) => handleChange('employmentEducation', 'employmentStatus', e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Employed">Employed</option>
                                    <option value="Unemployed">Unemployed</option>
                                    <option value="Self-Employed">Self-Employed</option>
                                    <option value="Student">Student</option>
                                    <option value="Retired">Retired</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Occupation</label>
                                <input
                                    type="text"
                                    value={formData.employmentEducation.occupation}
                                    onChange={(e) => handleChange('employmentEducation', 'occupation', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Highest Qualification</label>
                                <input
                                    type="text"
                                    value={formData.employmentEducation.highestQualification}
                                    onChange={(e) => handleChange('employmentEducation', 'highestQualification', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Family Details */}
                    <section className="form-section">
                        <h3>Family Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Head of Family</label>
                                <input
                                    type="text"
                                    value={formData.familyDetails.headOfFamily}
                                    onChange={(e) => handleChange('familyDetails', 'headOfFamily', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Family Members</label>
                                <input
                                    type="number"
                                    value={formData.familyDetails.familyMembers}
                                    onChange={(e) => handleChange('familyDetails', 'familyMembers', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Dependent Members</label>
                                <input
                                    type="number"
                                    value={formData.familyDetails.dependentMembers}
                                    onChange={(e) => handleChange('familyDetails', 'dependentMembers', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Additional Information */}
                    <section className="form-section">
                        <h3>Additional Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Disabilities</label>
                                <input
                                    type="text"
                                    value={formData.additionalInfo.disabilities}
                                    onChange={(e) => handleChange('additionalInfo', 'disabilities', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Annual Income</label>
                                <input
                                    type="number"
                                    value={formData.additionalInfo.annualIncome}
                                    onChange={(e) => handleChange('additionalInfo', 'annualIncome', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn save-btn" 
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                            type="button" 
                            className="btn cancel-btn" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCensusForm;