import mongoose from 'mongoose'
const { Schema } = mongoose;

const CategorySchema = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },
	active: { type: Boolean, default: false },
	creationDate: { type: Date, default: Date.now }
})

export default mongoose.model('Category', CategorySchema);