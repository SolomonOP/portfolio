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

    console.log(`✅ Message saved to database with ID: ${newMessage._id}`);
    
    // Send email notification
    let emailSent = false;
    let emailError = null;
    
    try {
      // Check if email credentials are configured
      if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Email credentials not configured. Skipping email notification.');
        emailError = 'Email credentials missing';
      } else {
        // Create transporter with better configuration for Render
// Create transporter with correct settings for port 2525
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 2525,
  secure: false,           // MUST be false for port 2525
  requireTLS: true,        // This enables STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  debug: true,
  logger: true
});

        // Verify connection configuration
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully');
        
        // Prepare email content
        const mailOptions = {
          from: `"Portfolio Contact" <solomonraja332@gmail.com>`,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `New Portfolio Contact: ${subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ff2b2b, #cc0000); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #ff2b2b; }
                .value { margin-top: 5px; padding: 8px; background: white; border-radius: 5px; border-left: 3px solid #ff2b2b; }
                .footer { margin-top: 20px; font-size: 12px; color: #999; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>🕷️ New Contact Form Submission</h2>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${name}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Email:</div>
                    <div class="value"><a href="mailto:${email}">${email}</a></div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Phone:</div>
                    <div class="value">${phone || 'Not provided'}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Project Type:</div>
                    <div class="value">${projectType || 'Not specified'}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Budget:</div>
                    <div class="value">${budget || 'Not specified'}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Subject:</div>
                    <div class="value">${subject}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Message:</div>
                    <div class="value">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                </div>
                <div class="footer">
                  <p>This message was sent from your portfolio website.</p>
                  <p>Message ID: ${newMessage._id}</p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
New Contact Form Submission
===========================
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Project Type: ${projectType || 'Not specified'}
Budget: ${budget || 'Not specified'}
Subject: ${subject}

Message:
${message}
          `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully: ${info.messageId}`);
        if (nodemailer.getTestMessageUrl(info)) {
          console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        emailSent = true;
      }
      
    } catch (emailError) {
      console.error('❌ Email sending failed with details:');
      console.error('- Message:', emailError.message);
      console.error('- Code:', emailError.code);
      console.error('- Command:', emailError.command);
      console.error('- Response:', emailError.response);
      console.error('- Response Code:', emailError.responseCode);
      console.error('- Stack:', emailError.stack);
      emailError = emailError.message;
    }
    
    // Send response to client
    if (emailSent) {
      res.status(201).json({
        success: true,
        data: {
          id: newMessage._id,
          message: 'Message sent successfully! I\'ll get back to you soon.',
          emailSent: true
        }
      });
    } else {
      // Message saved but email failed
      res.status(201).json({
        success: true,
        data: {
          id: newMessage._id,
          message: 'Message saved! Email notification failed, but I\'ll still get back to you.',
          emailSent: false,
          emailError: emailError
        }
      });
    }
    
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      console.error('❌ Validation Error:', messages);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } 
    // Handle duplicate key errors
    else if (err.code === 11000) {
      console.error('❌ Duplicate Key Error:', err);
      return res.status(400).json({
        success: false,
        error: 'Duplicate field value entered'
      });
    }
    // Handle other errors
    else {
      console.error('❌ Server Error:', err);
      res.status(500).json({
        success: false,
        error: 'Server Error. Please try again later.'
      });
    }
  }
};