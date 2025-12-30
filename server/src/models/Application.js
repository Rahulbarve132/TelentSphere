const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      maxlength: [5000, 'Cover letter cannot exceed 5000 characters'],
    },
    resume: {
      type: String, // File path or URL
    },
    proposedRate: {
      amount: {
        type: Number,
        min: 0,
      },
      type: {
        type: String,
        enum: ['hourly', 'fixed', 'monthly'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    availability: {
      startDate: Date,
      hoursPerWeek: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: String,
      },
    ],
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: String,
      ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      ratedAt: Date,
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
    viewedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Index for efficient querying
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

// Update job applications count on save
applicationSchema.post('save', async function () {
  const Application = this.constructor;
  const count = await Application.countDocuments({ job: this.job });
  await mongoose.model('Job').findByIdAndUpdate(this.job, { applicationsCount: count });
});

// Static method to get applications by status
applicationSchema.statics.getByStatus = function (status) {
  return this.find({ status }).populate('job applicant');
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
