import React, { useState } from 'react';
import styles from './SignupLoginPage.module.css';

const SignupForm = ({ onSignupSuccess }) => {
    const [signupData, setSignupData] = useState({
        username: '',
        password: '',
        instrument: '',
    });
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    const instruments = ['Guitar', 'Drums', 'Bass', 'Saxophone', 'Vocals', 'Keyboards', 'Singer'];

    const handleSignupChange = (event) => {
        const { name, value } = event.target; 
        setSignupData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSignupSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); 

        if (!instruments.includes(signupData.instrument)) {
            setErrorMessage('Invalid instrument selected'); 
            setLoading(false); 
            return; 
        }

        const signupDataWithRole = { ...signupData, role: 'user' };

        try {
            const response = await fetch(`${apiUrl}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupDataWithRole), 
            });

            let data;
            try {
                data = await response.json(); 
            } catch (error) {
                console.error('Failed to parse response as JSON:', error);
                data = { message: 'Failed to parse server response' };
            }

            if (response.ok) {
                setErrorMessage('');
                alert('Signup successful! Please log in.'); 
                onSignupSuccess(); 
            } else {
                console.error('Signup failed with status:', response.status);
                setErrorMessage(data.message || 'An unknown error occurred.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorMessage('An error occurred during signup.'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <img src='/band1.jpg' alt='welcome Logo' className={styles.logo} />
            <h2 className={styles.title}>Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
                <input
                    className={styles.input}
                    type="text"
                    name="username"
                    value={signupData.username}
                    onChange={handleSignupChange}
                    placeholder="Username"
                    required 
                    aria-label="Username" 
                />
                <input
                    className={styles.input}
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder="Password"
                    required 
                    aria-label="Password" 
                />
                <select
                    className={styles.input}
                    name="instrument"
                    value={signupData.instrument}
                    onChange={handleSignupChange}
                    required 
                    aria-label="Instrument" 
                >
                    <option value="" disabled>Select Instrument</option> 
                    {instruments.map((instrument, index) => (
                        <option key={index} value={instrument}>
                            {instrument}
                        </option>
                    ))}
                </select>
                <button type="submit" className="button" disabled={loading}>
                    Sign Up
                </button>
                {loading && <p>Signing up...</p>}
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default SignupForm;
