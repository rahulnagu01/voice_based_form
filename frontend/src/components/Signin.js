// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Signin = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSignin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
//       // Store user data and token
//       localStorage.setItem('userToken', response.data.token);
//       localStorage.setItem('userInfo', JSON.stringify(response.data));
      
//       // Redirect to user dashboard
//       navigate('/user-dashboard');
//     } catch (error) {
//       setError(error.response?.data?.message || 'Login failed');
//       alert(error.response?.data?.message || 'Invalid credentials');
//     }
//   };

//   return (
//     <div className="auth-form">
//       <h2>User Login</h2>
//       {error && <div className="error-message">{error}</div>}
//       <form onSubmit={handleSignin}>
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
//         <button type="submit">Sign In</button>
//       </form>
//     </div>
//   );
// };

// export default Signin;