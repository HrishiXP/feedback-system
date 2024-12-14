// AdminDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalComponent from './ModalComponent';

function AdminDashboard() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editedFeedback, setEditedFeedback] = useState('');
    const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
    const navigate = useNavigate();

    // Fetch feedbacks for admin
    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/feedback/all', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(res.data);
        } catch (error) {
            setModalMessage('Failed to fetch feedback');
            setShowModal(true);
        }
    };

    // Handle Delete Feedback
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/feedback/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setModalMessage('Feedback deleted');
                setShowModal(true);
                fetchFeedbacks(); // Refresh feedback list
            } catch (error) {
                setModalMessage('Failed to delete feedback');
                setShowModal(true);
            }
        }
    };

    // Handle Edit Feedback
    const handleEdit = (id, feedback) => {
        setCurrentFeedbackId(id);
        setEditedFeedback(feedback);
    };

    // Update Edited Feedback
    const handleUpdate = async () => {
        if (!editedFeedback.trim()) {
            setModalMessage('Feedback cannot be empty');
            setShowModal(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/feedback/${currentFeedbackId}`, {
                feedback: editedFeedback,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setModalMessage('Feedback updated');
            setShowModal(true);
            fetchFeedbacks();
            setCurrentFeedbackId(null);
            setEditedFeedback('');
        } catch (error) {
            setModalMessage('Failed to update feedback');
            setShowModal(true);
        }
    };

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Redirect to login page
    };

    // Fetch feedbacks on component mount
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Admin Dashboard</h2>
            <button
                onClick={handleLogout}
                style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '20px' }}
            >
                Logout
            </button>

            <table style={{ margin: 'auto', width: '80%', border: '1px solid #ddd', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Feedback</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Feedback_date</th>

                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((fb) => (
                        <tr key={fb.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{fb.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {currentFeedbackId === fb.id ? (
                                    <input
                                        type="text"
                                        value={editedFeedback}
                                        onChange={(e) => setEditedFeedback(e.target.value)}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                ) : (
                                    fb.feedback
                                )}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
    {new Date(fb.created_at).toLocaleDateString('en-CA')}
</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {currentFeedbackId === fb.id ? (
                                    <button
                                        onClick={handleUpdate}
                                        style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none' }}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEdit(fb.id, fb.feedback)}
                                            style={{ padding: '5px 10px', marginRight: '5px', backgroundColor: '#ffc107', color: '#fff', border: 'none' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(fb.id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none' }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalComponent
                showModal={showModal}
                closeModal={() => setShowModal(false)}
                modalMessage={modalMessage}
            />
        </div>
    );
}

export default AdminDashboard;
