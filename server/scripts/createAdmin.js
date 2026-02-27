/**
 * ─────────────────────────────────────────────────────────────────
 *  TalentSphere — Create Admin Account Script
 *  Usage:  npm run create:admin
 *
 *  Reads credentials from environment variables if set, or uses
 *  the safe defaults below.  You can override any value by passing
 *  env vars inline:
 *
 *    ADMIN_EMAIL=ceo@company.com ADMIN_PASSWORD=Str0ngPass! npm run create:admin
 * ─────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

// ── Models (inline to avoid importing the full server stack) ──────────────────
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email:                    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:                 { type: String, required: true, minlength: 8, select: false },
    role:                     { type: String, enum: ['talent', 'client', 'recruiter', 'admin'], default: 'talent' },
    isVerified:               { type: Boolean, default: false },
    isActive:                 { type: Boolean, default: true },
    verificationToken:        String,
    verificationTokenExpiry:  Date,
    resetPasswordToken:       String,
    resetPasswordTokenExpiry: Date,
    refreshToken:             String,
    lastLogin:                Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const profileSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const User    = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

// ── Config ────────────────────────────────────────────────────────────────────
const DEFAULT_EMAIL     = 'admin@talentsphere.com';
const DEFAULT_PASSWORD  = 'Admin@123456';
const DEFAULT_FIRSTNAME = 'Super';
const DEFAULT_LASTNAME  = 'Admin';

const ADMIN_EMAIL     = process.env.ADMIN_EMAIL     || DEFAULT_EMAIL;
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD  || DEFAULT_PASSWORD;
const ADMIN_FIRSTNAME = process.env.ADMIN_FIRSTNAME || DEFAULT_FIRSTNAME;
const ADMIN_LASTNAME  = process.env.ADMIN_LASTNAME  || DEFAULT_LASTNAME;

// ── Helpers ───────────────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const divider = () => console.log('─'.repeat(60));

// ── Main ──────────────────────────────────────────────────────────────────────
async function createAdmin() {
  divider();
  console.log('  🛡️  TalentSphere — Create Admin Account');
  divider();

  // ── Connect to DB ──────────────────────────────────────────────
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('\n  ❌  MONGODB_URI is not set in your .env file.\n');
    process.exit(1);
  }

  console.log('\n  Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('  ✅  Connected.\n');

  // ── Confirm credentials ────────────────────────────────────────
  console.log('  Admin account will be created with:');
  console.log(`     Name     : ${ADMIN_FIRSTNAME} ${ADMIN_LASTNAME}`);
  console.log(`     Email    : ${ADMIN_EMAIL}`);
  console.log(`     Password : ${ADMIN_PASSWORD}`);
  console.log();

  const confirm = await ask('  Proceed? (yes/no): ');
  if (!['yes', 'y'].includes(confirm.trim().toLowerCase())) {
    console.log('\n  ⚠️   Aborted.\n');
    await mongoose.disconnect();
    rl.close();
    process.exit(0);
  }

  console.log();

  // ── Check if admin already exists ─────────────────────────────
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role === 'admin') {
      console.log(`  ⚠️   An admin account with email "${ADMIN_EMAIL}" already exists.\n`);
    } else {
      // Upgrade existing non-admin user to admin
      existing.role       = 'admin';
      existing.isVerified = true;
      existing.isActive   = true;
      await existing.save({ validateBeforeSave: false });
      console.log(`  ✅  Existing user "${ADMIN_EMAIL}" has been upgraded to admin.\n`);
    }
    await mongoose.disconnect();
    rl.close();
    return;
  }

  // ── Create the admin user ──────────────────────────────────────
  const user = new User({
    email:      ADMIN_EMAIL,
    password:   ADMIN_PASSWORD,
    role:       'admin',
    isVerified: true,   // admin does not need email verification
    isActive:   true,
  });
  await user.save();

  // ── Create matching profile ────────────────────────────────────
  await Profile.create({
    user:      user._id,
    firstName: ADMIN_FIRSTNAME,
    lastName:  ADMIN_LASTNAME,
  });

  // ── Done ───────────────────────────────────────────────────────
  divider();
  console.log('  ✅  Admin account created successfully!\n');
  console.log(`     ID       : ${user._id}`);
  console.log(`     Email    : ${ADMIN_EMAIL}`);
  console.log(`     Password : ${ADMIN_PASSWORD}`);
  console.log(`     Role     : admin`);
  console.log(`     Verified : true`);
  divider();
  console.log('\n  You can now log in via  POST /api/auth/login\n');

  await mongoose.disconnect();
  rl.close();
}

createAdmin().catch((err) => {
  console.error('\n  ❌  Error:', err.message, '\n');
  mongoose.disconnect();
  rl.close();
  process.exit(1);
});
