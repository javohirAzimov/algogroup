import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new Error('Images only'))
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

export async function uploadSingle(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    const result  = await cloudinary.uploader.upload(dataUri, { folder: 'algo-portal' })
    res.json({ url: result.secure_url })
  } catch {
    res.status(500).json({ error: 'Upload failed' })
  }
}
