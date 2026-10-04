import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { createOrder, verifyPayment } from '../controllers/paymentController.js'



const router = express.Router()

router.post('/order', isAuthenticated, createOrder)
router.post('/verify', isAuthenticated, verifyPayment)


export default router