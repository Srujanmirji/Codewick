import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  listingId: mongoose.Types.ObjectId | string;
  providerId: mongoose.Types.ObjectId | string;
  learnerId: mongoose.Types.ObjectId | string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'disputed';
  scheduledAt: Date;
  completedAt?: Date;
  duration: number; // in hours
  providerRating?: number; // Rating given to provider by learner
  learnerRating?: number; // Rating given to learner by provider
  providerReview?: string;
  learnerReview?: string;
  providerConfirmed: boolean;
  learnerConfirmed: boolean;
  createdAt: Date;
}

const SessionSchema: Schema = new Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'SkillListing', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'in-progress', 'completed', 'disputed'], 
    default: 'scheduled' 
  },
  scheduledAt: { type: Date, required: true },
  completedAt: { type: Date },
  duration: { type: Number, default: 1 },
  providerRating: { type: Number, min: 1, max: 5 },
  learnerRating: { type: Number, min: 1, max: 5 },
  providerReview: { type: String },
  learnerReview: { type: String },
  providerConfirmed: { type: Boolean, default: false },
  learnerConfirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
