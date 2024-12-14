const db = require('./db');

// Fetch all feedback (with user filter for regular users)
const getAllFeedback = (userId, callback) => {
    let sql = 'SELECT * FROM feedback';
    let params = [];

    if (userId) {
        sql += ' WHERE user_id = ?';
        params = [userId];
    }

    db.query(sql, params, callback);
};

// Add new feedback
const addFeedback = (feedback, callback) => {
    const sql = 'INSERT INTO feedback (user_id, feedback) VALUES (?, ?)';
    db.query(sql, [feedback.user_id, feedback.feedback], callback);
};

// Update feedback
const updateFeedback = (id, feedback, callback) => {
    const sql = 'UPDATE feedback SET feedback = ? WHERE id = ?';
    db.query(sql, [feedback, id], callback);
};

// Delete feedback
const deleteFeedback = (id, callback) => {
    const sql = 'DELETE FROM feedback WHERE id = ?';
    db.query(sql, [id], callback);
};

module.exports = { addFeedback, getAllFeedback, updateFeedback, deleteFeedback };
