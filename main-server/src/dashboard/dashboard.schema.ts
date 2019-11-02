import * as mongoose from 'mongoose';

export const DashboardSchema = new mongoose.Schema({
    locationId: String,
    config: String,
});
