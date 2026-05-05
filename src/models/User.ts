import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  avatarUrl?: string; // Kept for compatibility
  banner?: string;
  timeCredits: number;
  trustScore: number;
  onboardingComplete: boolean;
  skillsOffered: string[];
  skillsWanted: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Expert';
  availability: string[];
  bio: string;
  phone?: string;
  portfolioUrl?: string;
  trustLevel: 'Newbie' | 'Verified' | 'Trusted' | 'Elite';
  isAdmin: boolean;
  isBanned: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      select: false,
    },
    image: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    banner: {
      type: String,
    },
    timeCredits: {
      type: Number,
      default: 2,
    },
    trustScore: {
      type: Number,
      default: 50,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    skillsOffered: {
      type: [String],
      default: [],
    },
    skillsWanted: {
      type: [String],
      default: [],
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
    },
    availability: {
      type: [String],
      default: [],
      enum: ['Weekdays', 'Weekends', 'Evenings'],
    },
    bio: {
      type: String,
      maxlength: [120, 'Bio cannot exceed 120 characters'],
    },
    phone: {
      type: String,
      match: [/^\+?[1-9]\d{6,14}$/, 'Please provide a valid phone number'],
    },
    portfolioUrl: {
      type: String,
    },
    trustLevel: { 
      type: String, 
      enum: ['Newbie', 'Verified', 'Trusted', 'Elite'], 
      default: 'Newbie' 
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    lastActiveAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
