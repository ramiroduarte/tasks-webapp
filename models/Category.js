import mongoose from 'mongoose'
const { Schema } = mongoose;

const CategorySchema = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },
	creationDate: { type: Date, default: Date.now },
	tasksCompletedCount: { type: Number, default: 0},
	tasksCount: { type: Number, default: 0 }
})

export default mongoose.model('Category', CategorySchema);