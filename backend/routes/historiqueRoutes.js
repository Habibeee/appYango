import express from 'express';
import Historique from '../models/historique.js';

const router = express.Router();

// POST /api/historiques
router.post('/', async (req, res) => {
  try {
    const { userId, name, address, lat, lng } = req.body;
    if (!userId || lat == null || lng == null) {
      return res.status(400).json({ message: 'userId, lat, lng requis' });
    }
    const created = await Historique.create({ user: userId, name, address, lat, lng });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', error: e?.message || String(e) });
  }
});

// GET /api/historiques/:userId
router.get('/:userId', async (req, res) => {
  try {
    const items = await Historique.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', error: e?.message || String(e) });
  }
});

// DELETE /api/historiques/:id
router.delete('/:id', async (req, res) => {
  try {
    const item = await Historique.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Historique introuvable' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', error: e?.message || String(e) });
  }
});

export default router;

