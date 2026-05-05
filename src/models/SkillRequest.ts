import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillRequest extends Document {
  listingId: mongoose.Types.ObjectId | string;
  requesterId: mongoose.Types.ObjectId | string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const SkillRequestSchema: Schema = new Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'SkillListing', required: true },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SkillRequest || mongoose.model<ISkillRequest>('SkillRequest', SkillRequestSchema);
