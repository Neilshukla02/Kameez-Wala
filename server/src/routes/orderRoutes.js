import express from 'express'
import { getUserOrders, placeOrder } from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/', getUserOrders)
router.post('/', placeOrder)

export default router
