import mongoose from 'mongoose'
const { Schema } = mongoose;

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, defualt: ''},
    user: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: Date.now },
    priority: { type: String, default: '0' },	
    category: { type: String, required: true },
    completed: { type: Boolean, default: false }
})

export default mongoose.model('Task', TaskSchema);