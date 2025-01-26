const router = require('express').Router();
const { getDashboard, getUsers, updateUserRole, getPendingReviews } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/reviews/pending', getPendingReviews);

module.exports = router;
