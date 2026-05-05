import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillListing extends Document {
  userId: mongoose.Types.ObjectId | string;
  skillOffered: string;
  skillWanted: string;
  description: string;
  creditCost: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
}

const SkillListingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skillOffered: { type: String, required: true },
  skillWanted: { type: String, required: true },
  description: { type: String, required: true },
  creditCost: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'completed', 'cancelled'], 
    default: 'open' 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SkillListing || mongoose.model<ISkillListing>('SkillListing', SkillListingSchema);
