import {
  addMemoryCartItem,
  findProductById,
  getPopulatedMemoryCart,
  isMemoryMode,
  removeMemoryCartItem,
  updateMemoryCartItem,
} from '../data/devStore.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'

async function getPopulatedCart(userId) {
  if (isMemoryMode()) {
    return getPopulatedMemoryCart(userId)
  }

  let cart = await Cart.findOne({ user: userId }).populate('items.product')
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] })
    cart = await Cart.findById(cart._id).populate('items.product')
  }

  return cart
}

export const getUserCart = asyncHandler(async (req, res) => {
  const cart = await getPopulatedCart(req.user._id)
  res.json(cart)
})

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, selectedSize = 'Standard' } = req.body

  if (isMemoryMode()) {
    const product = findProductById(productId)

    if (!product) {
      const error = new Error('Product not found')
      error.statusCode = 404
      throw error
    }

    const cart = addMemoryCartItem(req.user._id, { productId, quantity, selectedSize })
    res.status(201).json(cart)
    return
  }

  const product = await Product.findById(productId)
  if (!product) {
    const error = new Error('Product not found')
    error.statusCode = 404
    throw error
  }

  const cart = await getPopulatedCart(req.user._id)
  const existingItem = cart.items.find(
    (item) =>
      String(item.product._id) === String(productId) &&
      item.selectedSize === selectedSize,
  )

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.items.push({
      product: productId,
      quantity,
      selectedSize,
    })
  }

  await cart.save()
  await cart.populate('items.product')
  res.status(201).json(cart)
})

export const removeFromCart = asyncHandler(async (req, res) => {
  if (isMemoryMode()) {
    const cart = removeMemoryCartItem(req.user._id, req.params.itemId)
    res.json(cart)
    return
  }

  const cart = await getPopulatedCart(req.user._id)
  cart.items = cart.items.filter((item) => String(item._id) !== req.params.itemId)
  await cart.save()
  await cart.populate('items.product')
  res.json(cart)
})

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body

  if (isMemoryMode()) {
    const cart = updateMemoryCartItem(req.user._id, req.params.itemId, quantity)

    if (!cart) {
      const error = new Error('Cart item not found')
      error.statusCode = 404
      throw error
    }

    res.json(cart)
    return
  }

  const cart = await getPopulatedCart(req.user._id)
  const item = cart.items.id(req.params.itemId)

  if (!item) {
    const error = new Error('Cart item not found')
    error.statusCode = 404
    throw error
  }

  item.quantity = Math.max(1, quantity)
  await cart.save()
  await cart.populate('items.product')
  res.json(cart)
})
