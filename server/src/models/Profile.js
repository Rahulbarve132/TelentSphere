const mongoose = require('mongoose');

// ─── Company sub-document schema ─────────────────────────────────────────────
// Defined as a named Schema so Mongoose auto-generates _id (companyId) for it.
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  website: {
    type: String,
    required: [true, 'Company website is required'],
    trim: true,
  },
  size: {
    type: String,
    required: [true, 'Company size is required'],
    enum: ['1-10', '11-50', '51-200', '201-500', '500+', '1', '2-10', '501-1000', '1000+'],
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Company description is required'],
    maxlength: [2000, 'Company description cannot exceed 2000 characters'],
  },
  city: {
    type: String,
    required: [true, 'Company city is required'],
    trim: true,
  },
  logo: {
    type: String,
    default: null,
  },
  isIndependentPractitioner: {
    type: Boolean,
    required: [true, 'Please specify if this is an independent practitioner'],
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'unverified'],
    default: 'unverified',
  },
  verificationMethod: {
    type: String,
    required: [true, 'Verification method is required'],
    enum: ['website', 'social_media', 'document', 'none'],
    default: 'none',
  },
  verifiedWebsite: {
    type: String,
    trim: true,
  },
  verifiedSocialMedia: {
    platform: { type: String },
    url:      { type: String },
    followers:{ type: Number },
  },
  contactEmail: {
    type: String,
    required: [true, 'Company contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid contact email'],
  },
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: String,
  from: {
    type: Date,
    required: true,
  },
  to: Date,
  current: {
    type: Boolean,
    default: false,
  },
  description: String,
});

const educationSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  fieldOfStudy: String,
  from: {
    type: Date,
    required: true,
  },
  to: Date,
  current: {
    type: Boolean,
    default: false,
  },
  description: String,
});

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    headline: {
      type: String,
      maxlength: [200, 'Headline cannot exceed 200 characters'],
    },
    bio: {
      type: String,
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    experience: [experienceSchema],
    education: [educationSchema],
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      portfolio: String,
    },
    hourlyRate: {
      type: Number,
      min: 0,
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'not-available'],
      default: 'available',
    },
    // For recruiters / clients — comprehensive company info with verification.
    // Uses companySchema so Mongoose auto-generates a unique _id (companyId).
    company: companySchema,
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
profileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON output
profileSchema.set('toJSON', { virtuals: true });
profileSchema.set('toObject', { virtuals: true });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
