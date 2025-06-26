const moment = require('moment-timezone');
const { Schema, model } = require('mongoose');

const proProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Due date must be in the future'
        }
    },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['yet to be assigned', 'assigned but not completed', 'pending confirmation', 'completed'], default: 'yet to be assigned' },
    completedAt:{type: Date},
    paidAt:{type: Date},
    budget: { type: Number, required: true },
    proposedBudget: { type: Number },
    paymentNotes: { type: String },
    paymentStatus: {
        type: String,
        enum: ['none', 'proposed', 'confirmed'],
        default: 'none'
    },
    applicants: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            pitch: { type: String }
        }
    ],
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