import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalComponent from './ModalComponent';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setModalMessage('Passwords do not match');
            setShowModal(true);
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/auth/register', { username, email, password });
            setModalMessage('User registered successfully');
            setShowModal(true);
            navigate('/');
        } catch (err) {
            setModalMessage(err.response?.data?.message || 'Error registering user');
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: '50px auto', width: '300px', textAlign: 'center' }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-control mb-3"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control mb-3"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control mb-3"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control mb-3"
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="mt-3">
                Already have an account?{' '}
                <a href="/" className="text-decoration-underline">
                    Login here
                </a>
            </p>

            <ModalComponent
                showModal={showModal}
                closeModal={() => setShowModal(false)}
                modalMessage={modalMessage}
            />
        </div>
    );
}

export default Register;
