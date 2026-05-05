import mongoose, { Schema, Document } from 'mongoose';

export interface IDispute extends Document {
  sessionId: mongoose.Types.ObjectId | string;
  filedBy: mongoose.Types.ObjectId | string;
  filedAgainst: mongoose.Types.ObjectId | string;
  reason: string;
  evidence: string;
  status: 'open' | 'under-review' | 'resolved';
  resolution?: string;
  creditRefund: number;
  createdAt: Date;
  resolvedAt?: Date;
}

const DisputeSchema: Schema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  filedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filedAgainst: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  evidence: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'under-review', 'resolved'], 
    default: 'open' 
  },
  resolution: { type: String },
  creditRefund: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

export default mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);
