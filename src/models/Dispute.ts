import mongoose, { Schema, Document } from 'mongoose';

export interface IDispute extends Document {
  sessionId: mongoose.Types.ObjectId | string;
  filedBy: mongoose.Types.ObjectId | string;
  filedAgainst: mongoose.Types.ObjectId | string;
  reason: string;
  evidence: string;
  evidenceUrls: string[]; // Image/screenshot URLs as proof
  counterResponse?: string; // Accused party's response
  counterEvidenceUrls?: string[]; // Accused party's evidence
  respondedAt?: Date;
  status: 'open' | 'awaiting-response' | 'under-review' | 'resolved';
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
  evidenceUrls: { type: [String], default: [] },
  counterResponse: { type: String },
  counterEvidenceUrls: { type: [String], default: [] },
  respondedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['open', 'awaiting-response', 'under-review', 'resolved'], 
    default: 'open' 
  },
  resolution: { type: String },
  creditRefund: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

export default mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);
