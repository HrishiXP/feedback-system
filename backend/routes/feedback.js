const express = require('express');
const { addFeedback, getAllFeedback, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.get('/all', authenticate, getAllFeedback);  
router.put('/:id', authenticate, updateFeedback);  
router.delete('/:id', authenticate, deleteFeedback); 
router.post('/', authenticate, addFeedback);

module.exports = router;
