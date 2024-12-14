// Feedback.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalComponent from './ModalComponent';

function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editedFeedback, setEditedFeedback] = useState('');
    const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
    const navigate = useNavigate();

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

    const handleAddFeedback = async () => {
        if (!newFeedback.trim()) {
            setModalMessage('Feedback cannot be empty');
            setShowModal(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/feedback', { feedback: newFeedback }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setModalMessage('Feedback added');
            setShowModal(true);
            setNewFeedback('');
            fetchFeedbacks();
        } catch (error) {
            setModalMessage('Failed to add feedback');
            setShowModal(true);
        }
    };

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

    const handleEdit = (id, feedback) => {
        setCurrentFeedbackId(id);
        setEditedFeedback(feedback);
    };

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Your Feedback</h2>
            <button
                onClick={handleLogout}
                style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '20px' }}
            >
                Logout
            </button>

            <textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Write your feedback"
                style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '10px' }}
            />
            <button
                onClick={handleAddFeedback}
                style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                Submit Feedback
            </button>

            <div>
                {feedbacks.map((fb) => (
                    <div key={fb.id} style={{ margin: '10px', padding: '10px', border: '1px solid #ddd' }}>
                        {currentFeedbackId === fb.id ? (
                            <input
                                type="text"
                                value={editedFeedback}
                                onChange={(e) => setEditedFeedback(e.target.value)}
                                style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
                            />
                        ) : (
                            <p>{fb.feedback}</p>
                        )}
                        <div>
                            {currentFeedbackId === fb.id ? (
                                <button
                                    onClick={handleUpdate}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#28a745',
                                        color: '#fff',
                                        border: 'none',
                                    }}
                                >
                                    Save
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleEdit(fb.id, fb.feedback)}
                                        style={{
                                            padding: '5px 10px',
                                            marginRight: '5px',
                                            backgroundColor: '#ffc107',
                                            color: '#fff',
                                            border: 'none',
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(fb.id)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: '#dc3545',
                                            color: '#fff',
                                            border: 'none',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <ModalComponent
                showModal={showModal}
                closeModal={() => setShowModal(false)}
                modalMessage={modalMessage}
            />
        </div>
    );
}

export default Feedback;
