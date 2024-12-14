const { addFeedback, getAllFeedback, updateFeedback, deleteFeedback } = require('../models/feedback');

exports.getAllFeedback = (req, res) => {
    const userId = req.user.id;  // Get user ID from the JWT token
    const role = req.user.role;   // Get user role (admin or regular user)

    if (role === 'admin') {
        // Admin can fetch all feedback
        getAllFeedback(null, (err, feedback) => {  // Pass null for userId to fetch all feedback
            if (err) return res.status(500).send('Error fetching feedback');
            res.status(200).json(feedback);
        });
    } else {
        // Regular user can only fetch their own feedback
        getAllFeedback(userId, (err, feedback) => {  // Pass userId to fetch only their feedback
            if (err) return res.status(500).send('Error fetching feedback');
            res.status(200).json(feedback);
        });
    }
};

exports.addFeedback = (req, res) => {
    const feedback = { user_id: req.user.id, feedback: req.body.feedback };
    addFeedback(feedback, (err) => {
        if (err) return res.status(500).send('Error adding feedback');
        res.status(201).send('Feedback added');
    });
};

exports.updateFeedback = (req, res) => {
    const { id } = req.params;
    const { feedback } = req.body;
    updateFeedback(id, feedback, (err) => {
        if (err) return res.status(500).send('Error updating feedback');
        res.status(200).send('Feedback updated');
    });
};

// Delete feedback with ownership check
exports.deleteFeedback = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Get logged-in user ID from token
    const role = req.user.role;  // Get user role from token

    // Check if feedback exists
    getAllFeedback(null, (err, feedback) => {
        if (err) return res.status(500).send('Error fetching feedback');
        const feedbackToDelete = feedback.find((fb) => fb.id === parseInt(id));
        if (!feedbackToDelete) {
            return res.status(404).send('Feedback not found');
        }

        // Admin can delete any feedback
        if (role === 'admin') {
            deleteFeedback(id, (err) => {
                if (err) return res.status(500).send('Error deleting feedback');
                res.status(200).send('Feedback deleted');
            });
        } else {
            // Regular user can only delete their own feedback
            if (feedbackToDelete.user_id !== userId) {
                return res.status(403).send('You can only delete your own feedback');
            }

            // Proceed to delete if ownership matches
            deleteFeedback(id, (err) => {
                if (err) return res.status(500).send('Error deleting feedback');
                res.status(200).send('Feedback deleted');
            });
        }
    });
};
