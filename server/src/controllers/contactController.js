const { Contact } = require('../models');
const { AppError, catchAsync } = require('../utils');

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * @desc    Submit a contact us form
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, message } = req.body;

  // Capture IP address for spam tracking
  const ipAddress =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    null;

  const contact = await Contact.create({
    firstName,
    lastName,
    email,
    message,
    ipAddress,
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! We will get back to you within 24 hours.',
    data: {
      id:        contact._id,
      firstName: contact.firstName,
      lastName:  contact.lastName,
      email:     contact.email,
      createdAt: contact.createdAt,
    },
  });
});

// ─── Admin only ───────────────────────────────────────────────────────────────

/**
 * @desc    Get all contact submissions (with filters & pagination)
 * @route   GET /api/contact
 * @access  Private/Admin
 *
 * Query params:
 *   page, limit, status (unread|read|resolved), search (name / email), startDate, endDate
 */
const getAllContacts = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    startDate,
    endDate,
  } = req.query;

  const query = {};

  // Filter by status
  if (status) query.status = status;

  // Search by name or email
  if (search) {
    query.$or = [
      { firstName:  { $regex: search, $options: 'i' } },
      { lastName:   { $regex: search, $options: 'i' } },
      { email:      { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate)   query.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [contacts, total] = await Promise.all([
    Contact.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Contact.countDocuments(query),
  ]);

  // Unread count (useful for admin badge)
  const unreadCount = await Contact.countDocuments({ status: 'unread' });

  res.status(200).json({
    success: true,
    data: {
      contacts,
      unreadCount,
      pagination: {
        page:  parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * @desc    Get a single contact submission by ID
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
const getContactById = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(AppError.notFound('Contact submission not found'));
  }

  // Auto-mark as read when admin opens it
  if (contact.status === 'unread') {
    contact.status = 'read';
    await contact.save();
  }

  res.status(200).json({
    success: true,
    data: { contact },
  });
});

/**
 * @desc    Update contact status or add admin notes
 * @route   PATCH /api/contact/:id
 * @access  Private/Admin
 */
const updateContact = catchAsync(async (req, res, next) => {
  const { status, adminNotes } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(AppError.notFound('Contact submission not found'));
  }

  if (status !== undefined)     contact.status     = status;
  if (adminNotes !== undefined) contact.adminNotes = adminNotes;

  await contact.save();

  res.status(200).json({
    success: true,
    message: 'Contact submission updated',
    data: { contact },
  });
});

/**
 * @desc    Delete a contact submission
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
const deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(AppError.notFound('Contact submission not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Contact submission deleted successfully',
  });
});

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
