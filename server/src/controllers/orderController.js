import { createMemoryOrder, getMemoryCart, getMemoryOrders, isMemoryMode } from '../data/devStore.js'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const placeOrder = asyncHandler(async (req, res) => {
  const { address } = req.body

  if (
    !address?.fullName ||
    !address?.phone ||
    !address?.city ||
    !address?.state ||
    !address?.postalCode ||
    !address?.country ||
    !address?.street
  ) {
    const error = new Error('Please complete the delivery address')
    error.statusCode = 400
    throw error
  }

  if (isMemoryMode()) {
    const cart = getMemoryCart(req.user._id)

    if (!cart || cart.items.length === 0) {
      const error = new Error('Cart is empty')
      error.statusCode = 400
      throw error
    }

    const order = createMemoryOrder(req.user._id, address)
    res.status(201).json(order)
    return
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')

  if (!cart || cart.items.length === 0) {
    const error = new Error('Cart is empty')
    error.statusCode = 400
    throw error
  }

  const products = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0] || '',
    price: item.product.price,
    quantity: item.quantity,
    selectedSize: item.selectedSize,
  }))

  const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const order = await Order.create({
    user: req.user._id,
    products,
    totalPrice,
    address,
  })

  cart.items = []
  await cart.save()

  res.status(201).json(order)
})

export const getUserOrders = asyncHandler(async (req, res) => {
  if (isMemoryMode()) {
    res.json(getMemoryOrders(req.user._id))
    return
  }

  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(orders)
})
