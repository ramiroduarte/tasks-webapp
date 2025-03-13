import mongoose from 'mongoose'
const { Schema } = mongoose;

const CategorySchema = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },
	creationDate: { type: Date, default: Date.now }
})

export default mongoose.model('Category', CategorySchema);