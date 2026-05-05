import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  banner?: string;
  onboardingComplete: boolean;
  skillsOffered: string[];
  skillsWanted: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Expert';
  availability: string[];
  bio: string;
  portfolioUrl?: string;
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
      select: false, // Don't return password by default
    },
    image: {
      type: String,
    },
    banner: {
      type: String,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    skillsOffered: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 5,
        message: 'You can offer up to 5 skills',
      },
    },
    skillsWanted: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 5,
        message: 'You can want up to 5 skills',
      },
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
    portfolioUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of the model in Next.js development mode
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
