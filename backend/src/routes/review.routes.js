const router = require('express').Router();
const { getProductReviews, addReview, approveReview, deleteReview } = require('../controllers/review.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, addReview);
router.put('/:id/approve', protect, adminOnly, approveReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
