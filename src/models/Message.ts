import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  senderId: mongoose.Types.ObjectId | string;
  receiverId: mongoose.Types.ObjectId | string;
  text: string;
  type: 'text' | 'swap-request' | 'system';
  metadata?: {
    listingId?: string;
    skillRequestId?: string;
    skillOffered?: string;
    skillWanted?: string;
    creditCost?: number;
    status?: 'pending' | 'accepted' | 'rejected';
  };
  read: boolean;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  conversationId: { type: String, required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'swap-request', 'system'], 
    default: 'text' 
  },
  metadata: {
    listingId: String,
    skillRequestId: String,
    skillOffered: String,
    skillWanted: String,
    creditCost: Number,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'] }
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Helper to generate a consistent conversation ID between two users
MessageSchema.statics.getConversationId = function(userId1: string, userId2: string) {
  return [userId1, userId2].sort().join('_');
};

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
