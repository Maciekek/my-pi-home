import * as mongoose from 'mongoose';

export const LocationSchema = new mongoose.Schema({
    name: String,
    description: String,
    tempSettings: String,

});
