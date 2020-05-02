import * as mongoose from 'mongoose';

export const RelayDeviceSchema = new mongoose.Schema({
    locationId: String,
    ip: String,
    gpio: String,
    type: String,
    name: String,
    state: String,
});
