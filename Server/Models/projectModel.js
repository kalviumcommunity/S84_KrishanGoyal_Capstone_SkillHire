const {Schema, model} = require('mongoose')

const projectSchema = new Schema({
    title:{
        type: String,
        required: [true, 'Title is required']
    },
    category:{
        type: String,
        required: [true, 'Category is required']
    },
    description:{
        type: String,
        required: [true, 'Decription is required']
    },
    dueDate:{
        type: Date
    },
    postedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},

  {  timestamps: true   }

)

const projectModel = model('Project', projectSchema)

module.exports = projectModel