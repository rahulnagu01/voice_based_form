// src/utils/auth.js
export const checkAuth = () => {
    const token = localStorage.getItem('token');
    const officerInfo = localStorage.getItem('officerInfo');

    if (!token || !officerInfo) {
        return false;
    }

    // Check if token is properly formatted
    if (!token.startsWith('Bearer ')) {
        localStorage.removeItem('token');
        localStorage.removeItem('officerInfo');
        return false;
    }

    return true;
};