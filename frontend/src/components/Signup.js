// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/register', formData);
      
//       // Store user data and token
//       localStorage.setItem('userToken', response.data.token);
//       localStorage.setItem('userInfo', JSON.stringify(response.data));
      
//       // Redirect to user dashboard
//       navigate('/user-dashboard');
//     } catch (error) {
//       setError(error.response?.data?.message || 'Registration failed');
//       alert(error.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="auth-form">
//       <h2>Sign Up</h2>
//       {error && <div className="error-message">{error}</div>}
//       <form onSubmit={handleSignup}>
//         <input 
//           type="text" 
//           name="name" 
//           placeholder="Full Name" 
//           value={formData.name}
//           onChange={handleChange} 
//           required 
//         />
//         <input 
//           type="email" 
//           name="email" 
//           placeholder="Email" 
//           value={formData.email}
//           onChange={handleChange} 
//           required 
//         />
//         <input 
//           type="password" 
//           name="password" 
//           placeholder="Password" 
//           value={formData.password}
//           onChange={handleChange} 
//           required 
//         />
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;