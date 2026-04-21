import express from 'express'
import {
  addToCart,
  getUserCart,
  removeFromCart,
  updateCartItemQuantity,
} from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/', getUserCart)
router.post('/', addToCart)
router.put('/:itemId', updateCartItemQuantity)
router.delete('/:itemId', removeFromCart)

export default router
