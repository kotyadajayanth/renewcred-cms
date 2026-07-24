const mongoose = require('mongoose');

// every block on the page is one of these. "data" shape changes depending on type,
// that's why it's Mixed instead of a strict sub-schema - trying to make a rigid
// schema for every content type (table vs equation vs list) would mean a migration
// every time the design adds a new content type.
const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['heading', 'paragraph', 'list', 'table', 'equation', 'image']
  },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const contentSchema = new mongoose.Schema({
  page: { type: String, required: true },      // "home", "about", "pricing"...
  section: { type: String, required: true },    // "hero", "features", "faq"...
  title: { type: String, default: '' },
  blocks: { type: [blockSchema], default: [] },
  order: { type: Number, default: 0 }
}, { timestamps: true });

contentSchema.index({ page: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Content', contentSchema);
