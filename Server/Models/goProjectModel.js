const { Schema, model } = require('mongoose');
const moment = require('moment-timezone');


const goProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['yet to be assigned', 'assigned but not completed', 'completed'], default: 'yet to be assigned' },
    city: { type: String, required: true },
    type:{
        type: String,
        default: 'go'
    },
    subCity: { type: String },
    category: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.createdAt = moment(ret.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
            ret.updatedAt = moment(ret.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
            return ret;
        }
    },
    toObject: {
        transform(doc, ret) {
            ret.createdAt = moment(ret.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
            ret.updatedAt = moment(ret.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
            return ret;
        }
    }
});

module.exports = model('GoProject', goProjectSchema);