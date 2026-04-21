import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { del, put } from '@vercel/blob'
import {
  createMemoryProduct,
  deleteMemoryProduct,
  findProductById,
  getMemoryProducts,
  isMemoryMode,
  updateMemoryProduct,
} from '../data/devStore.js'
import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDirectory = path.resolve(__dirname, '../../uploads')
const allowedMimeTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/avif', '.avif'],
])

function sanitizeFileName(name = 'image') {
  return name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
}

function buildImageUrl(req, fileName) {
  return `${req.protocol}://${req.get('host')}/uploads/${fileName}`
}

function canUseBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function isVercelRuntime() {
  return Boolean(process.env.VERCEL)
}

function removeLocalUploads(images = []) {
  images.forEach((imageUrl) => {
    if (!imageUrl || !imageUrl.includes('/uploads/')) {
      return
    }

    const fileName = imageUrl.split('/uploads/').pop()
    if (!fileName) {
      return
    }

    const filePath = path.join(uploadsDirectory, path.basename(fileName))
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  })
}

async function removeUploadedImages(images = []) {
  const blobImages = images.filter((imageUrl) => imageUrl?.includes('.public.blob.vercel-storage.com'))
  const localImages = images.filter((imageUrl) => imageUrl && !blobImages.includes(imageUrl) && !imageUrl.startsWith('data:'))

  if (blobImages.length) {
    await del(blobImages)
  }

  removeLocalUploads(localImages)
}

export const getProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query

  if (isMemoryMode()) {
    res.json(getMemoryProducts({ category, search }))
    return
  }

  const query = {}

  if (category && category !== 'All') {
    query.category = category
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' }
  }

  const products = await Product.find(query).sort({ createdAt: -1 })
  res.json(products)
})

export const getProductById = asyncHandler(async (req, res) => {
  const product = isMemoryMode() ? findProductById(req.params.id) : await Product.findById(req.params.id)

  if (!product) {
    const error = new Error('Product not found')
    error.statusCode = 404
    throw error
  }

  res.json(product)
})

export const createProduct = asyncHandler(async (req, res) => {
  const product = isMemoryMode() ? createMemoryProduct(req.body) : await Product.create(req.body)
  res.status(201).json(product)
})

export const uploadProductImage = asyncHandler(async (req, res) => {
  const { fileName, contentType, data } = req.body

  if (!data || !contentType) {
    const error = new Error('Image file data is required')
    error.statusCode = 400
    throw error
  }

  const extension = allowedMimeTypes.get(contentType)
  if (!extension) {
    const error = new Error('Only JPG, PNG, WEBP, GIF, and AVIF images are allowed')
    error.statusCode = 400
    throw error
  }

  const base64Payload = data.includes(',') ? data.split(',').pop() : data
  const buffer = Buffer.from(base64Payload, 'base64')

  if (!buffer.length) {
    const error = new Error('Uploaded image is empty')
    error.statusCode = 400
    throw error
  }

  if (canUseBlobStorage()) {
    const blob = await put(`products/${Date.now()}-${sanitizeFileName(fileName || 'product-image')}${extension}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    })

    res.status(201).json({
      imageUrl: blob.url,
      fileName: blob.pathname,
      storage: 'blob',
    })
    return
  }

  if (isVercelRuntime()) {
    res.status(201).json({
      imageUrl: `data:${contentType};base64,${base64Payload}`,
      fileName: sanitizeFileName(fileName || 'product-image'),
      storage: 'inline',
    })
    return
  }

  fs.mkdirSync(uploadsDirectory, { recursive: true })

  const safeBaseName = path.basename(sanitizeFileName(fileName || 'product-image'), path.extname(fileName || ''))
  const storedFileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safeBaseName}${extension}`
  const storedFilePath = path.join(uploadsDirectory, storedFileName)

  fs.writeFileSync(storedFilePath, buffer)

  res.status(201).json({
    imageUrl: buildImageUrl(req, storedFileName),
    fileName: storedFileName,
    storage: 'local',
  })
})

export const updateProduct = asyncHandler(async (req, res) => {
  if (isMemoryMode()) {
    const updatedProduct = updateMemoryProduct(req.params.id, req.body)

    if (!updatedProduct) {
      const error = new Error('Product not found')
      error.statusCode = 404
      throw error
    }

    res.json(updatedProduct)
    return
  }

  const product = await Product.findById(req.params.id)

  if (!product) {
    const error = new Error('Product not found')
    error.statusCode = 404
    throw error
  }

  Object.assign(product, req.body)
  const updatedProduct = await product.save()
  res.json(updatedProduct)
})

export const deleteProduct = asyncHandler(async (req, res) => {
  if (isMemoryMode()) {
    const existingProduct = findProductById(req.params.id)
    if (existingProduct?.images?.length) {
      await removeUploadedImages(existingProduct.images)
    }

    const didDelete = deleteMemoryProduct(req.params.id)

    if (!didDelete) {
      const error = new Error('Product not found')
      error.statusCode = 404
      throw error
    }

    res.json({ message: 'Product deleted successfully' })
    return
  }

  const product = await Product.findById(req.params.id)

  if (!product) {
    const error = new Error('Product not found')
    error.statusCode = 404
    throw error
  }

  await removeUploadedImages(product.images)
  await product.deleteOne()
  res.json({ message: 'Product deleted successfully' })
})
