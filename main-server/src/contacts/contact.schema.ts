import * as mongoose from 'mongoose';

export const ContactEventSchema = new mongoose.Schema({
  locationId: { type: String, index: true },
  sensorId: String,
  name: String,
  isOpen: Boolean,
  date: Date,
});

ContactEventSchema.index({ locationId: 1, sensorId: 1, date: -1 });
