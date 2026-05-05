import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId | any;
  content: string;
  isAccepted: boolean;
  createdAt: Date;
}

export interface IQuestion extends Document {
  author: mongoose.Types.ObjectId | any;
  title: string;
  description: string;
  bounty: number;
  tags: string[];
  status: 'open' | 'resolved';
  resolvedBy?: mongoose.Types.ObjectId | any;
  answers: IAnswer[];
  createdAt: Date;
}

const AnswerSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isAccepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const QuestionSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  bounty: { type: Number, required: true, default: 0 },
  tags: [{ type: String }],
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  answers: [AnswerSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
