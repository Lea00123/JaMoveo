import React, { useState } from 'react';
import styles from './SignupLoginPage.module.css';

const LoginForm = ({ onLoginSuccess }) => {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); 
        setErrorMessage(''); 

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            let data;
            try {
                data = await response.json();
                console.log('Parsed data:', data); 
            } catch (error) {
                console.error('Failed to parse response as JSON:', error);
                data = { message: 'Failed to parse server response' };
            }

            if (response.ok) {
                alert('Login successful!');
                onLoginSuccess(data.role, data.instrument); 
            } else {
                console.error('Login failed with status:', response.status);
                setErrorMessage(data.message || 'An unknown error occurred.');
            }
        } catch (error) {
            console.error('Error during login:', error); 
            setErrorMessage('An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}> 
            <img src='/band1.jpg' alt='welcome Logo' className={styles.logo} />
            <h2 className={styles.title}>Log In</h2>
            <form onSubmit={handleLoginSubmit}>
                <input
                    className={styles.input}
                    type="text"
                    name="username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    placeholder="Username"
                    required
                    aria-label="Username"
                />
                <input
                    className={styles.input}
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    required
                    aria-label="Password"
                />
                <button type="submit" className="button" disabled={loading}>Log In</button>
                {loading && <p>Logging in...</p>}
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default LoginForm;
