import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Utilisateur from '../models/utilisateur.js';

dotenv.config();

async function run() {
  const name = 'Habib Diallo';
  const phone = '+221775958340';
  const password = '4567';
  const photoUri = '';

  try {
    await connectDB();
    const exists = await Utilisateur.findOne({ phone });
    if (exists) {
      console.log(`User already exists: ${exists.name} (${exists.phone}) id=${exists._id}`);
      process.exit(0);
    }
    const user = await Utilisateur.create({ name, phone, password, photoUri });
    console.log('User created:', { id: user._id.toString(), name: user.name, phone: user.phone });
    process.exit(0);
  } catch (e) {
    console.error('Seed error:', e?.message || e);
    process.exit(1);
  }
}

run();
