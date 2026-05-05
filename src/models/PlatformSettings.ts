import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformSettings extends Document {
  freezeEconomy: boolean;
  disableSignups: boolean;
  maintenanceMode: boolean;
  updatedBy: mongoose.Types.ObjectId | string;
  updatedAt: Date;
}

const PlatformSettingsSchema: Schema = new Schema({
  freezeEconomy: { type: Boolean, default: false },
  disableSignups: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.PlatformSettings || mongoose.model<IPlatformSettings>('PlatformSettings', PlatformSettingsSchema);
