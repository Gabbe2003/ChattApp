const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');


router.get('/', messageController.getAllMessages); 
router.post('/', messageController.deleteMessage); 
router.put('/', messageController.updateMessage); 

module.exports = router;
