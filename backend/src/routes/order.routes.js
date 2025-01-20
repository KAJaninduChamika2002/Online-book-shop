const router = require('express').Router();
const { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
