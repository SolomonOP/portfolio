const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// @desc    Send contact message
// @route   POST /api/contact
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message, projectType, budget } = req.body;
    
    // Create message in database
    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message,
      projectType,
      budget
    });
    
    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Contact: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
          <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
          <h3>Message:</h3>
          <p>${message}</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({
      success: true,
      data: {
        id: newMessage._id,
        message: 'Message sent successfully! I\'ll get back to you soon.'
      }
    });
    
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};