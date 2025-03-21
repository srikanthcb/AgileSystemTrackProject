import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        // Email validation (basic format check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errors.email = "Invalid email format";
            isValid = false;
        }

        // Password validation (minimum 6 characters)
        if (!password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.get(`http://localhost:4000/users?email=${email}&password=${password}`);
            if (response.data.length > 0) {
                const user = response.data[0];
                login(user);
                user.role === 'admin' ? navigate('/') : navigate('/profiles');
            } else {
                setErrors({ general: "Invalid email or password" });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrors({ general: "An error occurred. Please try again." });
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

                <label>Password:</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

                <button type="submit">Login</button>
                {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
            </form>
            
            <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;
