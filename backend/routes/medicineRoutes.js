// backend/routes/medicineRoutes.js
const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const FuzzySearch = require('fuzzy-search');

// Helper function to escape special characters for regex
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// @route   GET /api/medicines/search
// @desc    Search for medicines by name (Smart Sort + Fuzzy Suggestion)
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const query = req.query.name;
    const escapedQuery = escapeRegex(query);

    // --- Step 1: Run the aggregation ---
    const medicines = await Medicine.aggregate([
      { $match: { name: { $regex: escapedQuery, $options: 'i' } } },
      
      // --- THIS LINE IS REMOVED ---
      // { $match: { is_discontinued: false } }, // <-- THIS WAS THE BUG
      
      { $addFields: { sideEffectCount: { $size: { $ifNull: ["$side_effects", []] } } } },
      { $sort: { sideEffectCount: 1 } },
      { $limit: 10 }
    ]);

    // --- Step 2: Check for results ---
    if (medicines.length > 0) {
      return res.json({ medicines: medicines, suggestion: null });
    }

    // --- Step 3: No results, so use fuzzy-search on our cache ---
    const medicineCache = req.app.locals.medicineNameCache;
    const searcher = new FuzzySearch(medicineCache, ['name'], {
      caseSensitive: false,
      sort: true 
    });
    
    const fuzzyResults = searcher.search(query);

    let suggestion = null;
    if (fuzzyResults.length > 0) {
      suggestion = fuzzyResults[0].name;
    }

    res.json({ medicines: [], suggestion: suggestion });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/medicines/byillness
// @desc    Search for medicines by illness/use (Smart Sort)
// @access  Public
router.get('/byillness', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ msg: 'Illness query is required' });
    }

    const escapedQuery = escapeRegex(query);

    const medicines = await Medicine.aggregate([
      { $match: { uses: { $regex: escapedQuery, $options: 'i' } } },

      // --- THIS LINE IS REMOVED ---
      // { $match: { is_discontinued: false } }, // <-- THIS WAS THE BUG

      { $addFields: { sideEffectCount: { $size: { $ifNull: ["$side_effects", []] } } } },
      { $sort: { sideEffectCount: 1 } },
      { $limit: 10 }
    ]);

    res.json(medicines);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   GET /api/medicines/byname
// @desc    Get a specific medicine by its exact name (case-insensitive)
// @access  Public
router.get('/byname', async (req, res) => {
  try {
    const medicineName = req.query.name;
    if (!medicineName) {
      return res.status(400).json({ msg: 'Medicine name query is required' });
    }
    
    const medicine = await Medicine.findOne({ 
      name: { $regex: new RegExp('^' + escapeRegex(medicineName.trim()) + '$', 'i') } 
    });

    if (!medicine) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }
    
    res.json(medicine);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/medicines/:id
// @desc    Get a specific medicine by its unique _id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }
    
    res.json(medicine);

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Medicine not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;