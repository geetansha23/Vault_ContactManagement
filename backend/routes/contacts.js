const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');


// ✅ GET contacts (pagination + search + filter)
router.get('/', async (req, res) => {
  try {
    const { search, tag, starred, page = 1, limit = 5 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag && tag !== 'All') {
      query.tag = tag;
    }

    if (starred === 'true') {
      query.starred = true;
    }

    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ starred: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ CREATE contact (FIX FOR YOUR ERROR)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, tag } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      company,
      tag,
    });

    const saved = await contact.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ✅ UPDATE contact
router.put('/:id', async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ✅ DELETE contact
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ TOGGLE STAR
router.patch('/:id/star', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    contact.starred = !contact.starred;
    await contact.save();

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;