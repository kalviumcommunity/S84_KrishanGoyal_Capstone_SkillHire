const moment = require('moment-timezone');
const { Schema, model } = require('mongoose');

const proProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['yet to be assigned', 'assigned but not completed', 'completed'], default: 'yet to be assigned' },
    budget: { type: Number, required: true },
    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    bidValues: { type: Number, default: 0 },
    type: {
        type: String,
        default: 'pro'
    },
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

module.exports = model('ProProject', proProjectSchema);