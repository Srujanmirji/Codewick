import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  senderId?: mongoose.Types.ObjectId | string;
  receiverId: mongoose.Types.ObjectId | string;
  amount: number;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  description: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  senderId: { type: Schema.Types.Mixed, ref: 'User' },
  receiverId: { type: Schema.Types.Mixed, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['earned', 'spent', 'bonus', 'penalty'], 
    required: true 
  },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
