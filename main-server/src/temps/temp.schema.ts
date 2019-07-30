import * as mongoose from 'mongoose';

export const TempSchema = new mongoose.Schema({
    value: Number,
    date: Date,
    locationId: String,
    sensorId: String,

});
