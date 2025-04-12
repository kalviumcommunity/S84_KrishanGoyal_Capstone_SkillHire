const {Schema, model} = require('mongoose')

const projectSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    dueDate:{
        type: Date
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},

  {  timestamps: true   }

)

const projectModel = model('Project', projectSchema)

module.exports = projectModel