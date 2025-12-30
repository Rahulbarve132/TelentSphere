const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

/**
 * Email Templates
 */

const emailTemplates = {
  /**
   * Welcome email template
   */
  welcome: (name) => ({
    subject: 'Welcome to TalentSphere!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TalentSphere!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for joining TalentSphere! We're excited to have you on board.</p>
              <p>TalentSphere connects talented professionals with amazing opportunities. Whether you're looking for your next project or seeking the perfect candidate, we've got you covered.</p>
              <p>Get started by completing your profile to showcase your skills and experience.</p>
              <a href="${process.env.FRONTEND_URL}/profile" class="button">Complete Your Profile</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The TalentSphere Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TalentSphere. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Email verification template
   */
  verification: (name, verificationUrl) => ({
    subject: 'Verify Your Email - TalentSphere',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { color: #e74c3c; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for registering with TalentSphere. Please click the button below to verify your email address:</p>
              <a href="${verificationUrl}" class="button">Verify Email</a>
              <p class="warning">This link will expire in 24 hours.</p>
              <p>If you didn't create an account with TalentSphere, please ignore this email.</p>
              <p>Best regards,<br>The TalentSphere Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TalentSphere. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Password reset template
   */
  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request - TalentSphere',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { color: #e74c3c; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p class="warning">This link will expire in 1 hour.</p>
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>Best regards,<br>The TalentSphere Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TalentSphere. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * New application notification template (for job poster)
   */
  newApplication: (posterName, applicantName, jobTitle, applicationUrl) => ({
    subject: `New Application for ${jobTitle} - TalentSphere`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .highlight { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Application Received</h1>
            </div>
            <div class="content">
              <p>Hi ${posterName},</p>
              <p>Great news! You have received a new application for your job posting.</p>
              <div class="highlight">
                <p><strong>Job:</strong> ${jobTitle}</p>
                <p><strong>Applicant:</strong> ${applicantName}</p>
              </div>
              <a href="${applicationUrl}" class="button">View Application</a>
              <p>Best regards,<br>The TalentSphere Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TalentSphere. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Application status update template (for applicant)
   */
  applicationStatusUpdate: (applicantName, jobTitle, status, feedbackUrl) => ({
    subject: `Application Update: ${jobTitle} - TalentSphere`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .status.accepted { background: #d4edda; color: #155724; }
            .status.rejected { background: #f8d7da; color: #721c24; }
            .status.reviewing { background: #fff3cd; color: #856404; }
            .status.shortlisted { background: #cce5ff; color: #004085; }
            .status.interview { background: #e2d5f1; color: #4a148c; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <p>Hi ${applicantName},</p>
              <p>There's an update on your application for <strong>${jobTitle}</strong>.</p>
              <p>Your application status has been updated to: <span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></p>
              <a href="${feedbackUrl}" class="button">View Details</a>
              <p>Best regards,<br>The TalentSphere Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TalentSphere. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (email, name) => {
  const template = emailTemplates.welcome(name);
  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

/**
 * Send verification email
 */
const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const template = emailTemplates.verification(name, verificationUrl);
  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const template = emailTemplates.passwordReset(name, resetUrl);
  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

/**
 * Send new application notification email
 */
const sendNewApplicationEmail = async (email, posterName, applicantName, jobTitle, applicationId) => {
  const applicationUrl = `${process.env.FRONTEND_URL}/applications/${applicationId}`;
  const template = emailTemplates.newApplication(posterName, applicantName, jobTitle, applicationUrl);
  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

/**
 * Send application status update email
 */
const sendApplicationStatusEmail = async (email, applicantName, jobTitle, status, applicationId) => {
  const feedbackUrl = `${process.env.FRONTEND_URL}/my-applications/${applicationId}`;
  const template = emailTemplates.applicationStatusUpdate(applicantName, jobTitle, status, feedbackUrl);
  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendNewApplicationEmail,
  sendApplicationStatusEmail,
};
