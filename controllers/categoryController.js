const path = require('path');
const { readJsonFile, writeJsonFile, readJsonBody } = require('../utils/helpers');

const CATEGORIES_FILE = path.join(__dirname, '../data', 'categories.json');

async function getAllCategories(req, res) {
  const categories = await readJsonFile(CATEGORIES_FILE);
  res.json(categories);
};

async function createCategory(req, res) {
  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const { name, slug, description } = body;

  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required' });
  }

  const categories = await readJsonFile(CATEGORIES_FILE);
  
  // Check if a category with this slug already exists
  if (categories.some(c => c.slug === slug)) {
    return res.status(400).json({ error: 'Category with this slug already exists' });
  }

  const newId = categories.length > 0 ? Math.max(...categories.map(c => c.category_id)) + 1 : 1;

  const newCategory = {
    category_id: newId,
    name,
    slug,
    description: description || ''
  };

  categories.push(newCategory);
  await writeJsonFile(CATEGORIES_FILE, categories);
  res.status(201).json(newCategory);
};

async function updateCategory(req, res) {
  const id = Number(req.params.id);
  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const categories = await readJsonFile(CATEGORIES_FILE);
  const categoryIndex = categories.findIndex((c) => c.category_id === id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Update provided fields
  if (body.name) categories[categoryIndex].name = body.name;
  if (body.slug) categories[categoryIndex].slug = body.slug;
  if (body.description !== undefined) categories[categoryIndex].description = body.description;

  await writeJsonFile(CATEGORIES_FILE, categories);
  res.json({ message: 'Category updated successfully', category: categories[categoryIndex] });
};

async function deleteCategory(req, res) {
  const id = Number(req.params.id);
  
  const categories = await readJsonFile(CATEGORIES_FILE);
  const categoryIndex = categories.findIndex((c) => c.category_id === id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Remove the category from the array
  const deletedCategory = categories.splice(categoryIndex, 1)[0];
  
  await writeJsonFile(CATEGORIES_FILE, categories);
  res.json({ message: 'Category deleted successfully', category: deletedCategory });
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };  