import express from 'express';
import Utilisateur from '../models/utilisateur.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/utilisateurs/register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, photoUri } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ message: 'Champs requis manquants' });
    const exists = await Utilisateur.findOne({ phone });
    if (exists) return res.status(409).json({ message: 'Utilisateur déjà existant' });
    const pepper = process.env.PIN_PEPPER || '';
    const pinKey = crypto.createHmac('sha256', pepper).update(password).digest('hex');
    const pinTaken = await Utilisateur.findOne({ pinKey });
    if (pinTaken) return res.status(409).json({ message: 'PIN déjà utilisé' });
    const user = await Utilisateur.create({ name, phone, password, photoUri, pinKey });
    res.status(201).json({ id: user._id, name: user.name, phone: user.phone, photoUri: user.photoUri });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', error: e?.message || String(e) });
  }
});

// POST /api/utilisateurs/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await Utilisateur.findOne({ phone });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });
    res.json({ id: user._id, name: user.name, phone: user.phone, photoUri: user.photoUri });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', error: e?.message || String(e) });
  }
});

// POST /api/utilisateurs/login-pin
// Warning: This approach scans users and compares bcrypt, suitable for small datasets.
router.post('/login-pin', async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ message: 'PIN requis' });
    const pepper = process.env.PIN_PEPPER || '';
    const pinKey = crypto.createHmac('sha256', pepper).update(pin).digest('hex');
    let user = await Utilisateur.findOne({ pinKey }, 'name phone photoUri password');
    if (user) {
      const ok = await user.matchPassword(pin);
      if (!ok) return res.status(401).json({ message: 'PIN invalide' });
      return res.json({ id: user._id, name: user.name, phone: user.phone, photoUri: user.photoUri });
    }
    const users = await Utilisateur.find({ pinKey: { $exists: false } }, 'name phone photoUri password');
    for (const u of users) {
      const ok = await u.matchPassword(pin);
      if (ok) {
        try {
          u.pinKey = pinKey;
          await u.save();
        } catch (_) {}
        return res.json({ id: u._id, name: u.name, phone: u.phone, photoUri: u.photoUri });
      }
    }
    return res.status(401).json({ message: 'PIN invalide' });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', error: e?.message || String(e) });
  }
});

// GET /api/utilisateurs/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', error: e?.message || String(e) });
  }
});

export default router;

