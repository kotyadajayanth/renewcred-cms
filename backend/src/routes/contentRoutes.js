const express = require('express');
const requireAuth = require('../middleware/auth');
const {
  getPageContent,
  getAllContent,
  getOne,
  createContent,
  updateContent,
  deleteContent
} = require('../controllers/contentController');

const router = express.Router();

// public, consumed by the website
router.get('/public/:page', getPageContent);

// admin only, consumed by the CMS dashboard
router.get('/', requireAuth, getAllContent);
router.get('/:id', requireAuth, getOne);
router.post('/', requireAuth, createContent);
router.put('/:id', requireAuth, updateContent);
router.delete('/:id', requireAuth, deleteContent);

module.exports = router;
