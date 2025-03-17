import { v2 as cloudinary } from 'cloudinary'
import '../config/cloudinary.js'

export async function uploadImage(folder, filePath) {
	return await cloudinary.uploader.upload(filePath, {
		folder: `tasks-webapp/${folder}`
	})
}

export async function deleteImage(publicId) {
	return await cloudinary.uploader.destroy(publicId)
}