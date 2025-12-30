const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [10000, 'Description cannot exceed 10000 characters'],
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
      required: [true, 'Job type is required'],
    },
    category: {
      type: String,
      required: [true, 'Job category is required'],
      enum: [
        'web-development',
        'mobile-development',
        'ui-ux-design',
        'data-science',
        'devops',
        'cloud-computing',
        'cybersecurity',
        'blockchain',
        'ai-ml',
        'game-development',
        'other',
      ],
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      default: 'mid',
    },
    budget: {
      type: {
        type: String,
        enum: ['fixed', 'hourly', 'monthly'],
        default: 'fixed',
      },
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    location: {
      type: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid'],
        default: 'remote',
      },
      city: String,
      state: String,
      country: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'closed', 'paused', 'filled'],
      default: 'open',
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'invite-only'],
      default: 'public',
    },
    applicationDeadline: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Default expiry is 30 days from now
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
jobSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });

// Index for efficient querying
jobSchema.index({ status: 1, expiresAt: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ 'location.type': 1 });

// Check if job is expired
jobSchema.methods.isExpired = function () {
  return this.expiresAt && new Date() > this.expiresAt;
};

// Static method to find active jobs
jobSchema.statics.findActive = function () {
  return this.find({
    status: 'open',
    expiresAt: { $gt: new Date() },
  });
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
