import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId | string;
  type: 'trust-change' | 'dispute-filed' | 'dispute-resolved' | 'session-completed' | 'match-found' | 'system';
  title: string;
  message: string;
  metadata?: {
    oldScore?: number;
    newScore?: number;
    changeAmount?: number;
    disputeId?: string;
    sessionId?: string;
  };
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    enum: ['trust-change', 'dispute-filed', 'dispute-resolved', 'session-completed', 'match-found', 'system', 'community-reply', 'community-resolved'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  metadata: {
    oldScore: Number,
    newScore: Number,
    changeAmount: Number,
    disputeId: String,
    sessionId: String,
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
