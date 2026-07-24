const Content = require('../models/Content');

// public - used by the website to render a page. no auth needed here.
async function getPageContent(req, res) {
  const { page } = req.params;
  const sections = await Content.find({ page }).sort({ order: 1 });
  res.json(sections);
}

// admin - list everything for the dashboard, grouped loosely by page
async function getAllContent(req, res) {
  const sections = await Content.find().sort({ page: 1, order: 1 });
  res.json(sections);
}

async function getOne(req, res) {
  const section = await Content.findById(req.params.id);
  if (!section) return res.status(404).json({ message: 'not found' });
  res.json(section);
}

async function createContent(req, res) {
  const { page, section, title, blocks, order } = req.body;

  if (!page || !section) {
    return res.status(400).json({ message: 'page and section are required' });
  }

  try {
    const created = await Content.create({ page, section, title, blocks, order });
    res.status(201).json(created);
  } catch (err) {
    // most likely the unique page+section index got violated
    res.status(400).json({ message: err.message });
  }
}

async function updateContent(req, res) {
  const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!updated) return res.status(404).json({ message: 'not found' });
  res.json(updated);
}

async function deleteContent(req, res) {
  const deleted = await Content.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'not found' });
  res.json({ message: 'deleted' });
}

module.exports = {
  getPageContent,
  getAllContent,
  getOne,
  createContent,
  updateContent,
  deleteContent
};
