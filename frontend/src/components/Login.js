import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalComponent from './ModalComponent';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);

            const role = res.data.role;

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/feedback');
            }
        } catch (err) {
            setModalMessage(err.response?.data?.message || 'Invalid credentials');
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: '50px auto', width: '300px', textAlign: 'center' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p className="mt-3">
                Don't have an account?{' '}
                <a href="/register" className="text-decoration-underline">
                    Register here
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

export default Login;
