const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { sendMessage } = require('../controllers/messageController');
const validate = require('../middleware/validate');

router.post('/',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('subject').notEmpty().withMessage('Subject is required').trim(),
    body('message').notEmpty().withMessage('Message is required').trim().isLength({ min: 10 })
      .withMessage('Message must be at least 10 characters long'),
    body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  ],
  validate,
  sendMessage
);

module.exports = router;