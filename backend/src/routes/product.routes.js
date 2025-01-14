const router = require('express').Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, searchSuggestions,
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getProducts);
router.get('/search/suggestions', searchSuggestions);
router.get('/:slug', getProduct);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
